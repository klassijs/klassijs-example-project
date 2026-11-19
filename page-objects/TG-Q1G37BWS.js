module.exports = {
  // the Schedule a meeting is displayed
  async scheduleAMeeting() {
    await global.browser.$('[aria-label="Schedule a meeting"]').waitForDisplayed();
  },
  // Schedule a meeting is displayed as "<display_state>"
  async displayState() {
    await global.browser.$('//h1[contains(normalize-space(), "Welcome to the Klassi Brand")]').waitForDisplayed();
  },
  // unbound: Schedule a meeting is not displayed the visitor attempts to activate the Schedule a meeting link
  async step3() {
    await global.browser.pause(0);
  }
};
