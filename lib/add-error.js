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

    errors.push(maybeError)
}
