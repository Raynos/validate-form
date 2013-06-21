var format = require("./lib/format")

var MESSAGE = "Expected %s to match %s"

module.exports = match

function match(regex, message) {
    message = message || MESSAGE

    return function validate(value, key) {
        if (!regex.test(value)) {
            return format(message, key, String(regex))
        }
    }
}
