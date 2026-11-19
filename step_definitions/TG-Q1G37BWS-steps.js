const page = require('../page-objects/TG-Q1G37BWS');

Then('the Schedule a meeting is displayed', async function () {
  await page.scheduleAMeeting();
});

When('the visitor activates the Schedule a meeting link', async function () {
  await helpers.waitAndClick('[aria-label="Schedule a meeting"]');
});

Then('a usable scheduling interface opens, allowing the visitor to continue or return to the website', async function () {
  return undefined;
});

Then('no scheduling interface opens and the visitor remains on the current page', async function () {
  return undefined;
});

When('Schedule a meeting is not displayed the visitor attempts to activate the Schedule a meeting link', async function () {
  return undefined;
});

Then('no action occurs and the visitor remains on the current page', async function () {
  return undefined;
});

Then('an error message is displayed indicating the scheduling interface could not be opened', async function () {
  return undefined;
});
