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
