var format = require("./lib/format.js")
var addError = require("./lib/add-error.js")
var normalize = require("./lib/normalize.js")

var NOT_OBJECT_MESSAGE = "Expected %s to be an object"

Validator.creditCard = require("./credit-card.js")
Validator.email = require("./email.js")
Validator.hash = Validator
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

function Validator(schema) {
    var keys = Object.keys(schema)

    keys.forEach(function (key) {
        schema[key] = normalize(schema[key])
    })

    return function validate(value, key, parent, object) {
        var errors = []

        if (typeof value !== "object" || value === null) {
            addError(errors, key, value, {
                message: format(NOT_OBJECT_MESSAGE, key),
                type: "hash"
            })
        } else {
            keys.forEach(function validateKey(childKey) {
                var childValue = value[childKey]
                var validator = schema[childKey]

                if (key) {
                    childKey = key + "." + childKey
                }

                addError(errors, childKey, childValue,
                    validator(childValue, childKey, value, object))
            })
        }

        return errors.length ? errors : null
    }
}
