var ERROR_MESSAGE = "Invalid validator. Validators must be arrays or functions"
var addError = require("./add-error")

module.exports = normalize

function normalize(validator) {
    if (typeof validator === "function") {
        return validator
    } else if (Array.isArray(validator)) {
        return multi(validator.map(normalize))
    } else {
        throw new Error(ERROR_MESSAGE)
    }
}

function multi(validators) {
    return function (value, key, parent, object) {
        var errors = []

        validators.forEach(function runValidator(validator) {
            addError(errors, key, value,
                validator(value, key, parent, object))
        })

        return errors.length ? errors : null
    }
}
