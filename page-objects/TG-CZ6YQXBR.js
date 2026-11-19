module.exports = {
  // the About Us section is displayed
  async aboutUsSection() {
    await global.browser.$('nav a[href="/about"]').waitForDisplayed();
  },
  // the Our Mission section is displayed
  async ourMissionSection() {
    await global.browser.$('a[href="/klassitech"]').waitForDisplayed();
  },
  // the Our Vision section is displayed
  async ourVisionSection() {
    await global.browser.$('a[href="/klassitech"]').waitForDisplayed();
  }
};
