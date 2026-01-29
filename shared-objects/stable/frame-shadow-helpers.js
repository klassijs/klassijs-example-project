async function withFrame(browser, selectorOrPredicate, fn){
  await browser.switchFrame(selectorOrPredicate);
  try { return await fn(); } finally { await browser.switchFrame(null); }
}
async function clickShadow(browser, hostCss, innerCss){
  const host = await browser.$(hostCss);
  const target = await host.shadow$(innerCss);
  await target.click();
}
module.exports = { withFrame, clickShadow };
