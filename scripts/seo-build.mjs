import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { reportBuildFailure } from './seo-build-report.mjs';
const target = JSON.parse(readFileSync(new URL('./seo-publication.json', import.meta.url), 'utf8'));
const npmPath = process.env.npm_execpath;
if (!npmPath) throw new Error('Run this build with npm run build:reported');
const args = process.argv.slice(2);
const child = spawn(process.execPath, [npmPath, ...(args.length ? args : ['run', target.script])], { stdio: ['inherit', 'pipe', 'pipe'] });
let output = '';
/** @param {Buffer} chunk */
const remember = chunk => { output = (output + chunk.toString()).slice(-64_000); };
child.stdout.on('data', chunk => { process.stdout.write(chunk); remember(chunk); });
child.stderr.on('data', chunk => { process.stderr.write(chunk); remember(chunk); });
child.on('error', error => { output += `\nError: ${error.message}`; });
child.on('close', async code => {
  if (code !== 0) await reportBuildFailure(output || `Error: build process exited with code ${code}`, target);
  process.exitCode = code ?? 1;
});
