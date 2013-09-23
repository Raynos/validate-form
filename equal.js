var format = require("./lib/format")

var MESSAGE = "Expected %s to be equal to %s"

module.exports = equal

function equal(equalKey, message) {
    message = message || MESSAGE

    return function (value, key, parent, object) {
        var second = parent[equalKey]

        if (value === second) {
            return
        }

        return {
            "type": "equal",
            "message": format(message, key, equalKey)
        }
    }

}