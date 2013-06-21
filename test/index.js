var test = require("tape")

var Validator = require("../index")
var truthy = require("../truthy")
var range = require("../range")
var isEmail = require("../email")
var isCreditCard = require("../credit-card")
var min = require("../min")
var max = require("../max")
var length = require("../length")
var match = require("../match")
var memberOf = require("../member-of")

test("Validator is a function", function (assert) {
    assert.equal(typeof Validator, "function")
    assert.end()
})

test("Validator can validate objects", function (assert) {
    var validate = Validator({
        key: [truthy()]
    })

    var errors1 = validate({ key: false })
    var errors2 = validate({ key: "foo" })
    var errors3 = validate({})

    assert.deepEqual(errors1, [{
        attribute: "key",
        message: "Expected key to be truthy"
    }])
    assert.equal(errors2, null)
    assert.deepEqual(errors3, [{
        attribute: "key",
        message: "Expected key to be truthy"
    }])

    assert.end()
})

test("Validator can validate multiple attributes", function (assert) {
    var validate = Validator({
        key1: [truthy()],
        key2: [truthy()],
        key3: [truthy()]
    })

    var errors1 = validate({ key1: 1, key2: 1, key3: 1 })
    var errors2 = validate({ key1: 1, key2: 0 })

    assert.equal(errors1, null)
    assert.deepEqual(errors2, [{
        attribute: "key2",
        message: "Expected key2 to be truthy"
    }, {
        attribute: "key3",
        message: "Expected key3 to be truthy"
    }])

    assert.end()
})

test("multiple validations per key", function (assert) {
    var validate = Validator({
        key: [truthy(), range(5, 8)]
    })

    var errors1 = validate({ key: "" })
    var errors2 = validate({})
    var errors3 = validate({ key: "hello" })

    assert.deepEqual(errors1, [{
        message: "Expected key to be truthy",
        attribute: "key"
    }, {
        message: "Expected key to be between 5 and 8 characters long",
        attribute: "key"
    }])
    assert.deepEqual(errors2, [{
        message: "Expected key to be truthy",
        attribute: "key"
    }, {
        message: "Expected key to be between 5 and 8 characters long",
        attribute: "key"
    }])
    assert.equal(errors3, null)

    assert.end()
})

test("using function instead of array in schema", function (assert) {
    var validate = Validator({
        key: truthy()
    })

    var errors1 = validate({})
    var errors2 = validate({ key: true })

    assert.deepEqual(errors1, [{
        attribute: "key",
        message: "Expected key to be truthy"
    }])
    assert.equal(errors2, null)

    assert.end()
})

test("can use custom function", function (assert) {
    function beGood() {
        return function (value) {
            if (value !== "good") {
                return "You got's to be good"
            }
        }
    }

    var validate = Validator({
        key: beGood()
    })

    var errors1 = validate({})
    var errors2 = validate({ key: "good" })

    assert.deepEqual(errors1, [{
        attribute: "key",
        message: "You got's to be good"
    }])
    assert.equal(errors2, null)

    assert.end()
})

test("message formatting is optional with placeholders", function (assert) {
    var validate = Validator({
        key: [range(5, 10, "Invalid range")]
    })

    var errors = validate({ key: "four" })

    assert.deepEqual(errors, [{
        attribute: "key",
        message: "Invalid range"
    }])

    assert.end()
})

test("truthy(message)", function (assert) {
    var validate = Validator({
        key1: [truthy()],
        key2: [truthy("custom error for %s")]
    })

    var errors1 = validate({})
    var errors2 = validate({
        key1: true,
        key2: true
    })

    assert.deepEqual(errors1, [{
        attribute: "key1",
        message: "Expected key1 to be truthy"
    }, {
        attribute: "key2",
        message: "custom error for key2"
    }])
    assert.equal(errors2, null)

    assert.end()
})

test("range(n, m, message)", function (assert) {
    var validate = Validator({
        key1: [range(5, 8)],
        key2: [range(5, 8, "%s Must be greater then %d and less then %d")]
    })

    var errors1 = validate({})
    var errors2 = validate({
        key1: "6 char",
        key2: "7 chars"
    })

    assert.deepEqual(errors1, [{
        attribute: "key1",
        message: "Expected key1 to be between 5 and 8 characters long"
    }, {
        attribute: "key2",
        message: "key2 Must be greater then 5 and less then 8"
    }])
    assert.equal(errors2, null)

    assert.end()
})

