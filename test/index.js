var test = require("tape")

var Validator = require("../hash.js")
var truthy = require("../truthy.js")
var range = require("../range.js")
var isEmail = require("../email.js")
var isCreditCard = require("../credit-card.js")
var min = require("../min.js")
var max = require("../max.js")
var length = require("../length.js")
var match = require("../match.js")
var memberOf = require("../member-of.js")
var list = require("../list.js")

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
        message: "Expected key to be truthy",
        type: "truthy"
    }])
    assert.equal(errors2, null)
    assert.deepEqual(errors3, [{
        attribute: "key",
        message: "Expected key to be truthy",
        type: "truthy"
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
        message: "Expected key2 to be truthy",
        type: "truthy"
    }, {
        attribute: "key3",
        message: "Expected key3 to be truthy",
        type: "truthy"
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
        attribute: "key",
        type: "truthy"
    }, {
        message: "Expected key to be between 5 and 8 characters long",
        attribute: "key",
        type: "range"
    }])
    assert.deepEqual(errors2, [{
        message: "Expected key to be truthy",
        attribute: "key",
        type: "truthy"
    }, {
        message: "Expected key to be between 5 and 8 characters long",
        attribute: "key",
        type: "range"
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
        message: "Expected key to be truthy",
        type: "truthy"
    }])
    assert.equal(errors2, null)

    assert.end()
})

test("can use custom function", function (assert) {
    function beGood() {
        return function (value) {
            if (value !== "good") {
                return { message: "You got's to be good", type: "custom" }
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
        message: "You got's to be good",
        type: "custom"
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
        message: "Invalid range",
        type: "range"
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
        message: "Expected key1 to be truthy",
        type: "truthy"
    }, {
        attribute: "key2",
        message: "custom error for key2",
        type: "truthy"
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
    var errors3 = validate({
        key1: 6,
        key2: 9
    })

    assert.deepEqual(errors1, [{
        attribute: "key1",
        message: "Expected key1 to be between 5 and 8 characters long",
        type: "range"
    }, {
        attribute: "key2",
        message: "key2 Must be greater then 5 and less then 8",
        type: "range"
    }])
    assert.equal(errors2, null)
    assert.deepEqual(errors3, [{
        attribute: "key2",
        message: "key2 Must be greater then 5 and less then 8",
        type: "range"
    }])

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
        message: "Expected key1 to be a valid email address",
        type: "email"
    }, {
        attribute: "key2",
        message: "Invalid email in key2",
        type: "email"
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
        message: "Expected key1 to be a valid credit card",
        type: "creditCard"
    }, {
        attribute: "key2",
        message: "give us a real card yo.",
        type: "creditCard"
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
    var errors3 = validate({
        key1: 5,
        key2: 12
    })

    assert.deepEqual(errors1, [{
        attribute: "key1",
        message: "Expected key1 to be at least 10 characters long",
        type: "min"
    }, {
        attribute: "key2",
        message: "be at least 12",
        type: "min"
    }])
    assert.equal(errors2, null)
    assert.deepEqual(errors3, [{
        attribute: "key1",
        message: "Expected key1 to be at least 10",
        type: "min"
    }])

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
    var errors3 = validate({
        key1: 6,
        key2: 4
    })

    assert.deepEqual(errors1, [{
        attribute: "key1",
        message: "Expected key1 to be at most 5 characters long",
        type: "max"
    }, {
        attribute: "key2",
        message: "be at most 4",
        type: "max"
    }])
    assert.equal(errors2, null)
    assert.deepEqual(errors3, [{
        attribute: "key1",
        message: "Expected key1 to be at most 5",
        type: "max"
    }])

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
        message: "Expected key1 to be exactly 4 characters long",
        type: "length"
    }, {
        attribute: "key2",
        message: "got's to be the right length",
        type: "length"
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
        message: "Expected key1 to match /^\\d\\d\\d\\d\\/\\d\\d$/",
        type: "match"
    }, {
        attribute: "key2",
        message: "custom message",
        type: "match"
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
        message: "Expected key1 to be in set { 1, 2, 3 }",
        type: "memberOf"
    }, {
        attribute: "key2",
        message: "not in set!",
        type: "memberOf"
    }])
    assert.equal(errors2, null)

    assert.end()
})

test("list({ min, max, length, content }, message)", function (assert) {
    var validate = Validator({
        key1: [list({
            min: 5,
            max: 7,
            content: [truthy()]
        })],
        key2: [list({
            min: 4,
            max: 8
        })],
        key3: [list({
            length: 3,
            content: [memberOf(["1", "2", "3"], "not in set!")]
        }, "wrong list error thing")]
    })

    var errors1 = validate({
        key1: ["valid", "number of items", "but", "fail", "", "truthy"],
        key2: ["invalid", "number", "of items"],
        key3: ["valid", "amount", "but not match enum"]
    })
    var errors2 = validate({
        key1: ["1", "2", "3", "4", "5", "6"],
        key2: ["1", "2", "3", "4", "5"],
        key3: ["1", "2", "3"]
    })

    assert.deepEqual(errors1, [{
        attribute: "key1[4]",
        message: "Expected key1[4] to be truthy",
        type: "truthy"
    }, {
        attribute: "key2",
        message: "Expected key2 to contain at least 4 items",
        type: "min"
    }, {
        attribute: "key3[0]",
        message: "not in set!",
        type: "memberOf"
    }, {
        attribute: "key3[1]",
        message: "not in set!",
        type: "memberOf"
    }, {
        attribute: "key3[2]",
        message: "not in set!",
        type: "memberOf"
    }])
    assert.equal(errors2, null)

    assert.end()
})
