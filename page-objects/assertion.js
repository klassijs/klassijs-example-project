const { softAssert } = require('klassijs-soft-assert');

let elem;

class assertion {
  /**
   * enters a search term into duckduckgo's search box and presses enter
   * @param {string} searchWord
   * @returns {Promise} a promise to enter the search values
   */
  async performWebSearch(searchWord) {
    elem = await browser.$(sharedObjects.searchData.elem.searchInput);
    await browser.pause(DELAY_1s);
    await elem.addValue(searchWord);
    await browser.pause(DELAY_100ms);
    const title = await browser.getTitle();
    console.log('checking what title being returned:- ================> ', title);
    await browser.pause(DELAY_1s);
    await softAssert(title, 'tohavetext', 'our prioritys');
    await softAssert(title, 'tohavetext', 'our priority');
    await browser.keys('\uE007');
    await browser.pause(DELAY_1s);
  }

  async searchResult(searchWord){
    elem = await browser.$(sharedObjects.searchData.elem.resultLink);
    console.log('checking what elem.length is ================> ', elem.elementId);
    await softAssert(elem.elementId,'equal', null );
    await softAssert(elem.elementId,'toNotEqual', null );
    await browser.pause(DELAY_1s);
    await elem.click()
  }
}

module.exports = new assertion();
