var format = require("./lib/format")

var LIST_MESSAGE = "Expected %s to be at most %d characters long"
var NUMBER_MESSAGE = "Expected %s to be at most %d"

module.exports = max

function max(m, message) {
    var listMessage = message || LIST_MESSAGE
    var numberMessage = message || NUMBER_MESSAGE

    return function validate(value, key) {
        if (typeof value === "number") {
            if (value > m || isNaN(value)) {
                return {
                    message: format(numberMessage, key, m),
                    type: "max"
                }
            }
        } else if (!value || value.length > m) {
            return { message: format(listMessage, key, m), type: "max" }
        }
    }
}
