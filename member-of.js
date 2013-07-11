var format = require("./lib/format")

var MESSAGE = "Expected %s to be in set { %s }"

module.exports = memberOf

function memberOf(set, message) {
    message = message || MESSAGE

    return function validate(value, key) {
        if (set.indexOf(value) === -1) {
            return {
                message: format(message, key, set.join(", ")),
                type: "memberOf"
            }
        }
    }
}
