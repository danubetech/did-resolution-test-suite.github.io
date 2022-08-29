# DID Resolution API tests

Resources:

* W3C DID Resolution specification: https://w3c-ccg.github.io/did-resolution/
* GoDiddy Universal Resolver documentation: https://docs.godiddy.com/en/apis/universal-resolver

Endpoints:

* https://dev.uniresolver.io/1.0/identifiers/
* https://api.godiddy.com/0.1.0/universal-resolver/identifiers/
* https://resolver.svip.danubetech.com/1.0/identifiers/
* * https://api.dev.godiddy.com/0.1.0/universal-resolver/identifiers/

# Test Sets

**"normal DIDs"**:
* `did:sov:WRfXPg8dantKVubE3HX8pw`
* `did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx`
* `did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp`
* `did:web:did.actor:alice`
* `did:ion:EiClkZMDxPKqC9c-umQfTkR8vvZ9JPhl_xLDI9Nfk38w5w` (is partly broken, doesn't have a @context property)
* `did:ebsi:DfPaUdYwuzcqFoiMDSrUX8aQyZnr2SesH3vDVASYv8PE` (is broken but is used here: https://api.dev.godiddy.com/#operation/resolve)

**"deactivated DIDs"**:
* `did:kilt:4r6RdVMNes2eEobxyxH7aVsesUqR2X175sUAXJfo7dEWxHUS`

**"non-existent DIDs"**:
* `did:sov:0000000000000000000000`

**"invalid DIDs"**:
* `did:example_222`
* `did:example:`

**"DID URLs with fragments"**:
* `did:sov:WRfXPg8dantKVubE3HX8pw#key-1`
  *`did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH#z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH`

**"DID URLs with transformKeys"**:
* `did:ebsi:zwkqocXfSsfokNFcrSng8cM?transformKeys=jwks`
* `did:sov:WRfXPg8dantKVubE3HX8pw?transformKeys=JsonWebKey2020`

**"DID URLs with transformKeys and fragments"**:
* `did:sov:WRfXPg8dantKVubE3HX8pw?transformKeys=JsonWebKey2020#key-1`

**_(DIDs Mentioned in api.dev.godiddy.com)_**
* `did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx`
* `did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx#key-1`
* `did:ion:EiClkZMDxPKqC9c-umQfTkR8vvZ9JPhl_xLDI9Nfk38w5w`
* `did:ebsi:DfPaUdYwuzcqFoiMDSrUX8aQyZnr2SesH3vDVASYv8PE`
* `did:ebsi:DfPaUdYwuzcqFoiMDSrUX8aQyZnr2SesH3vDVASYv8PE#keys-1` (this one is broken? Returns 500, removed from fixtures)

**"DID URLs with services"**:
* `did:web:danubetech.com?service=github&relativeRef=did-method-dns`

**"DID URls with versionTime"**:
*`did:sov:DjxRxnL4gXsncbH8jM8ySM?versionTime=2018-12-15T23:20:28Z`

# Tests Scenarios

## Test Scenario 1: DID Resolution Result

For all **"normal DIDs"**:

**Input:**

`curl -v -X GET 'https://dev.uniresolver.io/1.0/identifiers/did:sov:WRfXPg8dantKVubE3HX8pw'`

**Tests:**

- MUST return HTTP code `200`
- MUST return HTTP header `Content-Type` that contains `application/ld+json` AND contains `profile="https://w3id.org/did-resolution"`
- MUST return JSON object
- JSON object MUST contain properties `didDocument`, `didResolutionMetadata`, `didDocumentMetadata`
- MUST have a scheme starting with `did:`

## Test Scenario 2: JSON-LD DID document

For all **"normal DIDs"**:

**Input:**

`curl -v -H "Accept: application/did+ld+json" -X GET 'https://dev.uniresolver.io/1.0/identifiers/did:sov:WRfXPg8dantKVubE3HX8pw'`

**Tests:**

- MUST return HTTP code `200`
- MUST return HTTP header `Content-Type` that contains `application/did+ld+json`
- MUST return JSON object
- JSON object MUST NOT contain property `didDocument`
- JSON object MUST contain property `@context`


## Test Scenario 2b*: CBOR DID document

For all **"normal DIDs"**:

**Input:**
`curl -v -H "Accept: application/did+cbor" -X GET 'https://dev.uniresolver.io/1.0/identifiers/did:sov:WRfXPg8dantKVubE3HX8pw'`

- MUST return HTTP code `200`
- MUST return CBOR object
- JSON object MUST NOT contain property `didDocument`
- JSON object MUST contain property `@context`


## Test Scenario 3: Representation not supported

For all **"normal DIDs"**:

**Input:**

`curl -v -H "Accept: image/png" -X GET 'https://dev.uniresolver.io/1.0/identifiers/did:sov:WRfXPg8dantKVubE3HX8pw'`

**Tests:**

- MUST return HTTP code `406`
- JSON object MUST contain property `dereferencingMetadata.error` = `"representationNotSupported"` (*?)

## Test Scenario 4: Deactivated

For all **"deactivated DIDs"**:

**Input:**

`curl -v -X GET 'https://dev.uniresolver.io/1.0/identifiers/did:sov:indicio:test:16vv8izCToK4svjYjvsp4r'`

**Tests:**

- MUST return HTTP code `410`
- MUST return HTTP header `Content-Type` that contains `application/ld+json` AND contains `profile="https://w3id.org/did-resolution"`
- MUST return JSON object
- JSON object MUST contain property `didDocumentMetadata.deactivated` = `true`

## Test Scenario 5: Not found

For all **"non-existent DIDs"**:

**Input:**

`curl -v -X GET 'https://dev.uniresolver.io/1.0/identifiers/did:sov:0000000000000000000000'`

**Tests:**

- MUST return HTTP code `404`
- MUST return HTTP header `Content-Type` that contains `application/ld+json;profile="https://w3id.org/did-resolution"`
- MUST return JSON object
- JSON object MUST contain property `didDocumentMetadata.error` = `"notFound"`

## Test Scenario 6A: Invalid DID

For all **"invalid DIDs"**:

**Input:**

`curl -v -X GET 'https://dev.uniresolver.io/1.0/identifiers/did:example_222'`

**Tests:**

- MUST return HTTP code `400`
- MUST return HTTP header `Content-Type` that contains `application/ld+json;profile="https://w3id.org/did-resolution"`
- MUST return JSON object
- JSON object MUST contain property `didResolutionMetadata.error` = `"invalidDid"`


## Test Scenario 6B: Method not supported DID

For all **"DIDs with unsupported did methods"**:

**Input:**

`curl -v -X GET 'https://dev.uniresolver.io/1.0/identifiers/did:xyz:example'`

**Tests:**

???????
- MUST return HTTP code `400`
- MUST return HTTP header `Content-Type` that contains `application/ld+json;profile="https://w3id.org/did-resolution"`
- MUST return JSON object
- JSON object MUST contain property `didResolutionMetadata.error` = `"methodNotSupported"`
???????

## Test Scenario 6C: Invalid verificationMethod.id entry

For all **"DIDs with invalid verificationMethod.id entries"**:

**Input:**

`curl -v -X GET 'https://dev.uniresolver.io/1.0/identifiers/did_to_be_defined'`

**Tests:**

???????
- MUST return HTTP code `400`
- MUST return HTTP header `Content-Type` that contains `application/ld+json;profile="https://w3id.org/did-resolution"`
- MUST return JSON object
- JSON object MUST contain property `didResolutionMetadata.error` = `"invalidDidUrl"`
???????

## Test Scenario 6D: Invalid verificationMethod.controller entry

For all **"DIDs with invalid verificationMethod.controller entries"**:

**Input:**

`curl -v -X GET 'https://dev.uniresolver.io/1.0/identifiers/did_to_be_defined'`

**Tests:**

???????
- MUST return HTTP code `400`
- MUST return HTTP header `Content-Type` that contains `application/ld+json;profile="https://w3id.org/did-resolution"`
- MUST return JSON object
- JSON object MUST contain property `didResolutionMetadata.error` = `"invalidDid"`
???????

## Test Scenario 6E: Invalid didDocument.id entry

For all **"DIDs with invalid didDocument.id entries"**:

**Input:**

`curl -v -X GET 'https://dev.uniresolver.io/1.0/identifiers/did_to_be_defined'`

**Tests:**

???????
- MUST return HTTP code `400`
- MUST return HTTP header `Content-Type` that contains `application/ld+json;profile="https://w3id.org/did-resolution"`
- MUST return JSON object
- JSON object MUST contain property `didResolutionMetadata.error` = `"invalidDid"`
???????


## Test Scenario 7: DID URLs with fragments

For all **"DID URLs with fragments"**:

**Input:**

`curl -v -H "Accept: application/did+ld+json" -X GET 'https://dev.uniresolver.io/1.0/identifiers/did%3Asov%3AWRfXPg8dantKVubE3HX8pw%23key-1'` <--- *(DID URL is percent-encoded!)*

**Tests:**

- MUST return HTTP code `200`
- MUST return HTTP header `Content-Type` with value `application/did+ld+json`
- MUST return JSON object
- JSON object MUST NOT contain property `didDocument`
- JSON object MUST contain property `id`, value of that property MUST be the input DID URL `did:sov:WRfXPg8dantKVubE3HX8pw#key-1`

## Test Scenario 8*: Service and relativeRef parameters

For all **"DIDs with Service and relativeRef parameters"**:

**Input:**

`curl -H "Accept: text/uri-list" -X GET "https://api.godiddy.com/0.1.0/universal-resolver/identifiers/did:web:danubetech.com?service=github&relativeRef=did-method-dns"`

**Tests:**

- MUST return HTTP code `303`
- MUST contain a Location header with value of the output service endpoint URL (?)

## Test Scenario 9*: DID URLs with transformKeys

For all **"DID URLs with transformKeys"**:

**Input:**

`curl -H "Accept: application/did+ld+json" -X GET "https://api.godiddy.com/0.1.0/universal-resolver/identifiers/did:sov:WRfXPg8dantKVubE3HX8pw?transformKeys=JsonWebKey2020"`

**Tests:**
_(Not defined in W3C specification)_

- MUST return HTTP code `200`
- MUST return JSON object
- MUST return property verificationMethod of type JsonWebKey2020
- MUST return property id with value `did:sov:WRfXPg8dantKVubE3HX8pw`
- MUST return property assertionMethod with value `did:sov:WRfXPg8dantKVubE3HX8pw#key-1`
- MUST return property authentication with value `did:sov:WRfXPg8dantKVubE3HX8pw#key-1`
- MUST return HTTP header Content-Type that contains `text/uri-list;charset=UTF-8`


## Test Scenario 10*: DID URLs with versionTime parameter

For all **"DIDs with versionTime parameter"**:

**Input:**

`curl -H "Accept: application/did+ld+json" -X GET 'https://api.godiddy.com/0.1.0/universal-resolver/identifiers/did:sov:DjxRxnL4gXsncbH8jM8ySM?versionTime=2018-12-10T02:22:49Z'`

**Tests:**
_(Not defined in W3C specification)_

- MUST return HTTP code `200`
- MUST return JSON object
- MUST return HTTP header `Content-Type` that contains `"application/did+ld+json;charset=utf-8"`
- JSON object MUST contain property `@context`
- JSON object MUST contain property `id`, value of that property MUST be the input DID URL `did:sov:DjxRxnL4gXsncbH8jM8ySM`
- MUST return property `timestamp`


## Test Scenario 11*: DID URLs with versionId parameter

For all **"DIDs with versionId parameter"**:

**Input:**

`curl -H "Accept: application/did+ld+json" -X GET 'https://api.godiddy.com/0.1.0/universal-resolver/identifiers/did:sov:DjxRxnL4gXsncbH8jM8ySM?versionId=105'`

**Tests:**
_(Not defined in W3C specification)_

- MUST return HTTP code `200`
- MUST return JSON object
- MUST return HTTP header `Content-Type` that contains `"application/did+ld+json;charset=utf-8"`
- JSON object MUST contain property `@context`
- JSON object MUST contain property `id`, value of that property MUST be the input DID URL `did:sov:DjxRxnL4gXsncbH8jM8ySM`



## Test Scenario 12a* Resolve a DID / dereference a DID URL on Godiddy with json header:

**Input for godiddy only:**

`curl -H "Accept: application/json" -X GET 'https://api.dev.godiddy.com/0.1.0/universal-resolver/did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx'`

- MUST return HTTP code `200`
- JSON object MUST contain property `id`, value of that property MUST be the input DID URL `did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx`
- MUST contain `content-type` property with value `application/did+json;charset=utf-8`
- JSON object MUST NOT contain property `authentication`, value of that property MUST be the input DID URL `did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx`
- JSON object MUST NOT contain property `assertionMethod`, value of that property MUST be the input DID URL `did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx#key-1`
- JSON object MUST NOT contain property `keyAgreement`, value of that property MUST be the input DID URL `did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx#key-agreement-1`



## Test Scenario 12b* Resolve a DID / dereference a DID URL on Godiddy with ld+json;profile header:

**Input for godiddy only:**

`curl -H "Accept: application/ld+json;profile="https://w3c-ccg.github.io/did-resolution/" -X GET 'https://api.dev.godiddy.com/0.1.0/universal-resolver/did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx'`

- MUST return HTTP code `200`
- MUST return HTTP header Content-Type that contains `application/ld+json;profile="https://w3id.org/did-resolution"`


## Test Scenario 13* Retrieve configuration properties:

**Input for godiddy only:**

`curl -X GET 'https://api.dev.godiddy.com/0.1.0/universal-resolver/properties'`

**Tests:**

- MUST return HTTP code `200`
- MUST return JSON object
- MUST return HTTP header Content-Type that contains "application/json;charset=utf-8"



## Test Scenario 14*: Retrieve supported DID methods


**Input for godiddy only:**

`curl -X GET 'https://api.dev.godiddy.com/0.1.0/universal-resolver/methods'`

**Tests:**

- MUST return HTTP code `200` (?)
- MUST return a JSON object
- MUST contain body of type `array`
- MUST return a list containing supported DID methods including: `btcr`,`sov`, `v1`, `key`, `web`,`ethr`,`jolo`,`elem`,`github`, `ion`,`gatc`, `ebsi`, `tz` and `pkh`


## Test Scenario 15*: Retrieve supported DID methods


**Input for godiddy only:**

`curl -X GET 'https://api.dev.godiddy.com/0.1.0/universal-resolver/testIdentifiers'`

**Tests:**

- MUST return HTTP code `200`
- MUST return a JSON object
