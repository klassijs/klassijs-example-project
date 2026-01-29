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
