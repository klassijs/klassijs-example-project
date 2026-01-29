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