test("isEmail(message)", function (assert) {
    var validate = Validator({
        key1: [isEmail()],
        key2: [isEmail("Invalid email in %s")]
    })

    var errors1 = validate({
        key1: "hello@foo",
        key2: "fail@fail"
    })
    var errors2 = validate({
        key1: "example@example.com",
        key2: "example@example.com"
    })

    assert.deepEqual(errors1, [{
        attribute: "key1",
        message: "Expected key1 to be a valid email address"
    }, {
        attribute: "key2",
        message: "Invalid email in key2"
    }])
    assert.equal(errors2, null)

    assert.end()
})

test("isCreditCard(message)", function (assert) {
    var validate = Validator({
        key1: [isCreditCard()],
        key2: [isCreditCard("give us a real card yo.")]
    })

    var errors1 = validate({
        key1: "4112412",
        key2: "WRONG"
    })
    var errors2 = validate({
        key1: "378282246310005",
        key2: "4111111111111111"
    })

    assert.deepEqual(errors1, [{
        attribute: "key1",
        message: "Expected key1 to be a valid credit card"
    }, {
        attribute: "key2",
        message: "give us a real card yo."
    }])
    assert.equal(errors2, null)

    assert.end()
})

test("min(n, message)", function (assert) {
    var validate = Validator({
        key1: [min(10)],
        key2: [min(12, "be at least 12")]
    })

    var errors1 = validate({
        key1: "123456789",
        key2: "12345678901"
    })
    var errors2 = validate({
        key1: "1234567890",
        key2: "1234567890123"
    })

    assert.deepEqual(errors1, [{
        attribute: "key1",
        message: "Expected key1 to be at least 10 characters long"
    }, {
        attribute: "key2",
        message: "be at least 12"
    }])
    assert.equal(errors2, null)

    assert.end()
})

test("max(m, message)", function (assert) {
    var validate = Validator({
        key1: [max(5)],
        key2: [max(4, "be at most 4")]
    })

    var errors1 = validate({
        key1: "123456",
        key2: "1234567"
    })
    var errors2 = validate({
        key1: "12345",
        key2: "123"
    })

    assert.deepEqual(errors1, [{
        attribute: "key1",
        message: "Expected key1 to be at most 5 characters long"
    }, {
        attribute: "key2",
        message: "be at most 4"
    }])
    assert.equal(errors2, null)

    assert.end()
})

test("length(n, message)", function (assert) {
    var validate = Validator({
        key1: [length(4)],
        key2: [length(5, "got's to be the right length")]
    })

    var errors1 = validate({
        key1: "12",
        key2: "1234567"
    })
    var errors2 = validate({
        key1: "1234",
        key2: "12345"
    })

    assert.deepEqual(errors1, [{
        attribute: "key1",
        message: "Expected key1 to be at exactly 4 characters long"
    }, {
        attribute: "key2",
        message: "got's to be the right length"
    }])
    assert.equal(errors2, null)

    assert.end()
})

test("match(regex, message)", function (assert) {
    var validate = Validator({
        key1: [match(/^\d\d\d\d\/\d\d$/)],
        key2: [match(/^[a-z0-9]+$/, "custom message")]
    })

    var errors1 = validate({
        key1: "235/1253",
        key2: "foo15*@$*"
    })
    var errors2 = validate({
        key1: "2013/06",
        key2: "alphanum3r1c"
    })

    assert.deepEqual(errors1, [{
        attribute: "key1",
        message: "Expected key1 to match /^\\d\\d\\d\\d\\/\\d\\d$/"
    }, {
        attribute: "key2",
        message: "custom message"
    }])
    assert.equal(errors2, null)

    assert.end()
})

test("memberOf(whiteList, message)", function (assert) {
    var validate = Validator({
        key1: [memberOf(["1", "2", "3"])],
        key2: [memberOf(["true", "false"], "not in set!")]
    })

    var errors1 = validate({
        key1: "fail",
        key2: "success"
    })
    var errors2 = validate({
        key1: "2",
        key2: "true"
    })

    assert.deepEqual(errors1, [{
        attribute: "key1",
        message: "Expected key1 to be in set { 1, 2, 3 }"
    }, {
        attribute: "key2",
        message: "not in set!"
    }])
    assert.equal(errors2, null)

    assert.end()
})

// var errors = validate(body, {
//     "firstName": [truthy()],
//     "lastName": [truthy()],
//     "email": [truthy(), isEmail()],
//     "cardNumber": [truthy(), isCreditCardNumber()],
//     "cvv": [truthy(), range(3, 4)],
//     "expirationDate": [truthy(), match(/\d\d\d\d\/\d\d/)]
// })
