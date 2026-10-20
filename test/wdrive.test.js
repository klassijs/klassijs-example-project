const { readFile } = require('node:fs/promises');
const path = require('node:path');
const test = require('node:test');
const { softAssert, throwCollectedErrors } = require('klassijs-soft-assert');
const { root } = require('klassi-js/runtime/scripts/run-klassi');

const wDrive = process.env.KLASSI_WDRIVE || path.resolve(root, '../../wDrive');
const artefactsRoot = path.resolve(root, '../klassi-js/packages/ai-artefacts/dist');

test('the wDrive bundle is verified and written as Klassi cases', async () => {
  global.cucumberThis = { attach() {} };
  const { importTestGenieBundle, readBundle } = await import(path.join(artefactsRoot, 'import-test-genie.js'));
  const { verifyArtefact, verifyPageObject, verifySteps } = await import(path.join(artefactsRoot, 'index.js'));
  const result = await importTestGenieBundle(await readBundle(wDrive), root);
  await softAssert(result.outcome, 'equal', 'VERIFIED', result.findings.join('; '));
  await softAssert(result.sourceSystem, 'equal', 'test-genie-repo');
  await softAssert(result.imported.length > 1, 'isTrue');

  const featurePaths = [...new Set(result.imported.map((item) => item.feature))];
  const featureNames = featurePaths.map((file) => path.basename(file)).sort();
  await softAssert(featureNames.join(','), 'equal', 'TG-001.feature,TG-002.feature,TG-003.feature');

  let scenarioCount = 0;
  for (const featurePath of featurePaths) {
    const item = result.imported.find((entry) => entry.feature === featurePath);
    const feature = await readFile(featurePath, 'utf8');
    const steps = await readFile(item.steps, 'utf8');
    const pageObject = await readFile(item.pageObject, 'utf8');
    const scenarios = feature.split('\n').filter((line) => /^\s*Scenario(?: Outline)?:/.test(line));
    scenarioCount += scenarios.length;
    const gherkin = await verifyArtefact({
      id: path.basename(featurePath, '.feature'),
      type: 'gherkin',
      path: featurePath,
      content: feature,
      provenance: { origin: 'ai', sourceSystem: result.sourceSystem, sourceId: path.basename(featurePath, '.feature') },
    });
    const page = verifyPageObject(pageObject);
    const stepFindings = verifySteps(feature, steps).filter((finding) => finding.severity !== 'low');
    const owned = result.imported.filter((entry) => entry.feature === featurePath);
    await softAssert(scenarios.length, 'equal', owned.length);
    await softAssert(gherkin.status, 'equal', 'pass', gherkin.findings.map((finding) => finding.message).join('; '));
    await softAssert(page.length, 'equal', 0, page.map((finding) => finding.message).join('; '));
    await softAssert(stepFindings.length, 'equal', 0, stepFindings.map((finding) => finding.message).join('; '));
    for (const ownedItem of owned) {
      await softAssert(feature, 'match', new RegExp(`@${ownedItem.requirementId} @${ownedItem.acceptanceTestId} @${ownedItem.id}`));
    }
  }
  await softAssert(scenarioCount, 'equal', result.imported.length);

  throwCollectedErrors();
});
