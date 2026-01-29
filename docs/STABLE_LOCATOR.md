# Stable Locator Helper (Klassi-JS + WDIO v9)
Run Klassi with:
node ./node_modules/klassi-js/index.js \
  --featureFiles ./features \
  --steps ./step_definitions \
  --pageObjects ./page-objects \
  --sharedObjects ./shared-objects \
  --browser chrome

Usage in steps:
await sharedObjects.stable.typeStable(browser, {
  key: 'login.email',
  testId: 'email-input',
  tag: 'input',
  landmark: 'form[aria-label="Login"]'
}, 'user@example.com');

await sharedObjects.stable.clickStable(browser, {
  key: 'login.submit',
  synonymsKey: 'login.submit',
  testId: 'login-submit',
  tag: 'button',
  type: 'submit',
  landmark: 'form[aria-label="Login"]'
});
