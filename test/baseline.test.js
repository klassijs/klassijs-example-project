const assert = require('node:assert/strict');
const { mkdtemp, readFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { root, runKlassi } = require('./run-klassi');

const suite = path.join(root, 'test/fixtures/baseline.json');

test('ai:baseline saves a run and ai:compare accepts the same suite', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'klassi-baseline-'));
  const baseline = path.join(directory, 'baseline.json');
  const saved = await runKlassi(['ai:baseline', '--suite', suite, '--platform', 'azure-openai', '--samples', '1', '--concurrency', '1', '--output', baseline]);
  assert.equal(saved.code, 0, saved.stderr || saved.stdout);

  const parsed = JSON.parse(await readFile(baseline, 'utf8'));
  assert.equal(parsed.suiteId, 'baseline-suite');
  assert.equal(parsed.caseResults['greeting-001'].status, 'pass');

  const compared = await runKlassi([
    'ai:compare',
    '--suite', suite,
    '--platform', 'azure-openai',
    '--samples', '1',
    '--concurrency', '1',
    '--baseline', baseline,
    '--output', directory,
    '--latency-delta', '60000',
  ]);
  assert.equal(compared.code, 0, compared.stderr || compared.stdout);
  assert.match(compared.stdout, /comparison: (no material change|improvement)/);
});
