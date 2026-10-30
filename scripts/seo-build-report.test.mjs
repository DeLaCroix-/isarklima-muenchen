import test from 'node:test';
import assert from 'node:assert/strict';
import { buildContext, buildDiagnostic, reportSignature } from './seo-build-report.mjs';
const target = { site: 'site-a', repo: 'site-a', branch: 'master', provider: 'netlify', script: 'build' };
test('reports the real error rather than a test name containing failure', () => {
  assert.match(buildDiagnostic('# Subtest: failed reports are safe\nok 1\n[ERROR] Missing complete en translation: New title'), /Missing complete en translation: New title/);
  assert.ok(buildDiagnostic('x'.repeat(10000)).length <= 4000);
});
test('redacts credentials in diagnostic', () => {
  assert.equal(buildDiagnostic('Error: token=12345678 secretvalue', ['secretvalue']), 'Error: token=[REDACTED] [REDACTED]');
});
test('plain Astro exception is not confused with successful cookie-consent tests', () => {
  const log = '# Subtest: failed withdrawal persistence never restores an earlier acceptance\nok 11 - failed withdrawal persistence never restores an earlier acceptance\n# tests 12\n# pass 12\n# fail 0\n12:10:03 [build] generating routes\nNews group abc needs exactly one Spanish original and at most one English translation.\n  Location:\n    /opt/build/repo/node_modules/astro/route-cache.js:32:17\n  Stack trace:\n    at validatePairs (...)';
  const diagnostic = buildDiagnostic(log);
  assert.match(diagnostic, /News group abc needs exactly one Spanish original/);
  assert.doesNotMatch(diagnostic, /withdrawal persistence|Subtest:|# pass|# fail 0/);
});
test('actual failing TAP tests still show their assertion', () => {
  assert.match(buildDiagnostic('ok 1 - error handling works\nnot ok 2 - missing redirect\n  error: expected 301, received 404'), /expected 301, received 404/);
});
test('HMAC binds every payload byte', () => assert.notEqual(reportSignature('body', 'key'), reportSignature('changed', 'key')));
test('Netlify only reports its configured production site and branch', () => {
  const env = { SITE_ID: 'site-a', BRANCH: 'master', CONTEXT: 'production', COMMIT_REF: 'a'.repeat(40), DEPLOY_ID: 'b'.repeat(24) };
  assert.ok(buildContext(target, env));
  assert.equal(buildContext(target, { ...env, CONTEXT: 'deploy-preview' }), null);
  assert.equal(buildContext(target, { ...env, SITE_ID: 'site-b' }), null);
  assert.equal(buildContext(target, { ...env, BRANCH: 'other' }), null);
});
test('GitHub production is repository/branch-bound; PRs and secondary Netlify builds cannot report', () => {
  const github = { ...target, provider: 'github' };
  const env = { GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'push', GITHUB_REF: 'refs/heads/master', GITHUB_REPOSITORY: 'DeLaCroix-/site-a', GITHUB_SHA: 'a'.repeat(40), GITHUB_RUN_ID: '123456' };
  assert.ok(buildContext(github, env));
  assert.equal(buildContext(github, { ...env, GITHUB_EVENT_NAME: 'pull_request' }), null);
  assert.equal(buildContext(github, { ...env, GITHUB_REPOSITORY: 'DeLaCroix-/other' }), null);
  assert.equal(buildContext(github, { CONTEXT: 'production' }), null);
});
