# Attendly for HighLevel

A HighLevel Marketplace app (Target: **Sub-Account**). After each appointment held on **Zoom**, **Microsoft Teams** or **Google Meet**, it:

1. Sets the appointment to **Showed** or **No-show**, per attendee. A class booking gets a decision for each booked contact. GHL's own appointment-status workflows then fire as usual.
2. Adds tags (`meeting-showed`, `meeting-noshow`, `meeting-late`) and writes attendance to contact custom fields (minutes, %, joined at, platform, totals).
3. Saves a **meeting note** to each attendee's contact. The note has an AI summary, key points, decisions and action items, made from the platform's AI summary or transcript.
4. Creates a **GHL Task** whenever it is not sure, instead of guessing.

All business data lives in GHL. The app's MongoDB holds only encrypted OAuth tokens, the queue of meetings waiting to be checked, webhook de-duplication (48 h TTL) and a 20 MB capped log. It stays far below 256 MB: about 6 KB per location plus about 200 bytes per upcoming meeting.

## URLs

With your domain in place of `attendly.example.com`:

| What | URL |
| --- | --- |
| Home, Docs, Support, Privacy, Terms | `/`, `/docs`, `/support`, `/privacy`, `/terms` |
| HighLevel redirect (OAuth callback) | `/oauth/callback` |
| HighLevel webhook | `/webhooks/ghl` |
| HighLevel custom page (sidebar App URL, uses SSO) | `/app` |
| Zoom redirect / event webhook | `/connect/zoom/callback`, `/webhooks/zoom` |
| Microsoft redirect | `/connect/teams/callback` |
| Google redirect | `/connect/meet/callback` |
| Cron | `/api/cron/run` |

## How it works

```
GHL webhook (AppointmentCreate/Update/Delete)
  -> meeting link read from appointment.address -> platform + meeting id
  -> one job per meeting (class bookings share a job), due at end time + 10 min
Cron every 5 min
  -> stage 1: re-read appointments from GHL, fetch participants from the platform,
     match them to contacts, set Showed / No-show, tags, fields, review tasks
  -> stage 2: fetch the platform summary or transcript, summarise with Gemini Flash,
     post a note to each attendee who showed, delete the job
```

**Matching** a participant to a contact, strongest first: email (95), full name (85), email-like display name (80), fuzzy name (60-75). On a 1:1 appointment, a single unidentified guest is a low-confidence match (70). By default the app auto-marks only at 80 or above. Hosts, GHL users on the appointment and notetaker bots are excluded. Rejoins are added together, and only time inside the appointment window counts, so reused Zoom rooms work.

**Safety rules**

- Only appointments with status `new` / `confirmed` are changed. A manual Showed / No-show is never overwritten.
- If nobody joined (not even the host), or the meeting is not found after retries (10 min to 6 h), the app creates a review task and does not mark No-show.
- If an attendee is unmatched while an unidentified participant joined, the app creates a review task instead of a No-show.
- `toNotify` is never sent, so GHL automations on status changes still run.

## Settings

The app's custom page in the sub-account sidebar (`/app`, signed in through GHL SSO) lets the user:

