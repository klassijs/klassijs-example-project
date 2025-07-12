
# Example Test Project
[![Webdriverio API](https://img.shields.io/badge/webdriverio-docs-40b5a4)](https://webdriver.io/docs/api.html)

## Project Setup
After creating a new project, please add the project name (i.e. 'eReader-test-suite') to these files:
```bash
- Lambdatest folder all files
- .dataConfigrc.js
- package.json
- .versionrc.json

For simplicity we have two default tags for test execution @regression and @integration.
As a rule of thumb we use the @integration tag on at least one Scenario per Feature file.
```
## Usage
After checking out the template go to the project root and run:
```bash
pnpm install 
```
## Options


```bash
--help                              output usage information
--version                           output the version number
--browser <browsers>                name of browser to use (chrome, firefox). defaults to chrome
--tags <@tagName>                   name of cucumber tags to run - Multiple TAGS usage (@tag1,@tag2)
--exclude <@tagName>                name of cucumber tags to exclude - Multiple TAGS usage(@tag3,@tag5)
--steps <path>                      path to step definitions. defaults to ./step-definitions
--featureFiles <path>               path to feature definitions. defaults to ./features
--pageObjects <path>                path to page objects. defaults to ./page-objects
--sharedObjects <paths>             path to shared objects - repeatable. defaults to ./shared-objects
--reports <path>                    output path to save reports. defaults to ./reports
--disableReport                     disables the test report from opening after test completion
--email                             sends email reports to stakeholders
--env <path>                        name of environment to run the framework/test in. default to dev
--reportName <optional>             name of what the report would be called i.e. 'Automated Test'
--remoteService <optional>          which remote driver service, if any, should be used e.g. browserstack
--extraSettings <optional>          further piped configs split with pipes
--baselineImageUpdate               automatically update the baseline image after a failed comparison. defaults to false
--browserOpen                       this leaves the browser open after the session completes, useful when debugging test. defaults to false
--dlink                             the switch for projects with their test suite, within a Test folder of the repo
--dryRun                            the effect is that Cucumber will still do all the aggregation work of looking at your feature files, loading your support code etc but without actually executing the tests
--useProxy                          this is in-case you need to use the proxy server while testing
--reportBackup                      This is to clear the "reports" folder & keep the record in back-up folder,default value is false. While using this indicator, the name "reportBackup" needs to be added to the git ignore file 
--reportClear                       This is to clear the "reports" folder, default value is false
--skipTag <@tagName>                provide a tag and all tests marked with it will be skipped automatically.
```
## Options Usage
```bash
  --tags @get,@put || will execute the scenarios tagged with the values provided. If multiple are necessary, separate them with a comma (no blank space in between).
  --featureFiles features/utam.feature,features/getMethod.feature || provide specific feature files containing the scenarios to be executed. If multiple are necessary, separate them with a comma (no blank space in between).
  --browser firefox,chrome || will execute the tests in the browser specified. To run tests in parallel use multiple browsers, separate them with a comma (no blank space in between).
```

## Klassi-js JS modules

To streamline test script development and ensure consistency across projects, the following JavaScript libraries are being exported from klassi-js. This approach allows these libraries to be utilized at the project level without the need for duplicate installations, thereby reducing redundancy and potential conflicts.

- Exported libraries:

| JS Library    | Description                                                                                                                               |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `pactum`      | A REST API testing tool for automating end-to-end, integration, contract, and component tests                                             |
| `webdriverio` | A next-gen browser and mobile automation test framework for Node.js                                                                       |
| `fs-extra`    | Provides extra file system methods and promise support, enhancing the native fs module                                                    |
| `dotenv`      | Loads environment variables from a .env file into process.env to manage configuration separately from code                                |
| `Husky`       | A tool for managing Git hooks to automate tasks like linting, testing, and code formatting before commits or pushes                       |
| `S3Client`    | Part of the AWS SDK for JavaScript, it allows interaction with Amazon S3 for operations like uploading, downloading, and managing objects |

  ```js
  // usage klassi-js module at project level i.e.  
  const pactumJs = require('klassi-js/klassiModule').pactum;

  require('klassi-js/klassiModule').dotenv.config();

  const fs = require('klassi-js/klassiModule').fs-extra;

  ```

## Helpers
klassi-js contains a few helper methods to help along the way, these methods are:

| Function                                                | Description                                                                         |
| :------------------------------------------------------ | :---------------------------------------------------------------------------------- |
| await helpers.loadPage('url', timeout)                  | Loads the required page                                                             |
| await helpers.writeToTxtFile(filepath, output)          | Writes content to a text file                                                       |
| await helpers.readFromFile(filepath)                    | Reads content from a text file                                                      |
| await helpers.currentDate()                             | Applies the current date to files                                                   |
| await helpers.getCurrentDateTime()                      | Get current date and time                                                           |
| await helpers.clickHiddenElement(selector, textToMatch) | Clicks an element that is not visible                                               |
| await helpers.getRandomIntegerExcludeFirst(range)       | Get a random integer from a given range                                             |
| await helpers.getLink(selector)                         | Get the href link from an element                                                   |
| await helpers.waitAndClick(selector)                    | Wait until and element is visible and click it                                      |
| await helpers.waitAndSetValue(selector, value)          | Wait until element to be in focus and set the value                                 |
| await helpers.getElementFromFrame(frameName, selector)  | Get element from frame or frameset                                                  |
| await helpers.readFromJson()                            | Read from a json file                                                               |
| await helpers.writeToJson()                             | Write data to a json file                                                           |
| await helpers.mergeJson()                               | Merge json files                                                                    |
| await helpers.reportDateTime()                          | Reporting the current date and time                                                 |
| await helpers.apiCall()                                 | API call for GET, PUT, POST and DELETE functionality using PactumJS for API testing |
| await helpers.getLink()                                 | Get the href link from an element                                                   |
| await helpers.getElementFromFrame()                     | Get element from frame or frameset                                                  |
| await helpers.generateRandomInteger()                   | Generate random integer from a given range                                          |
| await helpers.randomNumberGenerator()                   | Generates a random 13 digit number                                                  |
| await helpers.reformatDateString()                      | Reformats date string into string                                                   |
| await helpers.sortByDate()                              | Sorts results by date                                                               |
| await helpers.filterItem()                              | Filters an item from a list of items                                                |
| await helpers.filterItemAndClick()                      | Filters an item from a list of items and clicks on it                               |
| await helpers.fileUpload()                              | Uploads a file from local system or project folder                                  |


## Browser usage
By default, the test run using Google Chrome/devtools protocol, to run tests using another browser locally you'll need a local selenium server running, supply the browser name along with the `--wdProtocol and --browser` switch

| Browser | Example |
| :--- | :--- |
| Chrome | `--browser chrome` |
| Firefox | `--browser firefox` |

To run tests in parallel, supply multiple browser names separated by a comma, for example: `--browser chrome,firefox`

## Remote Browser usage
To run tests in a remote browser, you can use the `--remoteService` switch to specify the service you want to use. Currently, the supported services are: LambdaTest, BrowserStack, SauceLabs, and Selenium Standalone.

Selenium Standalone Server installation
```bash
// for Mac / Linux
yarn global add selenium-standalone@latest
selenium-standalone install && selenium-standalone start

// for Windows
npm install -g selenium-standalone@latest
selenium-standalone install
selenium-standalone start
```

## How to debug

Most webdriverio methods return a [JavaScript Promise](https://spring.io/understanding/javascript-promises "view JavaScript promise introduction") that is resolved when the method completes. The easiest way to step in with a debugger is to add a ```.then``` method to the function and place a ```debugger``` statement within it, for example:

```js
  When(/^I search DuckDuckGo for "([^"]*)"$/, function (searchQuery, done) {
    elem = browser.$('#search_form_input_homepage').then(function(input) {
      expect(input).to.exist;
      debugger; // <<- your IDE should step in at this point, with the browser open
      return input;
    })
       done(); // <<- let cucumber know you're done
  });
```

## Commit conventions

To enforce best practices in using Git for version control, this project includes a **Husky** configuration. Note that breaking the given rules will block the commit of the code.

### Commits
 After committing the staged code, the Husky scripts will enforce the implementation of the [**Conventional Commits specification**](https://www.conventionalcommits.org/en/v1.0.0/#summary).

To summarize them, all commits should follow the following schema:

```
git commit -m "<type>: <subject>"
```

Where **type** is one of the following:

- **fix**: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
- **feat**: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
- **BREAKING CHANGE**: a commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking API change (correlating with MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of any type.
- Types other than **fix:** and **feat:** are allowed, for example @commitlint/Tconfig-conventional (based on the Angular convention) recommends **build:, chore:, ci:, docs:, style:, refactor:, perf:, test:**, and others.
footers other than **BREAKING CHANGE:** may be provided and follow a convention similar to git trailer format.

Please keep in mind that the **subject** must be written in lowercase.

### Branch naming

The same script will also verify the naming convention. Please remember that we only allow for two possible branch prefixes:

- **testfix/**
- **automation/**
- **feature/**

## License

Licenced under [MIT License](LICENSE) &copy; 2016 [Larry Goddard](https://www.linkedin.com/in/larryg)
