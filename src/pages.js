'use strict';
/* Public website: Home, Docs, Support, Privacy, Terms.
   Visual system follows the owner's portfolio (dark navy, Inter, blue/teal accents). */

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const CSS = `
:root{--bg:#070b14;--bg-soft:#10192d;--panel:rgba(17,26,45,.72);--text:#ebf1ff;--muted:#a3b2cc;--line:rgba(255,255,255,.14);--brand:#79a8ff;--brand-2:#72f0d1;--focus:#b9d0ff;--radius:20px;--radius-sm:12px;--shadow:0 18px 48px rgba(0,0,0,.28);--max:1160px}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:var(--text);background:radial-gradient(circle at 15% -10%,#1f3f7a 0%,#070b14 52%) no-repeat,var(--bg);background-color:var(--bg);line-height:1.65;min-height:100vh}
a{color:var(--brand)}a:focus-visible,button:focus-visible{outline:2px solid var(--focus);outline-offset:3px}
.skip{position:absolute;left:-9999px}.skip:focus{left:.5rem;top:.5rem;background:#fff;color:#000;padding:.6rem 1rem;z-index:99}
.container{width:min(var(--max),92vw);margin-inline:auto}
.section{padding:4.5rem 0}
.eyebrow{letter-spacing:.11em;text-transform:uppercase;font-size:.74rem;color:var(--brand-2);font-weight:700;margin:0}
.site-header{position:sticky;top:0;z-index:20;backdrop-filter:blur(10px);background:rgba(6,12,23,.72);border-bottom:1px solid var(--line)}
.header-inner{display:flex;align-items:center;justify-content:space-between;min-height:4.4rem;gap:1rem}
.brand{font-weight:800;letter-spacing:-.02em;text-decoration:none;font-size:1.1rem;color:var(--text);display:flex;align-items:center;gap:.55rem}
.brand-mark{width:28px;height:28px;border-radius:9px;background:linear-gradient(135deg,var(--brand),var(--brand-2));display:grid;place-items:center;color:#081020;font-size:.85rem;font-weight:800}
.nav-toggle{display:none;background:transparent;border:1px solid var(--line);color:var(--text);border-radius:999px;padding:.45rem .9rem;font:inherit}
.nav-links{display:flex;gap:.4rem;align-items:center}
.nav-links a{text-decoration:none;color:var(--muted);font-size:.95rem;padding:.35rem .7rem;border-radius:999px}
.nav-links a:hover,.nav-links a[aria-current=page]{color:var(--text);background:rgba(255,255,255,.08)}
.nav-links a.nav-cta{background:linear-gradient(130deg,var(--brand),#88b2ff);color:#081020;font-weight:700}
.button{text-decoration:none;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:.75rem 1.2rem;border:1px solid var(--line);font-weight:600;color:var(--text)}
.button.primary{background:linear-gradient(130deg,var(--brand),#90b8ff);border-color:transparent;color:#081020}
.button.ghost:hover{background:rgba(255,255,255,.08)}
.hero{padding:5rem 0 3.5rem}
.hero-grid{display:grid;grid-template-columns:1.1fr .9fr;align-items:center;gap:2.5rem}
.hero-title{font-size:clamp(2.1rem,5.2vw,3.8rem);line-height:1.05;margin:.6rem 0 1rem;letter-spacing:-.03em}
.grad{background:linear-gradient(120deg,var(--brand),var(--brand-2));-webkit-background-clip:text;background-clip:text;color:transparent}
.lead{color:var(--muted);max-width:56ch;font-size:1.07rem}
.actions{margin-top:1.6rem;display:flex;gap:.8rem;flex-wrap:wrap}
.card{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);padding:1.6rem;box-shadow:var(--shadow);backdrop-filter:blur(8px)}
.mock-row{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.8rem 0;border-top:1px solid var(--line)}
.mock-row:first-of-type{border-top:0}
.who{font-weight:600}.when{color:var(--muted);font-size:.85rem}
.pill{border-radius:999px;padding:.2rem .7rem;font-size:.8rem;font-weight:700;white-space:nowrap}
.pill.ok{background:rgba(114,240,209,.14);color:var(--brand-2)}.pill.no{background:rgba(255,138,138,.14);color:#ff9d9d}.pill.rev{background:rgba(121,168,255,.16);color:var(--brand)}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:.8rem;margin-top:2.5rem}
.stat{background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:var(--radius-sm);padding:1rem}
.stat b{display:block;font-size:1.5rem;letter-spacing:-.02em}.stat span{color:var(--muted);font-size:.9rem}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
.feature h3,.step h3{margin:.2rem 0 .4rem;font-size:1.08rem}.feature p,.step p{margin:0;color:var(--muted)}
.icon{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;background:rgba(121,168,255,.14);color:var(--brand);font-weight:800;margin-bottom:.6rem}
.step-n{font-size:.8rem;font-weight:800;color:var(--brand-2)}
h2.section-title{font-size:clamp(1.6rem,3.2vw,2.3rem);letter-spacing:-.02em;margin:.4rem 0 1.6rem}
.platforms{display:flex;gap:.8rem;flex-wrap:wrap}.platforms span{border:1px solid var(--line);border-radius:999px;padding:.45rem 1rem;color:var(--muted)}
details{border-top:1px solid var(--line);padding:1rem 0}details:last-child{border-bottom:1px solid var(--line)}
summary{cursor:pointer;font-weight:600}details p{color:var(--muted);margin:.6rem 0 0}
.doc{display:grid;grid-template-columns:230px 1fr;gap:2.5rem;align-items:start}
.toc{position:sticky;top:5.5rem;display:flex;flex-direction:column;gap:.15rem}
.toc a{color:var(--muted);text-decoration:none;padding:.3rem .7rem;border-radius:8px;font-size:.93rem}.toc a:hover{color:var(--text);background:rgba(255,255,255,.06)}
.prose{max-width:76ch}.prose h1{font-size:clamp(1.9rem,4vw,2.8rem);letter-spacing:-.03em;margin:.3rem 0 1rem;line-height:1.1}
.prose h2{font-size:1.35rem;margin:2.4rem 0 .6rem;letter-spacing:-.01em;scroll-margin-top:5.5rem}.prose h3{font-size:1.05rem;margin:1.5rem 0 .4rem}
.prose p,.prose li{color:#c9d5ec}.prose code{background:rgba(255,255,255,.08);border-radius:6px;padding:.1rem .35rem;font-size:.9em}
.prose table{width:100%;border-collapse:collapse;margin:1rem 0;font-size:.94rem}.prose th,.prose td{text-align:left;padding:.6rem .7rem;border-top:1px solid var(--line);vertical-align:top}.prose th{color:var(--text)}
.note{border-left:3px solid var(--brand-2);background:rgba(114,240,209,.06);padding:.8rem 1rem;border-radius:0 var(--radius-sm) var(--radius-sm) 0}
.muted{color:var(--muted)}
.contact{display:grid;grid-template-columns:1.1fr .9fr;gap:1.5rem;align-items:start}
.mail{font-size:clamp(1.1rem,2.4vw,1.5rem);font-weight:700;word-break:break-all}
.site-footer{border-top:1px solid var(--line);padding:2rem 0;margin-top:3rem;color:var(--muted);font-size:.92rem}
.footer-inner{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}.footer-inner nav{display:flex;gap:1rem;flex-wrap:wrap}.footer-inner a{color:var(--muted);text-decoration:none}.footer-inner a:hover{color:var(--text)}
@media (max-width:900px){.hero-grid,.contact,.doc{grid-template-columns:1fr}.grid3{grid-template-columns:1fr 1fr}.stats{grid-template-columns:1fr 1fr}.toc{position:static;flex-direction:row;flex-wrap:wrap}}
@media (max-width:640px){.nav-toggle{display:inline-flex}.nav-links{display:none;position:absolute;top:4.4rem;left:0;right:0;flex-direction:column;align-items:stretch;padding:1rem 4vw;background:rgba(6,12,23,.96);border-bottom:1px solid var(--line)}.nav-links.open{display:flex}.grid3{grid-template-columns:1fr}.section{padding:3.2rem 0}.hero{padding:3rem 0 2rem}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;

function layout(cfg, { title, description, path, body }) {
  const nav = [['/', 'Home'], ['/docs', 'Docs'], ['/support', 'Support']];
  const install = cfg.brand.marketplaceUrl || '/docs#install';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#070b14">${cfg.brand.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(cfg.brand.googleSiteVerification)}">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#79a8ff"/><stop offset="1" stop-color="#72f0d1"/></linearGradient></defs><rect width="32" height="32" rx="9" fill="url(#g)"/><path d="M9 16.5l4.5 4.5L23 11" stroke="#081020" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')}">
<style>${CSS}</style></head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="container header-inner">
<a class="brand" href="/"><span class="brand-mark" aria-hidden="true">✓</span>${esc(cfg.appName)}</a>
<button class="nav-toggle" aria-expanded="false" aria-controls="nav" onclick="var n=document.getElementById('nav');n.classList.toggle('open');this.setAttribute('aria-expanded',n.classList.contains('open'))">Menu</button>
<nav id="nav" class="nav-links" aria-label="Main">${nav.map(([h, l]) => `<a href="${h}"${h === path ? ' aria-current="page"' : ''}>${l}</a>`).join('')}<a class="nav-cta" href="${esc(install)}">Install</a></nav>
</div></header>
<main id="main">${body}</main>
<footer class="site-footer"><div class="container footer-inner">
<span>© ${new Date().getFullYear()} ${esc(cfg.brand.legalName)}. Built for HighLevel.</span>
<nav aria-label="Footer"><a href="/docs">Docs</a><a href="/support">Support</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a></nav>
</div></footer></body></html>`;
}

