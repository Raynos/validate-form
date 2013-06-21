module.exports = Validator

function Validator(schema) {
    return function validate(values) {
        var keys = Object.keys(schema)
        var errors = []

        keys.forEach(function validateKey(key) {
            var value = values[key]
            var validators = schema[key]

            if (!Array.isArray(validators)) {
                validators = [validators]
            }

            validators.forEach(function runValidator(validator) {
                var result = validator(value, key, values)

                if (typeof result === "string") {
                    errors.push({
                        message: result,
                        attribute: key
                    })
                } else if (Array.isArray(result)) {
                    errors.concat(result.map(function (m) {
                        return {
                            message: m,
                            attribute: key
                        }
                    }))
                }
            })
        })

        return errors.length ? errors : null
    }
}
