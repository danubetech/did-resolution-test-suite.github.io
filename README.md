# did-resolution-test-suite
_test suite for DID resolver_

## HTML reports

This repository runs API tests for the following endpoints:
- `https://dev.uniresolver.io/1.0/identifiers/`
- `https://resolver.svip.danubetech.com/1.0/identifiers/`
- `https://api.godiddy.com/0.1.0/universal-resolver/identifiers/`

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

`npm run test` executes `npm run cypress:run || npm run posttest`. `npm run cypress:run`
runs Cypress tests to completion. By default, cypress run will run
all tests headlessly. With `npm run posttest` reports for each single spec are created and combined. The
single reports for each spec are stored in `cypress/reports/mocha`. The combined report, including all specs,
can be found in `cypress/reports/mochareports` which is stored as both a `.json` file and an `.html` file.
In addition to these command, `clean:reports` is run each
time `npm run test` is executed. This command deletes all old results and reports from
the `cypress/reports` directory before new reports are created.

### Run single specs
A single spec can also be executed with the following:

```markdown
npm run test -- --spec <<path_to_spec>>
```

E.g. to run the resolver spec:

```markdown
npm run test -- --spec "cypress/integration/resolver_spec.js"
```

#### Run specific tests

Tests can be switched off and on by the usage of environment variables. By default, all tests and all specs are run. In order to run subset of all tests,
the environment variables of specific tests have to be swtichd off. This can be done by setting the environment variable to `false`. See below for a list of environment variables:

````markdown 
"TEST_200"            runs a test with a normal DID
"TEST_200JLD"         runs a test with a normal DID including a header
"TEST_406"            runs a test with an unsupported DID
"TEST_410"            runs a test with a deactivated DID
"TEST_404"            runs a test with a DID that is not found
"TEST_400"            runs a test with an invalid DID
"TEST_200F"           runs a test with a DID with a fragment
````

E.g. to skip the first test:

```markdown
npm run test -- --env TEST_200=false
```


### Test different endpoints
All specs are run with endpoint: `https://api.godiddy.com/0.1.0/universal-resolver/identifiers/` by default. Other endpoints can
be tested by passing in endpoint in the `ENDPOINT` environment variable in the command line:

```markdown
npm run test -- --env ENDPOINT=<<ENDPOINT>>
```

### Where to find the test reports
The results will be stored in a local folder _/cypress/reports/mocha_.
Test results in this folder contain the result of each spec in a json format.
A merged or combined result of all specs can be found in the local folder
_/cypress/reports/mochareports_. A combined result is stored in both a json file and an HTML file._ 

