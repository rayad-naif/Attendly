'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { detectMeeting } = require('../src/meeting-url');
const { vttToText } = require('../src/vtt');
const { buildNote, splitNote, createNotes } = require('../src/notes');
const { sanitize, forCalendar } = require('../src/settings');
const { summaryText } = require('../src/providers/zoom');

test('detects meeting platforms from appointment addresses', () => {
  assert.deepEqual(detectMeeting('Join: https://us02web.zoom.us/j/81234567890?pwd=abc').meetingId, '81234567890');
  assert.equal(detectMeeting('https://zoom.us/my/coachcarter').vanity, 'coachcarter');
  assert.equal(detectMeeting('https://meet.google.com/abc-defg-hij?authuser=0').code, 'abc-defg-hij');
  const t = detectMeeting('https://teams.microsoft.com/l/meetup-join/19%3ameeting_x%40thread.v2/0?context=%7b%7d');
  assert.equal(t.provider, 'teams');
  assert.ok(t.joinUrl.includes('meetup-join'));
  assert.equal(detectMeeting('https://teams.microsoft.com/meet/2345678901234?p=Ab12').meetingCode, '2345678901234');
  assert.equal(detectMeeting('https://teams.live.com/meet/9311').unsupported, 'personal');
  assert.equal(detectMeeting('123 Main St'), null);
  assert.equal(detectMeeting(''), null);
});

test('VTT parsing handles Zoom and Teams speaker formats', () => {
  const zoom = 'WEBVTT\n\n1\n00:00:01.000 --> 00:00:03.000\nJane Doe: Hello there\n\n2\n00:00:03.000 --> 00:00:05.000\nJane Doe: how are you\n\n3\n00:00:05.000 --> 00:00:06.000\nCoach: Good';
  assert.equal(vttToText(zoom), 'Jane Doe: Hello there how are you\nCoach: Good');
  const teams = 'WEBVTT\n\n00:00:00.000 --> 00:00:02.000\n<v Ana López>Hola</v>';
  assert.equal(vttToText(teams), 'Ana López: Hola');
});

test('settings are sanitised and per-calendar overrides apply', () => {
  const s = sanitize({ mode: 'weird', minMinutes: -5, tags: { showed: 'x' }, calendars: { cal_123: { minMinutes: 20 }, 'bad id!': { mode: 'off' } } });
  assert.equal(s.mode, 'auto');
  assert.equal(s.minMinutes, 0);
  assert.equal(s.tags.showed, 'x');
  assert.equal(s.tags.noshow, 'meeting-noshow');
  assert.deepEqual(Object.keys(s.calendars), ['cal_123']);
  assert.equal(forCalendar(s, 'cal_123').minMinutes, 20);
  assert.equal(forCalendar(s, 'other').minMinutes, 0);
});

test('note building and splitting', () => {
  const meta = { title: 'Strategy Call', platform: 'Zoom', start: Date.parse('2026-11-02T14:00:00Z'), end: 0, sourceKind: 'transcript' };
  const note = buildNote({
    meta, appName: 'MA', tz: 'UTC',
    result: { decision: 'showed', minutes: 42, pct: 93, joinedAt: Date.parse('2026-11-02T14:03:00Z') },
    notes: { summary: 'We agreed a plan.', key_points: ['Budget'], decisions: [], action_items: [{ owner: 'Jane', task: 'Send report', due: 'Fri' }], next_step: 'Follow-up call', attendees: [] }
  });
  assert.match(note, /Attendance: Showed - 42 min \(93%\)/);
  assert.match(note, /\[Jane\] Send report \(due Fri\)/);
  assert.doesNotMatch(note, /Decisions/);
  const parts = splitNote('a\n'.repeat(3000), 1000);
  assert.ok(parts.length > 1);
  assert.ok(parts.every((p) => p.length <= 1000));
  assert.match(parts[0], /^\(Part 1\/\d+\)/);
  assert.deepEqual(splitNote('short', 100), ['short']);
});

test('summarize sends a Gemini JSON-schema request and parses the answer', async () => {
  let sent;
  const http = { request: async (url, opts) => { sent = { url, opts }; return { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ summary: 'S', key_points: [], decisions: [], action_items: [], next_step: '', attendees: [] }) }] } }] }; } };
  const n = createNotes({ cfg: { gemini: { apiKey: 'k', model: 'gemini-3.6-flash' } }, http });
  assert.equal(n.enabled, true);
  const out = await n.summarize({ kind: 'transcript', text: 'Jane: hi' }, { title: 'T', platform: 'Zoom', start: 0, end: 0 }, null);
  assert.equal(out.summary, 'S');
  assert.equal(sent.url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent');
  assert.equal(sent.opts.headers['x-goog-api-key'], 'k');
  assert.equal(sent.opts.json.generationConfig.responseMimeType, 'application/json');
  assert.equal(sent.opts.json.generationConfig.responseSchema.type, 'OBJECT');
  assert.match(sent.opts.json.contents[0].parts[0].text, /<source>\nJane: hi\n<\/source>/);
});

