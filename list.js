var format = require("./lib/format.js")
var addError = require("./lib/add-error")
var normalize = require("./lib/normalize")
var min = require("./min")
var max = require("./max")
var size = require("./size")

var SIZE_MESSAGE = "Expected %s to contain exactly %d items"
var MIN_MESSAGE = "Expected %s to contain at least %d items"
var MAX_MESSAGE = "Expected %s to contain at most %d items"
var NOT_ARRAY_MESSAGE = "Expected %s to be an array"

module.exports = list

function list(options, message) {
    if (typeof options === "function" || Array.isArray(options)) {
        options = { content: options }
    }

    var minValidator, maxValidator, sizeValidator
    var contentValidator = options.content

    if (typeof options.min === "number") {
        minValidator = min(options.min, message || MIN_MESSAGE)
    }
    if (typeof options.max === "number") {
        maxValidator = max(options.max, message || MAX_MESSAGE)
    }
    if (typeof options.size === "number") {
        sizeValidator = size(options.size, message || SIZE_MESSAGE)
    }

    if (contentValidator) {
        contentValidator = normalize(contentValidator)
    }

    return function validate(value, key, parent, object) {
        var errors = []

        if (!Array.isArray(value)) {
            addError(errors, key, value, {
                message: format(NOT_ARRAY_MESSAGE, key),
                type: "list"
            })
        } else {
            if (minValidator) {
                addError(errors, key, value,
                    minValidator(value, key, parent, object))
            }
            if (maxValidator) {
                addError(errors, key, value,
                    maxValidator(value, key, parent, object))
            }
            if (sizeValidator) {
                addError(errors, key, value,
                    sizeValidator(value, key, parent, object))
            }

            if (contentValidator) {
                value.forEach(function (childValue, index) {
                    var childKey = "[" + index + "]"
                    if (key) {
                        childKey = key + childKey
                    }

                    addError(errors, childKey, childValue,
                        contentValidator(childValue, childKey, value, object))
                })
            }
        }

        return errors.length ? errors : null
    }
}
