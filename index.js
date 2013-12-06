var hash = require("./hash.js")

var Validator = function () {
    return hash.apply(this, arguments)
}

Validator.creditCard = require("./credit-card.js")
Validator.email = require("./email.js")
Validator.hash = hash
Validator.list = require("./list.js")
Validator.match = require("./match.js")
Validator.max = require("./max.js")
Validator.memberOf = require("./member-of.js")
Validator.min = require("./min.js")
Validator.optional = require("./optional.js")
Validator.range = require("./range.js")
Validator.size = require("./size.js")
Validator.truthy = require("./truthy.js")
Validator.type = require("./type.js")

module.exports = Validator
