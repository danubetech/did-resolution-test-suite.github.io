# did-resolution-test-suite
_test suite for DID resolver_

## HTML reports

This repository runs API tests for the following endpoints:
- `https://dev.uniresolver.io/1.0/identifiers/`
- `https://resolver.svip.danubetech.com/1.0/identifiers/`
- `https://api.godiddy.com/0.1.0/universal-resolver/identifiers/`
- `https://api.godiddy.dev.com/0.1.0/universal-resolver/identifiers/`


<!-- In the current version of this repository, the report of https://dev.uniresolver.io/1.0/identifiers/ is shown.  -->

### Configure test suite

Test runs can be configured by adding a file to the `config` folder at the root level of the repo.  
- The file must hold a property `endpoint` and the value must include the full path to the resolver.  
- The file must hold a property `testData` which should contain properties. If `testData` is empty no tests will be run.  

Structure of `testData` is as following:
- `Key` must be the prefix of a testfile in the `integration` folder. To run eg `validDids.spec.js` a property `validDids` must be added to `testData`
- `Value` must be at least one DID that can be used for the respective test-file specified in `Key`
- The same DIDs can be used in multiple tests if they are suited to each of them

The `config` can be passed as an env variable like this:
```bash
config=../config/dev.uniresolver.io.json node ci/run.js
```

### Running test suite locally

To install Cypress and dependencies (first time):
```markdown
npm i -g cypress
cypress install
npm i
```

To run the test only without creating reports:
```markdown
cypress run
```

To run the test and create the reports:

```markdown
npm run test
```

`npm run test` executes all test specs in the `cypress/integration/` folder, it creates test results and stores those test results in the 
`cypress/reports` folder. `npm run test` executes both `npm run cypress:run` and `npm run posttest` in order to do so. 
`npm run cypress:run` runs Cypress tests to completion. By default, cypress run will run
all tests headlessly. By executing `npm run posttest`, reports for each single spec are created and combined. The
single reports for each spec are stored in `cypress/reports/mocha`. The combined report, including all specs,
can be found in `cypress/reports/mochareports` which is stored as both a `.json` file and an `.html` file.
In addition to these command, `clean:reports` is run each time `npm run test` is executed. This command deletes all previous results and reports from
the `cypress/reports` directory before new reports are created.

### Test different endpoints
All specs are run with endpoint: `https://api.godiddy.com/0.1.0/universal-resolver/identifiers/` by default. Other endpoints can
be tested by passing in endpoint in the `ENDPOINT` environment variable in the command line:

```markdown
ENDPOINT=<<ENDPOINT>> npm test
```

### Run single specs
A single spec can also be executed with the following command:

```markdown
SPEC=<<path_to_spec>> npm test
```

E.g. to run the resolver spec:

```markdown
SPEC=cypress/integration/user/resolver_spec_old.js npm test
```

In order to run a group of tests: 

```markdown
SPEC=cypress/integration/user/* npm test
```

to run all specs in the user folder and: 

```markdown
SPEC=cypress/integration/admin/* npm test
```

to run all tests in the admin folder.


### Where to find the test reports
The results will be stored in a local folder _/cypress/reports/mocha_.
Test results in this folder contain the result of each spec in a json format.
A merged or combined result of all specs can be found in the local folder
_/cypress/reports/mochareports_. A combined result is stored in both a json file and an HTML file._ 

