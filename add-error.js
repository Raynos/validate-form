module.exports = addError

function addError(errors, key, maybeError) {
    if (Array.isArray(maybeError)) {
        maybeError.forEach(function (maybeError) {
            addMaybeError(errors, key, maybeError)
        })
    } else if (!!maybeError) {
        addMaybeError(errors, key, maybeError)
    }

    return errors
}

function addMaybeError(errors, key, maybeError) {
    if (typeof maybeError === "string") {
        maybeError = { message: maybeError, type: "general" }
    }

    if (!maybeError.attribute) {
        maybeError.attribute = key
    }

    errors.push(maybeError)
}
