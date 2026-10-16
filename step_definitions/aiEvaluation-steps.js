When('I evaluate the Azure greeting', async () => {
  await pageObjects.aiEvaluation.azureGreeting();
});

When('I evaluate the Azure support case', async () => {
  await pageObjects.aiEvaluation.azureSupportCase();
});

When('I evaluate the Azure security suite', async () => {
  await pageObjects.aiEvaluation.azureSecuritySuite();
});

When('I evaluate the Azure return policy', async () => {
  await pageObjects.aiEvaluation.azureReturnPolicy();
});

When('I evaluate the Azure JSON decision', async () => {
  await pageObjects.aiEvaluation.azureJsonDecision();
});

Then('the AI quality gate passes', async () => {
  await pageObjects.aiEvaluation.gatePassed();
});

Then('an AI JSON report is written', async () => {
  await pageObjects.aiEvaluation.reportWritten();
});
