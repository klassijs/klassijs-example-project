const locators = {
  "menus": {
    "Home": "nav a[href=\"/\"]",
    "About": "nav a[href=\"/about\"]",
    "Contact": "nav a[href=\"/contact\"]",
    "KlassiTech": "nav a[href=\"/klassitech\"]"
  },
  "headings": {
    "Welcome to the Klassi™ Brand": "//h1[contains(normalize-space(), \"Welcome to the Klassi Brand\")]",
    "About Us": "//h1[normalize-space()=\"About Us\"]",
    "Contact Us": "//h1[normalize-space()=\"Contact Us\"]",
    "KlassiTech": "//h1[normalize-space()=\"KlassiTech\"]"
  }
};

function locator(group, name) {
  const selector = locators[group] && locators[group][name];
  if (!selector) {
    throw new Error(`No ${group} locator for "${name}"`);
  }
  return selector;
}

module.exports = {
  async selectNavigation(name) {
    await helpers.waitAndClick(locator('menus', name));
  },
  async headingIsDisplayed(name) {
    await global.browser.$(locator('headings', name)).waitForDisplayed();
  },
};