/* ---------------- Home ---------------- */
function home(cfg) {
  const T = cfg.teamsEnabled;
  const install = cfg.brand.marketplaceUrl || '/docs#install';
  const features = [
    ['✓', 'Showed or No-show, set for you', 'After every ' + (T ? 'Zoom, Teams or Google Meet' : 'Zoom or Google Meet') + ' appointment, the appointment status is updated in HighLevel, so your no-show and follow-up workflows fire on time.'],
    ['∑', 'Built for class bookings', 'Group sessions get a decision for every booked contact, not one for the whole class. Rejoins are added up and late joiners are tagged.'],
    ['✎', 'Meeting notes on the contact', 'A short summary, decisions and action items are saved to each attendee\'s Notes, made from the platform transcript or its own AI summary.'],
    ['⚑', 'Asks instead of guessing', 'When a participant can\'t be matched with confidence, a HighLevel task is created for your team. Statuses you set by hand are never overwritten.'],
    ['#', 'Data you can report on', 'Minutes attended, attendance %, join time and running totals are written to contact custom fields, with tags for showed, no-show and late.'],
    ['⌂', 'Your data stays in HighLevel', 'Statuses, notes, fields, tags, tasks and even the settings live in your HighLevel account. Transcripts are never stored.']
  ];
  return layout(cfg, {
    title: cfg.appName + ': automatic meeting attendance for HighLevel',
    description: 'Automatically mark HighLevel appointments held on ' + (T ? 'Zoom, Microsoft Teams and Google Meet' : 'Zoom and Google Meet') + ' as Showed or No-show, and save meeting notes to each contact.',
    path: '/',
    body: `
<section class="hero"><div class="container hero-grid">
  <div>
    <p class="eyebrow">For HighLevel · Zoom · Google Meet${T ? ' · Teams' : ' · Teams soon'}</p>
    <h1 class="hero-title">Know who showed up. <span class="grad">Automatically.</span></h1>
    <p class="lead">${esc(cfg.appName)} checks every online appointment after it ends, marks each attendee <b>Showed</b> or <b>No-show</b> in HighLevel, and saves the meeting notes to their contact. No API keys, no spreadsheets.</p>
    <div class="actions"><a class="button primary" href="${esc(install)}">Install on HighLevel</a><a class="button ghost" href="/docs">Read the docs</a></div>
  </div>
  <div class="card" aria-label="Example: a class booking after the session">
    <p class="eyebrow" style="margin-bottom:.4rem">Yoga Class · 4:00 PM · Zoom</p>
    <div class="mock-row"><div><div class="who">Bob Stone</div><div class="when">58 min · joined on time</div></div><span class="pill ok">Showed</span></div>
    <div class="mock-row"><div><div class="who">Ana López</div><div class="when">40 min · joined 15 min late</div></div><span class="pill ok">Showed · late</span></div>
    <div class="mock-row"><div><div class="who">Will Smith</div><div class="when">Did not join</div></div><span class="pill no">No-show</span></div>
    <div class="mock-row"><div><div class="who">"Galaxy S23"</div><div class="when">Unidentified guest · 52 min</div></div><span class="pill rev">Task created</span></div>
  </div>
</div>
<div class="container"><div class="stats">
  <div class="stat"><b>3</b><span>meeting platforms</span></div>
  <div class="stat"><b>Per attendee</b><span>decisions, classes included</span></div>
  <div class="stat"><b>0</b><span>API keys for your clients</span></div>
  <div class="stat"><b>~10 min</b><span>after the meeting ends</span></div>
</div></div></section>

<section class="section"><div class="container">
  <p class="eyebrow">What it does</p><h2 class="section-title">Attendance and notes, handled</h2>
  <div class="grid3">${features.map(([i, h, p]) => `<article class="card feature"><div class="icon" aria-hidden="true">${i}</div><h3>${h}</h3><p>${p}</p></article>`).join('')}</div>
</div></section>

<section class="section"><div class="container">
  <p class="eyebrow">How it works</p><h2 class="section-title">Set up in three steps</h2>
  <div class="grid3">
    <article class="card step"><div class="step-n">STEP 1</div><h3>Install the app</h3><p>Install ${esc(cfg.appName)} from the HighLevel Marketplace. Access to the sub-account is granted automatically.</p></article>
    <article class="card step"><div class="step-n">STEP 2</div><h3>Connect your meeting account</h3><p>Open the app in the sidebar and click <b>Connect</b> for ${T ? 'Zoom, Microsoft Teams or Google Meet' : 'Zoom or Google Meet'}. Sign in and allow access.</p></article>
    <article class="card step"><div class="step-n">STEP 3</div><h3>Run meetings as usual</h3><p>After each appointment, statuses, tags, fields and notes appear in HighLevel. Your existing workflows take it from there.</p></article>
  </div>
  <div class="platforms" style="margin-top:1.5rem" aria-label="Supported platforms"><span>Zoom</span><span>Google Meet</span><span>Microsoft Teams${T ? '' : ' · coming soon'}</span></div>
</div></section>

<section class="section"><div class="container" style="max-width:820px">
  <p class="eyebrow">Questions</p><h2 class="section-title">Frequently asked</h2>
  <details><summary>Do my clients need to enter any API keys?</summary><p>No. Installing the app connects the HighLevel sub-account, and ${T ? 'Zoom, Teams or Meet are' : 'Zoom or Google Meet is'} connected with a Connect button and a normal sign-in.</p></details>
  <details><summary>Which meetings are checked?</summary><p>Appointments whose meeting location is a ${T ? 'Zoom, Microsoft Teams or Google Meet' : 'Zoom or Google Meet'} link hosted by the connected account. In-person appointments are ignored.${T ? '' : ' Microsoft Teams support is coming soon.'}</p></details>
  <details><summary>What happens when it isn't sure?</summary><p>It leaves the status alone and creates a HighLevel task for the appointment owner, listing who joined and for how long.</p></details>
  <details><summary>Will it change a status my team already set?</summary><p>Never. Only appointments still marked New or Confirmed are updated.</p></details>
  <details><summary>Are recordings or transcripts stored?</summary><p>No. Transcripts are read once to write the note and then discarded. See the <a href="/privacy">Privacy Policy</a>.</p></details>
</div></section>`
  });
}

