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
