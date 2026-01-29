# Testing Salesforce Lightning App Builder with Klassi-JS

This document describes how this codebase can be used to test **Salesforce Lightning** and **Lightning App Builder** applications.

## Overview

This project is a **Klassi-JS** test suite: Cucumber (Gherkin) + **WebdriverIO** for browser automation. It drives a real browser against any URL. There is nothing in the framework that restricts it to a specific site—it can automate **Salesforce Lightning** the same way it automates other web applications.

**In short: yes, this codebase can be used to test Salesforce applications**, including apps built with Lightning App Builder.

---

## Why This Codebase Fits Salesforce Lightning

### 1. Browser automation

Lightning runs in the browser. WebdriverIO can load your org URL, click, type, and navigate. Existing helpers such as `loadPage`, `waitAndClick`, `waitAndSetValue`, and `getElementFromFrame` work against Lightning pages.

### 2. Stable locators

Salesforce Lightning often uses auto-generated IDs and a dynamic DOM. This project includes a **stable locator** pattern (see [STABLE_LOCATOR.md](./STABLE_LOCATOR.md)) that targets elements by semantic attributes (`testId`, `tag`, `landmark`, etc.) instead of brittle IDs—exactly what you need for Lightning.

Example usage in steps:

```js
await sharedObjects.stable.clickStable(browser, {
  key: 'appBuilder.save',
  synonymsKey: 'appBuilder.save',
  testId: 'save-button',
  tag: 'button',
  landmark: '[data-label="App Builder"]'
});
```

### 3. Shadow DOM support

Lightning Web Components (LWC) use **Shadow DOM**. The project already provides helpers for piercing Shadow DOM in `shared-objects/stable/frame-shadow-helpers.js`:

```js
// Click an element inside a shadow host
const { clickShadow } = require('../shared-objects/stable/frame-shadow-helpers');
await clickShadow(browser, 'host-selector', 'inner-selector');
```

You can extend this pattern (e.g. type into shadow hosts) for Lightning components that render inside shadow roots.

### 4. Iframe support

Where Salesforce uses iframes (e.g. for some embedded components or classic UI), the framework’s `getElementFromFrame` helper and `withFrame` in the shared objects allow interacting with elements inside frames.

---

## What You Need to Add for Salesforce

To use this codebase specifically for **Salesforce Lightning App Builder** (or any Lightning app), add the following.

| Area | What to do |
|------|------------|
| **Environment** | Add your Salesforce base URL(s) in `.envConfigrc.js` or `.dataConfigrc.js` (or via env vars) and use them in `loadPage` / step definitions. |
| **Authentication** | Implement a login flow (e.g. a Background step “Given I am logged into Salesforce”) and steps that open the org; reuse session/cookies if needed. |
| **Features & steps** | New `.feature` files and step definitions for your Lightning App Builder flows (e.g. open app, add/edit components, save, verify). |
| **Page objects** | Page objects for Lightning App Builder and key Lightning pages, using **stable locators** (and shadow helpers where the component is inside Shadow DOM). |
| **Timing** | Use appropriate timeouts or explicit waits for Lightning’s async UI (e.g. list views, record pages, or App Builder finishing load). |

---

## Running Tests

Use the same Klassi-JS entrypoint and options as for other tests. Example:

```bash
node ./node_modules/klassi-js/index.js \
  --featureFiles ./features \
  --steps ./step_definitions \
  --pageObjects ./page-objects \
  --sharedObjects ./shared-objects \
  --browser chrome
```

For Salesforce-specific features, point to your Salesforce feature folder or use tags, for example:

```bash
node ./node_modules/klassi-js/index.js --tags @salesforce --browser chrome
```

---

## Summary

- The **framework** (Klassi-JS + WebdriverIO + Cucumber) is suitable for testing Salesforce and Lightning App Builder.
- **Stable locators** and **Shadow DOM** helpers in this repo align well with Lightning’s DOM characteristics.
- To test a Lightning App Builder application, add: Salesforce URL/config, login flow, and features/page objects/steps that target your Lightning app using these patterns.
