module.exports = {
  // the homepage is displayed
  async homepage() {
    await global.browser.$('//a[normalize-space()="homepage"]').waitForDisplayed();
  }
};