/* ---------------- Docs ---------------- */
function docs(cfg) {
  const T = cfg.teamsEnabled;
  const toc = [['install', 'Install'], ['connect', 'Connect a platform'], ['requirements', 'Requirements'], ['how', 'How attendance is decided'], ['rules', 'Rules and settings'], ['classes', 'Class bookings'], ['notes', 'Meeting notes'], ['fields', 'Fields and tags'], ['review', 'Review tasks'], ['troubleshooting', 'Troubleshooting']];
  return layout(cfg, {
    title: 'Docs · ' + cfg.appName,
    description: 'How to install and use ' + cfg.appName + ' with HighLevel, Zoom and Google Meet.',
    path: '/docs',
    body: `<section class="section"><div class="container doc">
<nav class="toc" aria-label="On this page">${toc.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav>
<article class="prose">
<p class="eyebrow">Documentation</p><h1>Using ${esc(cfg.appName)}</h1>
<p>${esc(cfg.appName)} marks HighLevel appointments held on ${T ? 'Zoom, Microsoft Teams and Google Meet' : 'Zoom and Google Meet'} as Showed or No-show, per attendee, and saves meeting notes to each contact.${T ? '' : ' Microsoft Teams support is coming soon.'}</p>

<h2 id="install">Install</h2>
<ol><li>Open the HighLevel Marketplace and find <b>${esc(cfg.appName)}</b>${cfg.brand.marketplaceUrl ? ` (<a href="${esc(cfg.brand.marketplaceUrl)}">direct link</a>)` : ''}.</li>
<li>Click <b>Install</b> and choose the sub-account. Agencies can install it on several sub-accounts at once.</li>
<li>Approve the requested access. ${esc(cfg.appName)} gets the sub-account's calendar and contact access automatically; there is nothing to copy or paste.</li></ol>
<p>On install, a few contact custom fields are created (see <a href="#fields">Fields and tags</a>).</p>

<h2 id="connect">Connect a platform</h2>
<ol><li>In the sub-account, open <b>${esc(cfg.appName)}</b> from the left sidebar. You are signed in automatically.</li>
<li>Under <b>Meeting platforms</b>, click <b>Connect</b> next to ${T ? 'Zoom, Microsoft Teams or Google Meet' : 'Zoom or Google Meet'}.</li>
<li>Sign in with the account your HighLevel calendars use to create meetings, and click <b>Allow</b>.</li></ol>
<p class="note">Connect the account that <b>hosts</b> the meetings. ${esc(cfg.appName)} can only read attendance for meetings that account organizes. You can connect all three platforms.</p>

<h2 id="requirements">Requirements</h2>
<table><thead><tr><th>Platform</th><th>What you need</th></tr></thead><tbody>
<tr><td>Zoom</td><td>Any Zoom plan, free included, for attendance. For AI notes, a paid plan with cloud recording transcripts or AI Companion summaries; free accounts get attendance-only notes.</td></tr>
<tr><td>Microsoft Teams</td><td>${T ? 'A Microsoft 365 work or school account. Your IT admin may need to approve the app once. Turn on transcription for AI notes. Personal Teams (teams.live.com) is not supported.' : '<b>Coming soon.</b>'}</td></tr>
<tr><td>Google Meet</td><td>A Google Workspace account. Turn on transcripts for AI notes. Meet does not share participant emails, so matching uses names.</td></tr>
</tbody></table>
<p>The appointment's meeting location must be the ${T ? 'Zoom, Teams or Meet' : 'Zoom or Google Meet'} link. HighLevel's own calendar integrations do this automatically.</p>

<h2 id="how">How attendance is decided</h2>
<p>About 10 minutes after an appointment ends, ${esc(cfg.appName)} reads the participant list from the platform and matches each person to the booked contact:</p>
<ol><li><b>Email</b> matches the contact's email: strongest match.</li>
<li><b>Full name</b> matches the contact's first and last name.</li>
<li><b>Similar name</b> (accents, spacing and typos tolerated).</li>
<li>On a one-to-one appointment, a single unidentified guest is a possible match and is sent for review.</li></ol>
<p>Hosts, HighLevel users on the appointment, and notetaker bots are ignored. If someone leaves and rejoins, their time is added up. Only time inside the appointment window counts, so a reused meeting room is handled correctly.</p>
<p>An attendee is marked <b>Showed</b> when they attended at least the minimum (5 minutes or 50% of the meeting, whichever is lower, by default). An attendee who never joined is marked <b>No-show</b>, as long as the meeting took place.</p>
<p>Only appointments still set to <b>New</b> or <b>Confirmed</b> are changed. A status your team sets by hand is never overwritten. HighLevel workflows that trigger on appointment status run as usual.</p>

<h2 id="rules">Rules and settings</h2>
<p>All settings are on the app page in the sidebar and are saved in your HighLevel account (custom value <code>Attendly Settings</code>).</p>
<table><thead><tr><th>Setting</th><th>Default</th></tr></thead><tbody>
<tr><td>Mode: mark automatically, suggest only, or off</td><td>Mark automatically</td></tr>
<tr><td>Check after the meeting ends</td><td>10 minutes</td></tr>
<tr><td>Minimum attendance</td><td>5 minutes or 50%, whichever is lower</td></tr>
<tr><td>Late after</td><td>10 minutes</td></tr>
<tr><td>Joined but below the minimum</td><td>Create a review task</td></tr>
<tr><td>Meeting not found or nobody joined</td><td>Create a review task</td></tr>
<tr><td>Match confidence to mark automatically</td><td>80 / 100</td></tr>
</tbody></table>

<h2 id="classes">Class bookings</h2>
<p>For class and group calendars, every booked contact has their own appointment with the same join link. ${esc(cfg.appName)} treats them as one meeting, reads the participant list once, and decides each attendee separately. If an unidentified person joined, attendees who could not be matched get a review task instead of a No-show.</p>

<h2 id="notes">Meeting notes</h2>
<p>For attendees who showed, a note is added to the contact's <b>Notes</b> with the attendance line and, when a transcript or platform summary exists, an AI-written summary, key points, decisions and action items.</p>
<ul><li><b>One-to-one appointments:</b> full AI notes (default), attendance only, or no note.</li>
<li><b>Class bookings:</b> attendance only (default), the same session summary for everyone, or the session summary plus each person's own points.</li></ul>
<p>Notes are generated with Google's Gemini model from the transcript. Transcripts are not stored. AI notes can contain mistakes; review important details.</p>
<p class="note">Recording and transcription laws differ by country and state. Tell participants when meetings are transcribed.</p>

<h2 id="fields">Fields and tags</h2>
<table><thead><tr><th>Contact field</th><th>Example</th></tr></thead><tbody>
<tr><td>Last Meeting Status</td><td>Showed</td></tr><tr><td>Last Meeting Minutes Attended</td><td>42</td></tr>
<tr><td>Last Meeting Attendance %</td><td>93</td></tr><tr><td>Last Meeting Joined At</td><td>2026-11-03T14:03:00Z</td></tr>
<tr><td>Last Meeting Platform</td><td>Zoom</td></tr><tr><td>Meetings Attended / Meetings Missed</td><td>7 / 2</td></tr>
<tr><td>Last Meeting Summary</td><td>Short AI summary</td></tr></tbody></table>
<p>Tags: <code>meeting-showed</code>, <code>meeting-noshow</code>, <code>meeting-late</code>, <code>attendance-review</code>. You can rename them, or leave one empty to skip it.</p>

<h2 id="review">Review tasks</h2>
<p>When ${esc(cfg.appName)} is not sure, it creates a task on the contact, assigned to the appointment owner and due today. The task explains why and lists unidentified participants with their minutes. Set the appointment to Showed or No-show in the calendar and complete the task.</p>

<h2 id="troubleshooting">Troubleshooting</h2>
<table><thead><tr><th>What you see</th><th>What to do</th></tr></thead><tbody>
<tr><td>Nothing happens after meetings</td><td>Check that the platform shows <b>Connected</b> on the app page, and that the appointment's location is the meeting link.</td></tr>
<tr><td>"Reconnect" next to a platform</td><td>The sign-in expired or was revoked. Click <b>Reconnect</b> and sign in again.</td></tr>
<tr><td>Many review tasks</td><td>Ask clients to join with the name or email they booked with, or lower the confidence setting.</td></tr>
<tr><td>Notes contain attendance only</td><td>Turn on cloud recording transcripts (Zoom) or transcription (${T ? 'Teams, Meet' : 'Meet'}).</td></tr>
<tr><td>"Meeting not found"</td><td>The connected account must be the meeting's host.${T ? ' Personal Teams meetings cannot be checked.' : ''}</td></tr>
</tbody></table>
<p>Still stuck? <a href="/support">Contact support</a>.</p>
</article></div></section>`
  });
}

