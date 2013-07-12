var normalize = require("./lib/normalize.js")

module.exports = optional

function optional(validator) {
    validator = normalize(validator)

    return function (value, key, parent, object) {
        if (value === null || value === undefined) {
            return
        }

        return validator(value, key, parent, object)
    }
}
