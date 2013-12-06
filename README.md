# validate-form

[![build status][1]][2] [![NPM version][3]][4] [![Coverage Status][5]][6] [![David Dependency Status][9]][10]

[![browser support][11]][12]

Simple functional form validation

## Example

```js
var Validator = require("validate-form")
var truthy = require("validate-form/truthy")
var isEmail = require("validate-form/email")
var isCreditCard = require("validate-form/credit-card")
var range = require("validate-form/range")
var match = require("validate-form/match")
var memberOf = require("validate-form/member-of")
var list = require("validate-form/list")

var validDate = /^\d\d\d\d\/\d\d$/
var countries = ["US-en", "UK-en", "BR-pt", ...]
var validate = Validator({
  firstName: [truthy()],
  lastName: [truthy("Custom message: The %s field is required")],
  email: [truthy(), isEmail("Please ensure that you enter valid email")],
  cardNumber: [isCreditCard()],
  cvv: [range(3, 4)],
  expirationDate: [match(validDate)],
  country: [memberOf(countries, "enter valid country code")],
  interest: [list({
    min: 3,
    content: [truthy()]
  })]
})
```

## Creating your own validators

You can use custom functions as validators. A validator function takes the
  value to validate as an argument, the key for that value and the
  parent object that the value is on.

You can use the key to make more readable validation errors and you
  can use the parent to do validation logic across multiple properties

A validator should either return nothing or an error or an array of errors,
  an error in this case is `{ message: String, type: String }`. The type
  is useful if you want to show custom error messages in the UI, then you
  can ignore the message and use a custom error message for each type of
  validation error.

```js
var Validator = require("validate-form")

var validate = Validator({
  name: [function isValidName(value, key, parent) {
    var message = ""
    if (typeof value !== "string") {
      message = key + " should be a string"
    } else if (value.length < 4) {
      message = key + " should be at least 4 characters"
    }

    if (message) {
      return { message: message, type: "invalidName" }
    }
  }]
})
```

## Docs

```ocaml
type AlmostValidateError := {
    type: ValidateErrorType, message: String
}
type PossibleValidateError = Array<AlmostValidateError> |
    AlmostValidateError | null

type Validator := (value: Any, key: String, parent: Object) =>
    PossibleValidateError
type ValidateErrorType := "creditCard" | "email" | "length" |
  "match" | "max" | "memberOf" | "min" | "range" | "truthy" | "type"
type ValidateError := {
  attribute: String,
  message: String,
  type: ValidateErrorType
}

validate-form := (Object<String, Array<Validator>>) =>
    Array<ValidationError> | null

validate-form/add-error := (errors: Array<ValidationError>, key: String,
    maybeError: PossibleValidateError) => Array<ValidationError>
```

## Installation

`npm install validate-form`

## Contributors

 - Raynos

## MIT Licenced


  [1]: https://secure.travis-ci.org/Raynos/validate-form.png
  [2]: https://travis-ci.org/Raynos/validate-form
  [3]: https://badge.fury.io/js/validate-form.png
  [4]: https://badge.fury.io/js/validate-form
  [5]: https://coveralls.io/repos/Raynos/validate-form/badge.png
  [6]: https://coveralls.io/r/Raynos/validate-form
  [7]: https://gemnasium.com/Raynos/validate-form.png
  [8]: https://gemnasium.com/Raynos/validate-form
  [9]: https://david-dm.org/Raynos/validate-form.png
  [10]: https://david-dm.org/Raynos/validate-form
  [11]: https://ci.testling.com/Raynos/validate-form.png
  [12]: https://ci.testling.com/Raynos/validate-form
