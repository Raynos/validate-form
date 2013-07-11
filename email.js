var format = require("./lib/format")

var EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
var MESSAGE = "Expected %s to be a valid email address"

module.exports = isEmail

function isEmail(message) {
    message = message || MESSAGE

    return function validate(value, key) {
        if (!EMAIL_REGEX.test(value)) {
            return { message: format(message, key), type: "email" }
        }
    }
}