- Connect Zoom, Microsoft 365 and Google accounts.
- Set rules: mode (auto / suggest / off), the minimum minutes or percentage, late threshold, confidence, and what to do on short attendance or a missing meeting.
- Set tag names and the custom-field toggle.
- Choose notes modes: 1:1 full or attendance-only; classes attendance-only (default), shared summary, or personal (shared summary plus each person's own points).

Settings are saved in GHL as the Custom Value **Attendly Settings** (JSON). `calendars: { "<calendarId>": { ... } }` inside it overrides rules per calendar.

## Setup

### 1. HighLevel Marketplace app

- **Target user:** Sub-Account. **Distribution:** Agency and Sub-Account.
- **Redirect URL:** `https://<your-domain>/oauth/callback`
- **Webhook URL:** `https://<your-domain>/webhooks/ghl`. Events: AppointmentCreate, AppointmentUpdate, AppointmentDelete, AppInstall, AppUninstall.
- **Custom page (sidebar) URL:** `https://<your-domain>/app`. Copy the SSO **Shared Secret** into `GHL_SSO_KEY`.
- **Scopes:** `calendars/events.readonly calendars/events.write contacts.readonly contacts.write locations.readonly locations/customFields.readonly locations/customFields.write locations/customValues.readonly locations/customValues.write users.readonly oauth.readonly oauth.write`. The two `oauth.*` scopes are only needed for agency bulk installs.

### 2. Zoom

Create a **General app** (user-managed OAuth) at marketplace.zoom.us.

- Redirect URL: `https://<your-domain>/connect/zoom/callback`
- Scopes: `user:read:user` and `meeting:read:list_past_participants` (required); past meeting and past instances read, cloud recording read and meeting summary read (optional, for paid hosts and AI notes). Pick the closest names in the scope picker.
- Event subscription endpoint: `https://<your-domain>/webhooks/zoom`. Put its secret token in `ZOOM_WEBHOOK_SECRET` and redeploy before clicking Validate.
- Events: **Meeting → Participant/Host joined meeting** (`meeting.participant_joined`), **Participant/Host left meeting** (`meeting.participant_left`), **End Meeting** (`meeting.ended`), optionally **Start Meeting** (`meeting.started`), and **App Deauthorized**. Zoom may ask for the scope each event needs; accept it.
- **Any Zoom plan works for attendance**, free included: Zoom sends join/leave events live and the app keeps them for 3 days. On paid plans the app falls back to Zoom's participant report if events were missed. AI notes need a paid plan (cloud transcripts or AI Companion); free hosts get attendance-only notes.

### 3. Microsoft Teams

Register a multitenant app in Entra ID.

- Redirect URI (Web): `https://<your-domain>/connect/teams/callback`
- Delegated permissions: `User.Read`, `OnlineMeetings.Read`, `OnlineMeetingArtifact.Read.All`, `OnlineMeetingTranscript.Read.All`, `offline_access`. Some tenants need admin consent.
- Work and school accounts only. Personal `teams.live.com` meetings have no attendance API, and the app skips them.

### 4. Google Meet

Create a Google Cloud OAuth client (Web application) and enable the **Google Meet REST API**.

- Redirect URI: `https://<your-domain>/connect/meet/callback`
- Scope: `https://www.googleapis.com/auth/meetings.space.readonly`. This is a restricted scope: public use needs Google's OAuth verification and security assessment. Up to 100 test users work before verification.
- Meet returns no emails for participants, so matching uses display names. Expect more review tasks than on Zoom or Teams.

### 5. Gemini API (meeting notes)

Create an API key in Google AI Studio and set `GEMINI_API_KEY`. The default model is `gemini-3.6-flash` (set `GEMINI_MODEL` to change it; check Google's model list for the current Flash ID). Notes use JSON-schema output. Without a key, notes contain attendance only.

### 6. Deploy on Vercel

1. Import this repository as a new Vercel project (default root directory).
2. Set the environment variables from `.env.example`. `MONGODB_URI`, `SESSION_SECRET` and `CRON_SECRET` are required.
3. Meetings are checked by calling `/cron/run` every 5 minutes. `vercel.json` only runs it once a day, as a backup, because Vercel's Hobby plan allows daily crons only. Set up the 5-minute call with a free scheduler such as [cron-job.org](https://cron-job.org):
    - URL: `https://<your-domain>/cron/run`
    - Schedule: every 5 minutes
    - Header: `Authorization: Bearer <CRON_SECRET>`. If the scheduler can't send headers, use `https://<your-domain>/cron/run?key=<CRON_SECRET>` instead.

    On Vercel Pro you can skip the external scheduler and change the `vercel.json` schedule to `*/5 * * * *`.
4. On a normal server, run `npm start`. It processes due jobs every minute on its own.

## Development

```bash
npm install
npm test
```

Without `MONGODB_URI` the app uses an in-memory store. `test/flow.test.js` runs the whole flow (webhooks, Zoom attendance, GHL updates, notes) against mocked GHL and Zoom APIs.

## Verified against the official docs

These were checked against HighLevel's OpenAPI spec (github.com/GoHighLevel/highlevel-api-docs):

- The join URL is in the appointment's `address` field (webhooks and `GET /calendars/events/appointments/{id}`).
- `appointmentStatus` takes `new`, `confirmed`, `cancelled`, `showed`, `noshow` and `invalid`. It is updated with `PUT /calendars/events/appointments/{eventId}` (`calendars/events.write`).
- Notes (`POST /contacts/{id}/notes`, `body` required), tasks, tags, custom fields (`customFields: [{id, field_value}]`) and custom values match the spec.
- Webhook signatures are RSA-SHA256 over the raw body in `x-wh-signature`, using HighLevel's published public key (bundled). The `timestamp` and `webhookId` fields are used to reject replays and duplicates.

### Still to confirm on a live account

- **Note length limit:** the spec gives none, so notes over `NOTE_MAX_CHARS` (default 4,000) are split into numbered parts.
- **Class bookings:** the app assumes one appointment per booked contact sharing the same join link. You confirmed the link is shared. Appointments are grouped by calendar, start time and meeting link.
- **Exact Zoom granular scope names** for your app type.
- **Zoom live events on free accounts:** confirm with a real free account that participant joined/left events arrive.
