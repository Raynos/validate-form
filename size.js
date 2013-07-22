var format = require("./lib/format")

var MESSAGE = "Expected %s to be exactly %d characters long"

module.exports = size

function size(n, message) {
    message = message || MESSAGE

    return function validate(value, key) {
        if (!value || value.length !== n) {
            return { message: format(message, key, n), type: "size" }
        }
    }
}
