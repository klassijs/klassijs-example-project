const { a11yValidatorFromUrl, a11yValidator, a11yValidatorFromPagesFile } = require('klassijs-a11y-validator');

function getAuthConfigFromEnv() {
  const loginUrl = process.env.A11Y_LOGIN_URL;
  const username = process.env.A11Y_USERNAME;
  const password = process.env.A11Y_PASSWORD;
  if (!loginUrl || !username || !password) return null;
  return {
    loginUrl,
    credentials: { username, password },
    selectors: {
      username: process.env.A11Y_USERNAME_SELECTOR,
      password: process.env.A11Y_PASSWORD_SELECTOR,
      submit: process.env.A11Y_SUBMIT_SELECTOR,
    },
  };
}

module.exports = {
  /**
   * Runs accessibility crawl against the current browser URL.
   * Intended for scenario: a11y:crawl (when the step chooses "current page").
   */
  runA11yCrawlOnly: async (url) => {
    // klassijs-a11y-validator uses the start URL's pathname as a prefix: only links under that path
    // are followed (e.g. /grovemusic). If you reduce the URL to `${origin}/`, that prefix becomes "/"
    // and the crawl can walk the whole domain (e.g. oxfordmusiconline.com), not just Grove Music.
    const startUrl = (() => {
      try {
        return new URL(String(url).trim()).href;
      } catch (e) {
        return url;
      }
    })();

    await a11yValidatorFromUrl(startUrl, {
      count: true,
      crawlOnly: true,
      // crawlOnly: false,
      // Ensure we don't artificially cap discovery.
      maxPages: 5,
      // Keep depth high enough to discover nested pages.
      maxDepth: 50,
      // Public site: don't skip pages due to auth heuristics.
      skipPrivatePages: false,
    });
  },

  runA11yCrawlWithAuth: async (url) => {
    const startUrl = (() => {
      try {
        return new URL(String(url).trim()).href;
      } catch (e) {
        return url;
      }
    })();

    const auth = getAuthConfigFromEnv();
    if (!auth) {
      throw new Error('Missing auth env vars: A11Y_LOGIN_URL, A11Y_USERNAME, A11Y_PASSWORD');
    }

    await a11yValidatorFromUrl(startUrl, {
      count: true,
      crawlOnly: false,
      maxPages: null,
      maxDepth: 50,
      skipPrivatePages: false,
      auth,
    });
  },

  runA11yPublicThenPrivate: async (siteUrl) => {
    const publicUrl = new URL(String(siteUrl).trim()).href;
    const privatePageUrl = new URL(String(siteUrl).trim()).href;

    // Phase 1: public crawl without auth
    await a11yValidatorFromUrl(publicUrl, {
      count: true,
      crawlOnly: false,
      maxPages: null,
      maxDepth: 50,
      skipPrivatePages: true,
      generateComprehensiveSummary: false,
    });

    // Phase 2: login once, then validate the single private URL
    const auth = getAuthConfigFromEnv();
    if (!auth) {
      throw new Error('Missing auth env vars: A11Y_LOGIN_URL, A11Y_USERNAME, A11Y_PASSWORD');
    }

    await a11yValidatorFromUrl(privatePageUrl, {
      count: true,
      crawlOnly: false,
      maxPages: 1,
      maxDepth: 0,
      skipPrivatePages: false,
      auth,
      generateComprehensiveSummary: true,
    });
  },

  /**
   * Opens one URL and runs axe (no link crawl). Matches pages-list / Scenario Outline rows.
   * Must navigate before a11yValidator — otherwise the document is still about:blank and reports show that URL.
   */
  runA11yOnSinglePage: async (pageUrl) => {
    const url = new URL(String(pageUrl).trim()).href;
    const urlObj = new URL(url);
    const pageName =
      urlObj.pathname === '/' || urlObj.pathname === ''
        ? 'home'
        : urlObj.pathname.replace(/\//g, '_').replace(/^_|_$/g, '').substring(0, 50) || 'page';

    await a11yValidator(pageName, true, { reportPageUrl: url });
  },

  
  runA11yOnPagesFromFile: async (relativePath) => {
    await a11yValidatorFromPagesFile(relativePath, { count: true });
  },

  runA11yOnPagesFromFileWithAuth: async (relativePath) => {
    const auth = getAuthConfigFromEnv();
    if (!auth) {
      throw new Error('Missing auth env vars: A11Y_LOGIN_URL, A11Y_USERNAME, A11Y_PASSWORD');
    }
    await a11yValidatorFromPagesFile(relativePath, { count: true, auth });
  },
};
