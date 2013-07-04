var addError = require("./add-error")

module.exports = Validator

function Validator(schema) {
    var keys = Object.keys(schema)

    keys.forEach(function (key) {
        var validators = schema[key]

        if (!Array.isArray(validators)) {
            schema[key] = [validators]
        }
    })

    return function validate(value, key, values) {
        var errors = []

        keys.forEach(function validateKey(childKey) {
            var childValue = value[childKey]
            var validators = schema[childKey]

            if (key) {
                childKey = key + "." + childKey
            }

            validators.forEach(function runValidator(validator) {
                addError(errors, childKey,
                    validator(childValue, childKey, value, values))
            })
        })

        return errors.length ? errors : null
    }
}
