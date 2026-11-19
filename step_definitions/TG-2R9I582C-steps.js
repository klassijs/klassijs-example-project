const page = require('../page-objects/TG-2R9I582C');

Given('a visitor opens the website', async function () {
  await helpers.loadPage(env.base_url);
});

When('the visitor selects the {string} navigation link', async function (navigationLink) {
  await page.selectNavigation(navigationLink);
});

Then('the {string} heading is displayed', async function (heading) {
  await page.headingIsDisplayed(heading);
});

