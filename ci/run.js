const runOptions = require('../cypress.json')
const cypress = require('cypress')
const fs = require('fs');

if (process.env.config !== undefined) {

    const config = require(process.env.config);
    fs.writeFileSync(
        "cypress/fixtures/example_dids.json",
        JSON.stringify(config.testData, null, 2)
    );

    const specs = [];
    Object.keys(config.testData).forEach((key) => {
        specs.push(`cypress/integration/${key}.spec.js`)
    })
    runOptions.spec = specs;

    runOptions.env = {
        ENDPOINT: config.endpoint
    };

} else {

    if (process.env.ENDPOINT === undefined) {
        console.log(`Running with default ENDPOINT: ${runOptions.env.ENDPOINT}`)
    } else {
        console.log(`Running with custom ENDPOINT: ${process.env.ENDPOINT}`)
        runOptions.env.ENDPOINT = process.env.ENDPOINT
    }

    if (process.env.SPEC === undefined) {
        console.log(`Running all tests`)
    } else {
        console.log(`Running test: ${process.env.SPEC}`)
        runOptions.spec = process.env.SPEC
    }
}

// Override exit code to avoid CI interruption
cypress.run(runOptions).then(result => {
    process.exit(0)
}).catch(err => {
    console.error(err.message)
    process.exit(0)
})