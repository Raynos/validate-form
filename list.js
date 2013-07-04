var addError = require("./add-error")
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

    if (contentValidator && !Array.isArray(contentValidator)) {
        contentValidator = [contentValidator]
    }

    return function validate(value, key, values) {
        var errors = []
        if (minValidator) {
            addError(errors, key, minValidator(value, key, values))
        }
        if (maxValidator) {
            addError(errors, key, maxValidator(value, key, values))
        }
        if (lengthValidator) {
            addError(errors, key, lengthValidator(value, key, values))
        }

        if (contentValidator) {
            value.forEach(function (childValue, index) {
                var childKey = "[" + index + "]"
                if (key) {
                    childKey = key + childKey
                }

                contentValidator.forEach(function runValidator(validator) {
                    addError(errors, childKey,
                        validator(childValue, childKey, value, values))
                })
            })
        }

        return errors.length ? errors : null
    }
}
