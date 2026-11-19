const page = require('../page-objects/TG-WJML111F');

Then('the info@klassi.co.uk is displayed', async function () {
  await page.infoKlassiCoUk();
});

When('the visitor activates the email contact link', async function () {
  await helpers.waitAndClick('a[href="mailto:info@klassi.co.uk"]');
});

Then('it invokes a mailto action addressed to info@klassi.co.uk', async function () {
  return undefined;
});

When('the email contact link is not displayed', async function () {
  await page.emailContact();
});

Then('no mailto action is invoked', async function () {
  return undefined;
});