test('summarize reports blocked or cut-off answers as NotesUnavailable', async () => {
  const mk = (r) => createNotes({ cfg: { gemini: { apiKey: 'k', model: 'm' } }, http: { request: async () => r } });
  await assert.rejects(mk({ promptFeedback: { blockReason: 'SAFETY' } }).summarize({ kind: 'transcript', text: 'x' }, { start: 0, end: 0 }, null), { name: 'NotesUnavailable' });
  await assert.rejects(mk({ candidates: [{ finishReason: 'MAX_TOKENS', content: { parts: [{ text: '{' }] } }] }).summarize({ kind: 'transcript', text: 'x' }, { start: 0, end: 0 }, null), { name: 'NotesUnavailable' });
  await assert.rejects(createNotes({ cfg: { gemini: { apiKey: '', model: 'm' } }, http: {} }).summarize({ kind: 'transcript', text: 'x' }, { start: 0, end: 0 }, null), /GEMINI_API_KEY/);
});

test('zoom summary payload shapes', () => {
  assert.equal(summaryText({ summary_content: '## Hi' }), '## Hi');
  assert.match(summaryText({ summary_overview: 'O', summary_details: [{ label: 'L', summary: 'S' }], next_steps: ['N'] }), /O\n\nL: S\n\nNext steps:\n- N/);
});

test('GHL webhook signatures are verified with RSA-SHA256', () => {
  const nodeCrypto = require('crypto');
  const config = require('../src/config');
  const { createGhl } = require('../src/ghl');
  assert.ok(nodeCrypto.createPublicKey(config.GHL_WEBHOOK_PUBLIC_KEY), 'bundled HighLevel key parses');
  const { publicKey, privateKey } = nodeCrypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  const cfg = config.load({ GHL_WEBHOOK_PUBLIC_KEY: publicKey.export({ type: 'spki', format: 'pem' }) });
  const ghl = createGhl({ cfg, store: null, crypto: null, http: null });
  const body = Buffer.from(JSON.stringify({ type: 'AppointmentCreate', webhookId: 'w' }));
  const sig = nodeCrypto.sign('sha256', body, privateKey).toString('base64');
  assert.equal(ghl.verifyWebhook(body, { 'x-wh-signature': sig }), true);
  assert.equal(ghl.verifyWebhook(Buffer.from(body.toString() + ' '), { 'x-wh-signature': sig }), false);
  assert.equal(ghl.verifyWebhook(body, {}), false);
});


test('Zoom live events rebuild sessions, rejoins and the host', () => {
  const { liveRecord, liveParticipants } = require('../src/providers/zoom');
  const ev = (event, participant, extra = {}) => ({ event, event_ts: 1, payload: { object: Object.assign({ id: 999, uuid: 'u1', host_id: 'H', start_time: '2026-11-02T10:00:00Z', participant }, extra) } });
  const recs = [
    liveRecord(ev('meeting.participant_joined', { id: 'H', user_name: 'Host', join_time: '2026-11-02T10:00:00Z' })),
    liveRecord(ev('meeting.participant_joined', { user_name: 'Ana', email: 'ANA@x.com', join_time: '2026-11-02T10:05:00Z' })),
    liveRecord(ev('meeting.participant_left', { user_name: 'Ana', email: 'ana@x.com', leave_time: '2026-11-02T10:15:00Z' })),
    liveRecord(ev('meeting.participant_joined', { user_name: 'Ana', email: 'ana@x.com', join_time: '2026-11-02T10:20:00Z' })),
    liveRecord(ev('meeting.ended', null, { end_time: '2026-11-02T10:45:00Z' }))
  ];
  assert.equal(recs[0].meetingId, '999');
  assert.equal(liveRecord({ event: 'meeting.created', payload: { object: { id: 1, uuid: 'x' } } }), null);
  const doc = { startTime: recs[0].startTime, endedAt: recs[4].endedAt, events: recs.map((r) => r.event).filter(Boolean) };
  const people = liveParticipants(doc, { email: 'h@biz.com' });
  const host = people.find((p) => p.name === 'Host');
  const ana = people.find((p) => p.name === 'Ana');
  assert.equal(host.isHost, true);
  assert.equal(ana.email, 'ana@x.com');
  assert.equal(ana.sessions.length, 2);
  assert.equal((ana.sessions[1].end - ana.sessions[1].start) / 60000, 25, 'open session closes at meeting end');
});
