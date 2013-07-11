var format = require("./lib/format")

var MESSAGE = "Expected %s to be a %s"
// var types = [
//     [String, "string"],
//     [Boolean, "boolean"],
//     [Object, Type("object")],
//     [Number, Type("number")]
// ]

module.exports = type

function type(typeName, message) {
    message = message || MESSAGE

    return function validate(value, key) {
        if (typeName === Number && typeof value !== "number") {
            return { message: format(message, key, "number"), type: "type" }
        } else if (typeName === String && typeof value !== "string") {
            return { message: format(message, key, "string"), type: "type" }
        } else if (typeName === Boolean && typeof value !== "boolean") {
            return { message: format(message, key, "boolean"), type: "type" }
        } else if (typeName === Object &&
            (typeof value !== "object" || !value)
        ) {
            return { message: format(message, key, "object"), type: "type" }
        }
    }
}
