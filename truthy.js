var format = require("./lib/format")

var MESSAGE = "Expected %s to be truthy"

module.exports = truthy

function truthy(message) {
    message = message || MESSAGE

    return function validate(value, key) {
        if (!value) {
            return { message: format(message, key), type: "truthy" }
        }
    }
}
