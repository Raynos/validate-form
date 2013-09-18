module.exports = addError

function addError(errors, key, value, maybeError) {
    if (Array.isArray(maybeError)) {
        maybeError.forEach(function (maybeError) {
            addMaybeError(errors, key, value, maybeError)
        })
    } else if (!!maybeError) {
        addMaybeError(errors, key, value, maybeError)
    }

    return errors
}

function addMaybeError(errors, key, value, maybeError) {
    if (typeof maybeError === "string") {
        maybeError = { message: maybeError, type: "general" }
    }

    if (!maybeError.attribute) {
        maybeError.attribute = key
    }
    if (!("value" in maybeError)) {
        maybeError.value = value
    }

    if (!isError(maybeError)) {
        var error = new Error(maybeError.message)
        Object.defineProperty(error, "message", {
            value: maybeError.message,
            enumerable: true,
            writable: true,
            configurable: true
        })
        Object.defineProperty(error, "type", {
            value: maybeError.type,
            enumerable: true,
            writable: true,
            configurable: true
        })
        error.attribute = maybeError.attribute
        error.value = maybeError.value
        maybeError = error
    }

    errors.push(maybeError)
}

function isError(err) {
    return Object.prototype.toString.call(err) === "[object Error]"
}