/* ---------------- Support ---------------- */
function support(cfg) {
  const email = cfg.brand.supportEmail;
  return layout(cfg, {
    title: 'Support · ' + cfg.appName,
    description: 'Get help with ' + cfg.appName + '.',
    path: '/support',
    body: `<section class="section"><div class="container contact">
<div class="prose"><p class="eyebrow">Support</p><h1>We're here to help</h1>
<p>Questions, a meeting that was marked wrong, or a feature you'd like? Email us and we'll get back to you.</p>
<h2>To help us answer quickly, include</h2>
<ul><li>Your HighLevel sub-account name or ID</li><li>The platform (Zoom or Google Meet${cfg.teamsEnabled ? ', or Teams' : ''})</li><li>The appointment date and time, and what you expected to happen</li><li>A screenshot of the app's <b>Recent activity</b> list, if relevant</li></ul>
<p>Many answers are already in the <a href="/docs">documentation</a>.</p></div>
<aside class="card"><p class="eyebrow">Email</p><p class="mail"><a href="mailto:${esc(email)}?subject=${encodeURIComponent(cfg.appName + ' support')}">${esc(email)}</a></p>
<p class="muted">Please don't send passwords or API keys. We will never ask for them.</p>
<div class="actions"><a class="button primary" href="mailto:${esc(email)}?subject=${encodeURIComponent(cfg.appName + ' support')}">Email support</a><a class="button ghost" href="/docs#troubleshooting">Troubleshooting</a></div></aside>
</div></section>`
  });
}

