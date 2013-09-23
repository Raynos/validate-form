var normalize = require("./lib/normalize.js")

module.exports = validateIf

function validateIf(relatedKey, keyValidator, validator) {
    validator = normalize(validator)
    keyValidator = normalize(keyValidator)

    return function (value, key, parent, object) {
        var associated = parent[relatedKey]
        var validation = keyValidator(associated, relatedKey, parent, object)

        if (validation) {
            return
        }

        return validator(value, key, parent, object)
    }
}