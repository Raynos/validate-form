var addError = require("./lib/add-error")
var normalize = require("./lib/normalize")

module.exports = Validator

function Validator(schema) {
    var keys = Object.keys(schema)

    keys.forEach(function (key) {
        schema[key] = normalize(schema[key])
    })

    return function validate(value, key, parent, object) {
        var errors = []

        keys.forEach(function validateKey(childKey) {
            var childValue = value[childKey]
            var validator = schema[childKey]

            if (key) {
                childKey = key + "." + childKey
            }

            addError(errors, childKey,
                validator(childValue, childKey, value, object))
        })

        return errors.length ? errors : null
    }
}
