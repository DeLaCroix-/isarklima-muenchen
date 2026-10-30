import { createHmac } from 'node:crypto';

/** @param {string} output @param {(string | undefined)[]} secrets */
export function buildDiagnostic(output, secrets = []) {
  let clean = output.replace(/\x1b\[[0-9;]*m/g, '');
  for (const secret of secrets) {
    if (typeof secret === 'string' && secret.length >= 8) clean = clean.split(secret).join('[REDACTED]');
  }
  clean = clean.replace(/(bearer\s+|(?:token|password|secret|api[_-]?key)\s*[=:]\s*)[^\s,;]+/gi, '$1[REDACTED]');
  // Passing TAP tests often contain words like "failed" or "error" in their
  // names. They are not build diagnostics (and can hide the actual exception).
  const lines = clean.trim().split('\n').filter(line => !/^\s*(?:ok\s+\d+\b|#\s*(?:Subtest:|tests\b|suites\b|pass\b|fail\s+0\b|cancelled\b|skipped\b|todo\b|duration_ms\b)|1\.\.\d+\s*$)/.test(line));
  // Astro also prints plain thrown messages with no "Error:" prefix, followed
  // by a Location/Stack trace block. Capture that message, not a passed test.
  const location = lines.findIndex(line => /^\s*(?:Location|Stack trace):/.test(line));
  let start = location > 0 ? location - 1 : -1;
  if (start < 0) start = lines.findIndex(line => /missing complete|\[ERROR\]|\berror:|error (?:TS\d|ts\()|^\s*not ok\b|npm (?:ERR!|error)/i.test(line));
  if (start < 0) start = lines.findIndex(line => /failed|untranslated|text shared with Spanish/i.test(line));
  return (start >= 0 ? lines.slice(Math.max(0, start - 1), start + 16) : lines.slice(-16)).join('\n').slice(0, 4000);
}
/** @param {string} body @param {string} secret */
export function reportSignature(body, secret) { return createHmac('sha256', secret).update(body).digest('hex'); }

/** @typedef {{site: string, repo: string, branch: string, provider: string, script: string}} Target */
/** @param {Target} target @param {Record<string, string | undefined>} env */
export function buildContext(target, env) {
  if (target.provider === 'netlify') {
    if (env.CONTEXT !== 'production' || env.BRANCH !== target.branch || env.SITE_ID !== target.site || !env.COMMIT_REF || !env.DEPLOY_ID) return null;
    return { site_id: target.site, provider: 'netlify', context: 'production', branch: env.BRANCH, commit: env.COMMIT_REF, deploy_id: env.DEPLOY_ID };
  }
  if (env.GITHUB_ACTIONS !== 'true' || !['push', 'workflow_dispatch'].includes(env.GITHUB_EVENT_NAME || '') ||
      env.GITHUB_REF !== `refs/heads/${target.branch}` || env.GITHUB_REPOSITORY !== `DeLaCroix-/${target.repo}` || !env.GITHUB_SHA || !env.GITHUB_RUN_ID) return null;
  return { site_id: target.site, provider: 'github', context: 'production', branch: target.branch, commit: env.GITHUB_SHA, run_id: env.GITHUB_RUN_ID };
}

/** @param {string} output @param {Target} target @param {Record<string, string | undefined>} env */
export async function reportBuildFailure(output, target, env = process.env) {
  const context = buildContext(target, env);
  if (!context || !env.SEO_BUILD_REPORT_SECRET) return;
  const body = JSON.stringify({ ...context, timestamp: Date.now(),
    error: buildDiagnostic(output, Object.entries(env).filter(([key]) => /SECRET|TOKEN|PASSWORD|API_KEY|FTP_PASS/i.test(key)).map(([, value]) => value)),
  });
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch('https://qbzgqbtzrvmtwvgnjkrq.supabase.co/functions/v1/seo-build-report', {
        method: 'POST', body, signal: AbortSignal.timeout(8000),
        headers: { 'Content-Type': 'application/json', 'X-Build-Signature': reportSignature(body, env.SEO_BUILD_REPORT_SECRET) },
      });
      if (response.ok) { console.error('Build failure reported to CRM.'); return; }
      if (response.status < 500) { console.error(`CRM build report rejected: HTTP ${response.status}`); return; }
    } catch { /* Preserve the original failure and exit code. */ }
  }
  console.error('CRM build report unavailable; publication timeout remains active.');
}