/* ---------------- Privacy ---------------- */
function privacy(cfg) {
  const n = esc(cfg.appName), email = esc(cfg.brand.supportEmail), legal = esc(cfg.brand.legalName);
  return layout(cfg, {
    title: 'Privacy Policy · ' + cfg.appName, description: 'How ' + cfg.appName + ' handles data.', path: '/privacy',
    body: `<section class="section"><div class="container"><article class="prose">
<p class="eyebrow">Legal</p><h1>Privacy Policy</h1><p class="muted">Last updated ${esc(cfg.brand.legalUpdated)}</p>
<p>This policy explains what data ${n} ("we", "us"), operated by ${legal}, processes when a HighLevel account installs the app, and how it is used, stored and protected.</p>

<h2>Summary</h2>
<ul><li>We use your data only to mark meeting attendance and write meeting notes in your HighLevel account.</li>
<li>Results are written to your HighLevel account. We store only the access tokens needed to do that, encrypted.</li>
<li>Transcripts and participant lists are processed in memory and never stored.</li>
<li>We do not sell data, use it for advertising, or use it to train AI models.</li></ul>

<h2>Data we access</h2>
<table><thead><tr><th>Source</th><th>Data</th><th>Why</th></tr></thead><tbody>
<tr><td>HighLevel</td><td>Appointments (time, status, meeting link, owner), contact name and email, user name and email, custom fields and values</td><td>Find online appointments, match attendees, write statuses, notes, fields, tags and tasks</td></tr>
<tr><td>Zoom, Microsoft Teams, Google Meet</td><td>Connected account's name and email; for meetings that account hosts: participant names, emails where provided, join and leave times; transcripts or platform summaries</td><td>Decide attendance and write meeting notes</td></tr>
</tbody></table>

<h2>What we store</h2>
<ul><li><b>OAuth access and refresh tokens</b> for HighLevel and connected platforms, encrypted with AES-256-GCM, kept until you uninstall or disconnect.</li>
<li><b>Meeting join and leave events</b> sent by Zoom while a meeting runs (participant name, email if provided, join and leave times), only for meetings hosted by a connected account, automatically deleted after 3 days.</li>
<li><b>A short queue of upcoming meetings</b> (appointment IDs and times only), deleted once each meeting is processed.</li>
<li><b>Technical logs</b> (event type, sub-account ID, short messages, no transcript content), kept in a fixed-size log that overwrites old entries.</li></ul>
<p>Attendance results, notes, tags, tasks and settings are stored in your HighLevel account, under your control.</p>

<h2>AI processing</h2>
<p>To write notes, the meeting transcript or platform summary is sent to Google's Gemini API, which returns a structured summary. The text is not stored by us after the note is written. Google processes it under its Gemini API terms. We do not use your data to train models.</p>

<h2>Service providers</h2>
<table><thead><tr><th>Provider</th><th>Purpose</th></tr></thead><tbody>
<tr><td>Vercel</td><td>Hosting</td></tr><tr><td>MongoDB Atlas</td><td>Encrypted token storage and job queue</td></tr><tr><td>Google (Gemini API)</td><td>Generating meeting notes</td></tr>
<tr><td>HighLevel, Zoom, Microsoft, Google</td><td>The platforms you connect</td></tr></tbody></table>

<h2>Google user data</h2>
<p>${n}'s use and transfer of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</a>, including the Limited Use requirements. Google Meet data is used only to provide attendance and notes to the account that connected it. It is not transferred to others except as needed to provide the service, for security, or by law, and is never used for advertising or read by people except with your permission, for security, or by law.</p>

<h2>Your choices and deletion</h2>
<ul><li><b>Disconnect a platform</b> on the app page: its tokens are deleted and revoked where the platform allows.</li>
<li><b>Remove ${n} from your Zoom account</b> (Zoom App Marketplace → Manage → Added Apps): its Zoom tokens and stored join/leave events are deleted immediately.</li>
<li><b>Uninstall the app</b> in HighLevel: the sub-account's tokens and queued meetings are deleted.</li>
<li>Notes, tags and fields already written stay in your HighLevel account; you can edit or delete them there.</li>
<li>To request deletion or a copy of the data we hold, email <a href="mailto:${email}">${email}</a>.</li></ul>

<h2>Security</h2>
<p>All traffic uses HTTPS. Tokens are encrypted at rest. Webhooks from HighLevel are signature-verified. Access to production systems is limited to the operator.</p>

<h2>Your responsibilities</h2>
<p>You are responsible for having a lawful basis to process your contacts' data and for giving any notices required for recording or transcribing meetings.</p>

<h2>Children</h2><p>The service is for businesses and is not directed to children under 16.</p>
<h2>Changes</h2><p>We may update this policy. The date at the top shows the latest version.</p>
<h2>Contact</h2><p>Questions about privacy: <a href="mailto:${email}">${email}</a>.</p>
</article></div></section>`
  });
}

