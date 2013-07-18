var format = require("./lib/format")

var LIST_MESSAGE = "Expected %s to be at least %d characters long"
var NUMBER_MESSAGE = "Expected %s to be at least %d"

module.exports = min

function min(n, message) {
    var listMessage = message || LIST_MESSAGE
    var numberMessage = message || NUMBER_MESSAGE

    return function validate(value, key) {
        if (typeof value === "number") {
            if (value < n || isNaN(value)) {
                return {
                    message: format(numberMessage, key, n),
                    type: "min"
                }
            }
        } else if (!value || value.length < n) {
            return { message: format(listMessage, key, n), type: "min" }
        }
    }
}
