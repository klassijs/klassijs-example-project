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
