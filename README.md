# did-resolution-test-suite
_test suite for DID resolver_

## HTML reports

This repository runs API tests for the following endpoints:
- `https://dev.uniresolver.io/1.0/identifiers/`
- `https://resolver.svip.danubetech.com/1.0/identifiers/`
- `https://api.godiddy.com/0.1.0/universal-resolver/identifiers/`
- `https://api.godiddy.dev.com/0.1.0/universal-resolver/identifiers/`


<!-- In the current version of this repository, the report of https://dev.uniresolver.io/1.0/identifiers/ is shown.  -->

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
SPEC=cypress/integration/user/resolver_spec.js npm test
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

#### Run specific tests

To run the test-suite with a custom set of tests in a CI env, it's advised to edit the `env` section in the [config file](https://github.com/danubetech/did-resolution-test-suite/blob/main/cypress.json) for cypress.  

Tests can also be switched off and on by the usage of environment variables. By default, all tests and all specs are run. In order to run a subset of all tests, the environment variables of specific tests have to be switched off. This can be done by setting the environment variable to `false`.  

*Note:* This environment variables are not supported by `npm test` but can be used with `cypress` 

See below for a list of environment variables:

````markdown 
"TEST_200"              runs a test with a normal DID
"TEST_200_JLD"          runs a test with a normal DID including a header
"TEST_200_CBOR"         runs a test with a normal DID containing CBOR DID document
"TEST_200_F"            runs a test with a DID with a fragment
"TEST_406"              runs a test with an unsupported DID
"TEST_410"              runs a test with a deactivated DID
"TEST_404"              runs a test with a DID that is not found
"TEST_400"              runs a test with an invalid DID
"TEST_200_RP"           runs a test with a DID containing a relative parameter  
"TEST_200_TK"           runs a test with a DID containing a transformKey                 
"TEST_200_VT"           runs a test with a DID containing the versionTime 
"TEST_200_VI"           runs a test with a DID containing the versionID
"TEST_200_DURL"         runs a test with a DID containing a dereference a DID URL*
"TEST_200_DRURL"        runs a test with a DID containing a dereference a DID URL**
````

`*:` containing the following header: `Accept: application/json`

`**:` containing the following header: `Accept: application/ld+json;profile="https://w3c-ccg.github.io/did-resolution/`

E.g. to skip the first test:

```markdown
npx cypress run -- --env TEST_200=false
``` 

### Where to find the test reports
The results will be stored in a local folder _/cypress/reports/mocha_.
Test results in this folder contain the result of each spec in a json format.
A merged or combined result of all specs can be found in the local folder
_/cypress/reports/mochareports_. A combined result is stored in both a json file and an HTML file._ 

