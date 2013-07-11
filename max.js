var format = require("./lib/format")

var MESSAGE = "Expected %s to be at most %d characters long"

module.exports = max

function max(m, message) {
    message = message || MESSAGE

    return function validate(value, key) {
        if (!value || value.length > m) {
            return { message: format(message, key, m), type: "max" }
        }
    }
}
