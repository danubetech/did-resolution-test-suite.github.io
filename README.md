_# did-resolution-test-suite
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

### Where to find the test reports
The results will be stored in a local folder _/cypress/reports/mocha_. 
Test results in this folder contain the result of each spec in a json format. 
A merged or combined result of all specs can be found in the local folder 
_/cypress/reports/mochareports_. A combined result is stored in both a json file and an HTML file._ 

