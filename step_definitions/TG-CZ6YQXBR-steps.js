const page = require('../page-objects/TG-CZ6YQXBR');

// Given('a visitor opens the website', async function () {
//   await helpers.loadPage(env.base_url);
// });

Then('the About Us section is displayed', async function () {
  await page.aboutUsSection();
});

Then('the Our Mission section is displayed', async function () {
  await page.ourMissionSection();
});

Then('the Our Vision section is displayed', async function () {
  await page.ourVisionSection();
});
