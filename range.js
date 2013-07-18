var format = require("./lib/format")

var LIST_MESSAGE = "Expected %s to be between %d and %d characters long"
var NUMBER_MESSAGE = "Expected %s to between %d and %d"

module.exports = range

function range(n, m, message) {
    var listMessage = message || LIST_MESSAGE
    var numberMessage = message || NUMBER_MESSAGE

    return function validate(value, key) {
        if (typeof value === "number") {
            if (value < n || value > m || isNaN(value)) {
                return {
                    message: format(numberMessage, key, n, m),
                    type: "range"
                }
            }
        } else if (!value || value.length < n || value.length > m) {
            return { message: format(listMessage, key, n, m), type: "range" }
        }
    }
}
