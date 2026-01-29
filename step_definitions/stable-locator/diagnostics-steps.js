// const { When, Then } = require('@cucumber/cucumber');

When('I navigate to the login page', async function () {
  try { await browser.url('/login'); } catch (e) { /* adjust navigation as needed */ }
});

Then('I print locator diagnostics for the login button', async function () {
  const report = await sharedObjects.stable.debugCandidates(browser, {
    key: 'login.submit',
    synonymsKey: 'login.submit',
    testId: 'login-submit',
    tag: 'button',
    type: 'submit',
    landmark: 'form[aria-label="Login"]'
  });

  console.log('=== Candidate counts ===');
  for (const r of report.results) console.log(`${String(r.score).padStart(3)} | ${r.count} | ${r.why}`);
  if (report.fp) {
    console.log('\n=== Stored fingerprint ===');
    console.log(report.fp);
    console.log('\n=== Fingerprint candidates ===');
    for (const r of report.fpResults) console.log(`${r.count} | ${r.why}`);
  }
});
