
#!/usr/bin/env bash
set -euo pipefail

echo "Creating stable locator helper (CommonJS) for Klassi-JS + WDIO v9..."

# Folders
mkdir -p shared-objects/stable
mkdir -p features/stable-locator
mkdir -p step_definitions/stable-locator
mkdir -p docs

# shared-objects/stable.js
cat > shared-objects/stable.js <<'JS'
const stable = require('./stable/stable-locator');
const names = require('./stable/names');
const fingerprints = require('./stable/fingerprints');
const frames = require('./stable/frame-shadow-helpers');

module.exports = {
  findStable: stable.findStable,
  clickStable: stable.clickStable,
  typeStable: stable.typeStable,
  getTextStable: stable.getTextStable,
  existsStable: stable.existsStable,
  debugCandidates: stable.debugCandidates,
  getSynonyms: names.getSynonyms,
  names,
  fingerprints,
  frames
};
JS

# shared-objects/stable/names.js
cat > shared-objects/stable/names.js <<'JS'
const localeSets = {
  'common.submit': ['Submit', 'Save', 'Continue', 'Next'],
  'common.cancel': ['Cancel', 'Close', 'Dismiss'],
  'login.submit': ['Log in', 'Sign in', 'Connexion', 'Anmelden', 'Iniciar sesión', 'Accedi'],
  'logout.submit': ['Log out', 'Sign out', 'Abmelden', 'Cerrar sesión', 'Esci']
};
function getSynonyms(key, locale) {
  return (key && localeSets[key]) ? localeSets[key] : [];
}
module.exports = { getSynonyms, localeSets };
JS

# shared-objects/stable/fingerprints.js
cat > shared-objects/stable/fingerprints.js <<'JS'
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = path.resolve(process.cwd(), '.artifacts');
const FP_PATH = path.join(ARTIFACT_DIR, 'locator-fingerprints.json');

function loadStore() {
  try { return JSON.parse(fs.readFileSync(FP_PATH, 'utf8')||'{}'); } catch { return {}; }
}
function saveStore(store) {
  if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  fs.writeFileSync(FP_PATH, JSON.stringify(store, null, 2), 'utf8');
}
async function computeFingerprint(browser, element) {
  return await browser.execute((el) => {
    const tag = (el.tagName||'').toLowerCase();
    const role = el.getAttribute('role')||'';
    const type = el.getAttribute('type')||'';
    const testId = el.getAttribute('data-testid')||'';
    const aria = el.getAttribute('aria-label')||'';
    const id = el.id||'';
    const nameAttr = el.getAttribute('name')||'';
    const text = (el.innerText||el.textContent||'').trim().replace(/\s+/g,' ').slice(0,64);
    function landmarkSelector(node){
      if(!node) return '';
      const t = node.tagName?node.tagName.toLowerCase():'';
      const ariaLabel = node.getAttribute&&node.getAttribute('aria-label');
      const role = node.getAttribute&&node.getAttribute('role');
      if(t==='form'&&ariaLabel) return `form[aria-label="${ariaLabel}"]`;
      if((t==='section'||t==='main'||t==='nav')&&ariaLabel) return `${t}[aria-label="${ariaLabel}"]`;
      if(role&&(role==='region'||role==='dialog')) return `[role="${role}"]`;
      return '';
    }
    let cur=el,landmark='',hops=0; while(cur&&cur.parentElement&&hops<5&&!landmark){cur=cur.parentElement; landmark=landmarkSelector(cur); hops++;}
    return { tag, role, type, testId, aria, id, nameAttr, text, landmark };
  }, element);
}
function recordFingerprint(key, fp){ if(!key) return; const store=loadStore(); store[key]=fp; saveStore(store); }
function getFingerprint(key){ if(!key) return null; const store=loadStore(); return store[key]||null; }
function makeFingerprintCandidates(browser, fp){
  const c=[]; if(!fp) return c;
  if(fp.testId) c.push({ why:`fp data-testid=${fp.testId}`, query:()=>browser.$$(`[data-testid="${fp.testId}"]`) });
  if(fp.aria) c.push({ why:`fp aria/<${fp.aria}>`, query:()=>browser.$$(`aria/${fp.aria}`) });
  if(fp.tag && fp.text){ const token=fp.text.split(/\s+/)[0]; c.push({ why:`fp ${fp.tag}*=<${token}>`, query:()=>browser.$$(`${fp.landmark?fp.landmark+' ':''}${fp.tag}*=${token}`) }); }
  if(fp.tag && fp.type) c.push({ why:`fp ${fp.tag}[type=${fp.type}]`, query:()=>browser.$$(`${fp.landmark?fp.landmark+' ':''}${fp.tag}[type="${fp.type}"]`) });
  if(fp.id) c.push({ why:`fp #${fp.id}`, query:()=>browser.$$(`#${fp.id}`) });
  if(fp.nameAttr) c.push({ why:`fp [name=${fp.nameAttr}]`, query:()=>browser.$$(`[name="${fp.nameAttr}"]`) });
  return c;
}
module.exports = { computeFingerprint, recordFingerprint, getFingerprint, makeFingerprintCandidates, FP_PATH };
JS

# shared-objects/stable/frame-shadow-helpers.js
cat > shared-objects/stable/frame-shadow-helpers.js <<'JS'
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
JS

