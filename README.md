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

## Installation

`npm install validate-form`

## Contributors

 - Raynos

## MIT Licenced


  [1]: https://secure.travis-ci.org/Colingo/validate-form.png
  [2]: https://travis-ci.org/Colingo/validate-form
  [3]: https://badge.fury.io/js/validate-form.png
  [4]: https://badge.fury.io/js/validate-form
  [5]: https://coveralls.io/repos/Colingo/validate-form/badge.png
  [6]: https://coveralls.io/r/Colingo/validate-form
  [7]: https://gemnasium.com/Colingo/validate-form.png
  [8]: https://gemnasium.com/Colingo/validate-form
  [9]: https://david-dm.org/Colingo/validate-form.png
  [10]: https://david-dm.org/Colingo/validate-form
  [11]: https://ci.testling.com/Colingo/validate-form.png
  [12]: https://ci.testling.com/Colingo/validate-form
