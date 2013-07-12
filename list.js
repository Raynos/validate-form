var addError = require("./lib/add-error")
var normalize = require("./lib/normalize")
var min = require("./min")
var max = require("./max")
var length = require("./length")

var LENGTH_MESSAGE = "Expected %s to contain exactly %d items"
var MIN_MESSAGE = "Expected %s to contain at least %d items"
var MAX_MESSAGE = "Expected %s to contain at most %d items"

module.exports = list

function list(options, message) {
    var minValidator, maxValidator, lengthValidator
    var contentValidator = options.content

    if (typeof options.min === "number") {
        minValidator = min(options.min, message || MIN_MESSAGE)
    }
    if (typeof options.max === "number") {
        maxValidator = max(options.max, message || MAX_MESSAGE)
    }
    if (typeof options.length === "number") {
        lengthValidator = length(options.length, message || LENGTH_MESSAGE)
    }

    if (contentValidator) {
        contentValidator = normalize(contentValidator)
    }

    return function validate(value, key, parent, object) {
        var errors = []
        if (minValidator) {
            addError(errors, key, minValidator(value, key, parent, object))
        }
        if (maxValidator) {
            addError(errors, key, maxValidator(value, key, parent, object))
        }
        if (lengthValidator) {
            addError(errors, key, lengthValidator(value, key, parent, object))
        }

        if (contentValidator) {
            value.forEach(function (childValue, index) {
                var childKey = "[" + index + "]"
                if (key) {
                    childKey = key + childKey
                }

                addError(errors, childKey,
                    contentValidator(childValue, childKey, value, object))
            })
        }

        return errors.length ? errors : null
    }
}
