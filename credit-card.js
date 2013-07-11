var CreditCard = require("creditcard")
var format = require("./lib/format")

var MESSAGE = "Expected %s to be a valid credit card"

module.exports = isCreditCard

function isCreditCard(message) {
    message = message || MESSAGE

    return function validate(value, key) {
        if (!CreditCard.validate(value)) {
            return { message: format(message, key), type: "creditCard" }
        }
    }
}