# shared-objects/stable/stable-locator.js
cat > shared-objects/stable/stable-locator.js <<'JS'
const { getSynonyms } = require('./names');
const { computeFingerprint, recordFingerprint, getFingerprint, makeFingerprintCandidates } = require('./fingerprints');
const DEFAULT_TIMEOUT_MS = 7000;
function mergeNames(id){ const a=Array.isArray(id.names)?id.names.slice():[]; const b=id.synonymsKey?getSynonyms(id.synonymsKey,id.locale):[]; return Array.from(new Set([...a,...b].filter(Boolean))); }
function makeCandidates(id,browser){
  const tag=id.tag||'button'; const scopePrefix=id.landmark?`${id.landmark} `:''; const names=mergeNames(id); const c=[];
  if(id.testId) c.push({ query:()=>browser.$$(`[data-testid="${id.testId}"]`), score:100, why:`data-testid=${id.testId}` });
  names.forEach(n=>{ c.push({ query:()=>browser.$$(`${tag}=${n}`), score:85, why:`${tag}=<exact '${n}'>` }); c.push({ query:()=>browser.$$(`${scopePrefix}${tag}=${n}`), score:82, why:`${scopePrefix}${tag}=<exact '${n}'>` }); });
  names.forEach(n=> c.push({ query:()=>browser.$$(`aria/${n}`), score:80, why:`aria/<exact '${n}'>` }));
  if(id.type==='submit') c.push({ query:()=>browser.$$(`${scopePrefix}${tag}[type="submit"]`), score:50, why:`${scopePrefix}${tag}[type=submit]` });
  names.forEach(n=>{ const token=n.split(/\s+/)[0]; c.push({ query:()=>browser.$$(`${scopePrefix}${tag}*=${token}`), score:40, why:`${scopePrefix}${tag}*=<partial of '${n}'>` }); });
  if(tag==='a'&&names.length){ names.forEach(n=>{ c.push({ query:()=>browser.$$(`=${n}`), score:80, why:`linkText=<${n}>` }); c.push({ query:()=>browser.$$(`*=${n}`), score:60, why:`partialLinkText~<${n}>` }); }); }
  return c;
}
async function tryRanked(browser,candidates,deadline){
  while(Date.now()<deadline){ candidates.sort((a,b)=>b.score-a.score); for(const cand of candidates){ const els=await cand.query(); if(els.length===1){ const el=els[0]; if(await el.isDisplayed()) return el; } } await browser.pause(150); } return null;
}
async function findStable(browser,id,options={}){
  const timeoutMs=options.timeoutMs??DEFAULT_TIMEOUT_MS; const deadline=Date.now()+timeoutMs;
  const candidates=makeCandidates(id,browser); const primary=await tryRanked(browser,candidates,deadline);
  if(primary){ if(id.key){ try{ const fp=await computeFingerprint(browser,primary); recordFingerprint(id.key,fp);}catch{} } return primary; }
  const fp=id.key?getFingerprint(id.key):null; if(fp){ const fpCands=makeFingerprintCandidates(browser,fp).map(c=>({...c,score:75})); const healed=await tryRanked(browser,fpCands,Date.now()+1500); if(healed) return healed; }
  const diag=[]; for(const c of candidates){ const count=(await c.query()).length; diag.push(`${c.why}: ${count} match(es)`); } throw new Error(`Stable locator failed for key='${id.key||''}'. Tried:\n${diag.join('\n')}`);
}
async function clickStable(browser,id,options){ const el=await findStable(browser,id,options); await el.click(); return el; }
async function typeStable(browser,id,value,options){ const el=await findStable(browser,id,options); await el.setValue(value); return el; }
async function getTextStable(browser,id,options){ const el=await findStable(browser,id,options); return el.getText(); }
async function existsStable(browser,id,options){ try{ await findStable(browser,id,options); return true; }catch{ return false; } }
async function debugCandidates(browser,id){ const cands=makeCandidates(id,browser); const results=[]; for(const c of cands){ const count=(await c.query()).length; results.push({ why:c.why, score:c.score, count }); } const fp=id.key?getFingerprint(id.key):null; const fpResults=[]; if(fp){ const fps=makeFingerprintCandidates(browser,fp); for(const c of fps){ const count=(await c.query()).length; fpResults.push({ why:c.why, count }); } } return { results, fp, fpResults }; }
module.exports = { findStable, clickStable, typeStable, getTextStable, existsStable, debugCandidates };
JS

# Optional diagnostics feature & steps
cat > features/stable-locator/diagnostics.feature <<'FEAT'
@diagnostics
Feature: Stable locator diagnostics
  Scenario: Print diagnostics for login submit
    When I navigate to the login page
    Then I print locator diagnostics for the login button
FEAT

cat > step_definitions/stable-locator/diagnostics-steps.js <<'JS'
const { When, Then } = require('@cucumber/cucumber');

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
JS

# Docs
cat > docs/STABLE_LOCATOR.md <<'MD'
# Stable Locator Helper (Klassi-JS + WDIO v9)
Run Klassi with:
node ./node_modules/klassi-js/index.js \
  --featureFiles ./features \
  --steps ./step_definitions \
  --pageObjects ./page-objects \
  --sharedObjects ./shared-objects \
  --browser chrome

Usage in steps:
await sharedObjects.stable.typeStable(browser, {
  key: 'login.email',
  testId: 'email-input',
  tag: 'input',
  landmark: 'form[aria-label="Login"]'
}, 'user@example.com');

await sharedObjects.stable.clickStable(browser, {
  key: 'login.submit',
  synonymsKey: 'login.submit',
  testId: 'login-submit',
  tag: 'button',
  type: 'submit',
  landmark: 'form[aria-label="Login"]'
});
MD

# gitignore
if ! grep -q ".artifacts/" .gitignore 2>/dev/null; then
  printf "\n# self-healing fingerprints\n.artifacts/\n" >> .gitignore
fi

echo "Done. Commit these files and open your PR."
