module.exports = addError

function addError(errors, key, maybeError) {
    if (typeof maybeError === "string") {
        errors.push({
            message: maybeError,
            attribute: key
        })
    } else if (Array.isArray(maybeError)) {
        maybeError.forEach(function (message) {
            if (typeof message === "string") {
                errors.push({
                    message: message,
                    attribute: key
                })
            } else {
                errors.push(message)
            }
        })
    }
}
