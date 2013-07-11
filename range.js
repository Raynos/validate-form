var format = require("./lib/format")

var MESSAGE = "Expected %s to be between %d and %d characters long"

module.exports = range

function range(n, m, message) {
    message = message || MESSAGE

    return function validate(value, key) {
        if (!value || value.length < n || value.length > m) {
            return { message: format(message, key, n, m), type: "range" }
        }
    }
}
