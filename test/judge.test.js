const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const { root, runKlassi } = require('./run-klassi');

const suite = path.join(root, 'test/fixtures/judge.json');

test('the six judge evaluators pass on the judge deployment', async () => {
  const result = await runKlassi(['ai:evaluate', '--suite', suite, '--platform', 'azure-openai', '--reporter', 'json', '--samples', '1', '--concurrency', '1']);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /quality gate: pass/);
});
