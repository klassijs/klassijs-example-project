module.exports = {
  // the info@klassi.co.uk is displayed
  async infoKlassiCoUk() {
    await global.browser.$('a[href="mailto:info@klassi.co.uk"]').waitForDisplayed();
  },
  // the email contact link is not displayed
  async emailContact() {
    await global.browser.$('a[href="mailto:info@klassi.co.uk"]').waitForDisplayed({ reverse: true });
  },
  // unbound: info@klassi.co.uk is displayed as a link but is disabled the visitor selects the disabled email contact link
  async step3() {
    await global.browser.pause(0);
  }
};