/* ---------------- Terms ---------------- */
function terms(cfg) {
  const n = esc(cfg.appName), email = esc(cfg.brand.supportEmail), legal = esc(cfg.brand.legalName);
  return layout(cfg, {
    title: 'Terms of Service · ' + cfg.appName, description: 'Terms for using ' + cfg.appName + '.', path: '/terms',
    body: `<section class="section"><div class="container"><article class="prose">
<p class="eyebrow">Legal</p><h1>Terms of Service</h1><p class="muted">Last updated ${esc(cfg.brand.legalUpdated)}</p>
<p>These terms govern your use of ${n} (the "Service"), operated by ${legal}. By installing or using the Service you agree to them on behalf of yourself and the business you represent.</p>

<h2>1. The Service</h2>
<p>${n} is a HighLevel Marketplace app that reads attendance from Zoom, Microsoft Teams and Google Meet, updates appointment statuses in HighLevel, and writes meeting notes, tags, fields and tasks to your HighLevel account.</p>

<h2>2. Accounts and access</h2>
<p>You must have authority over the HighLevel account where you install the Service and over any meeting accounts you connect. You are responsible for activity under your accounts.</p>

<h2>3. Fees</h2>
<p>Any fees are shown on the HighLevel Marketplace listing and billed through HighLevel under its terms.</p>

<h2>4. Your responsibilities</h2>
<ul><li>Have a lawful basis to process your contacts' personal data.</li>
<li>Give any notices and obtain any consents required to record or transcribe meetings.</li>
<li>Use the Service only in line with the terms of HighLevel, Zoom, Microsoft and Google.</li>
<li>Do not misuse the Service, attempt to access other customers' data, or interfere with its operation.</li></ul>

<h2>5. Automated decisions and AI notes</h2>
<p>Attendance decisions are made automatically from platform data and can be wrong, for example when a participant joins under a different name. Meeting notes are generated by AI and can contain mistakes. Review important results before relying on them. You can set the Service to suggest only, or turn it off, at any time.</p>

<h2>6. Third-party services</h2>
<p>The Service depends on HighLevel, Zoom, Microsoft, Google and hosting providers. We are not responsible for their availability or changes to their APIs, which may affect the Service.</p>

<h2>7. Data</h2>
<p>You keep all rights to your data. You grant us permission to process it only to provide the Service, as described in the <a href="/privacy">Privacy Policy</a>.</p>

<h2>8. Availability and changes</h2>
<p>We aim to keep the Service running reliably but do not guarantee uninterrupted operation. We may change or discontinue features, and will give reasonable notice of material changes where possible.</p>

<h2>9. Disclaimer</h2>
<p>The Service is provided "as is" and "as available", without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose and non-infringement, to the extent permitted by law.</p>

<h2>10. Limitation of liability</h2>
<p>To the extent permitted by law, ${legal} is not liable for indirect, incidental, special or consequential damages, or for lost profits, revenue or data. Our total liability for any claim is limited to the amount you paid for the Service in the 12 months before the claim.</p>

<h2>11. Termination</h2>
<p>You can stop using the Service at any time by uninstalling it. We may suspend or end access for violation of these terms. On uninstall, stored tokens and queued jobs are deleted as described in the Privacy Policy.</p>

<h2>12. Changes to these terms</h2>
<p>We may update these terms. Continued use after an update means you accept the new terms.</p>

<h2>13. Contact</h2>
<p>Questions about these terms: <a href="mailto:${email}">${email}</a>.</p>
</article></div></section>`
  });
}

module.exports = { home, docs, support, privacy, terms };
