var format = require("./lib/format")

var MESSAGE = "Expected %s to be exactly %d characters long"

module.exports = length

function length(n, message) {
    message = message || MESSAGE

    return function validate(value, key) {
        if (!value || value.length !== n) {
            return format(message, key, n)
        }
    }
}
