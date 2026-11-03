'use strict';
/* Entry point. Run directly (`npm start`) it starts a long-running server.
   Imported by a serverless host (Vercel), it only exports the request handler:
   it never listens, never starts timers and never exits the process. */
const config = require('./config');
const { createApp } = require('./app');

const cfg = config.load();
const problems = config.validate(cfg);

function notConfigured(req, res) {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Not configured yet. Set these environment variables:\n - ' + problems.join('\n - '));
}

const handler = problems.length ? notConfigured : createApp(cfg);
module.exports = handler;

if (require.main === module && !cfg.serverless) {
  if (problems.length) {
    console.error('Configuration problems:\n - ' + problems.join('\n - ') + '\nSee .env.example');
    process.exit(1);
  }
  const app = handler;
  const server = app.listen(cfg.port, () => {
    console.log(cfg.appName + ' listening on :' + cfg.port);
    console.log('OAuth redirect URL: ' + cfg.baseUrl + '/oauth/callback');
    console.log('Webhook URL:        ' + cfg.baseUrl + '/webhooks/ghl');
    console.log('Custom page URL:    ' + cfg.baseUrl + '/app');
  });

  // Long-running servers process due jobs every minute (on Vercel, the cron does this).
  let running = false;
  setInterval(async () => {
    if (running) return;
    running = true;
    try { await app.locals.jobs.runDue(50 * 1000); } catch (e) { console.error('job run failed', e); } finally { running = false; }
  }, 60 * 1000).unref();

  const shutdown = () => {
    server.close(() => Promise.resolve(app.locals.store.close()).finally(() => process.exit(0)));
    setTimeout(() => process.exit(0), 3000).unref();
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
