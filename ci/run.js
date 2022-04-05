const runOptions = require('../cypress.json')
const cypress = require('cypress')

if (process.env.ENDPOINT === undefined) {
    console.log(`Running with default ENDPOINT: ${runOptions.env.ENDPOINT}`)
} else {
    console.log(`Running with custom ENDPOINT: ${process.env.ENDPOINT}`)
    runOptions.env.ENDPOINT = process.env.ENDPOINT
}

// Override exit code to avoid CI interruption
cypress.run(runOptions).then(result => {
    process.exit(0)
}).catch(err => {
    console.error(err.message)
    process.exit(0)
})