const { readFile } = require('node:fs/promises');
const path = require('node:path');
const test = require('node:test');
const { softAssert, throwCollectedErrors } = require('klassijs-soft-assert');
const { root } = require('klassi-js/runtime/scripts/run-klassi');

test('the existing getMethod feature file passes verification', async () => {
  global.cucumberThis = { attach() {} };
  const featurePath = path.join(root, 'features/getMethod.feature');
  const content = await readFile(featurePath, 'utf8');
  const { verifyArtefact } = await import(path.resolve(root, '../klassi-js/packages/ai-artefacts/dist/index.js'));
  const result = await verifyArtefact({
    id: 'getMethod',
    type: 'gherkin',
    path: featurePath,
    content,
    provenance: { origin: 'human', sourceSystem: 'klassijs-example-project', sourceId: 'features/getMethod.feature' },
  });

  await softAssert(content, 'match', /Feature: The API feature\/functionality/);
  await softAssert(content, 'match', /Scenario: The response of a GET call/);
  await softAssert(result.status, 'equal', 'pass', result.findings.map((finding) => finding.message).join('; '));
  await softAssert(result.provenance.origin, 'equal', 'human');
  await softAssert(result.provenance.sourceId, 'equal', 'features/getMethod.feature');
  throwCollectedErrors();
});
