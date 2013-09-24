var test = require("tape")

var Validator = require("../hash.js")
var truthy = require("../truthy.js")
var type = require("../type.js")
var range = require("../range.js")
var isEmail = require("../email.js")
var isCreditCard = require("../credit-card.js")
var min = require("../min.js")
var max = require("../max.js")
var size = require("../size.js")
var match = require("../match.js")
var memberOf = require("../member-of.js")
var list = require("../list.js")
var optional = require("../optional.js")
var validateIf = require("../validate-if.js")
var equal = require("../equal.js")

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
        type: "truthy",
        value: false
    }])
    assert.equal(errors2, null)
    assert.deepEqual(errors3, [{
        attribute: "key",
        message: "Expected key to be truthy",
        type: "truthy",
        value: undefined
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
        type: "truthy",
        value: 0
    }, {
        attribute: "key3",
        message: "Expected key3 to be truthy",
        type: "truthy",
        value: undefined
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
        type: "truthy",
        value: ""
    }, {
        message: "Expected key to be between 5 and 8 characters long",
        attribute: "key",
        type: "range",
        value: ""
    }])
    assert.deepEqual(errors2, [{
        message: "Expected key to be truthy",
        attribute: "key",
        type: "truthy",
        value: undefined
    }, {
        message: "Expected key to be between 5 and 8 characters long",
        attribute: "key",
        type: "range",
        value: undefined
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
        type: "truthy",
        value: undefined
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
        type: "custom",
        value: undefined
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
        type: "range",
        value: "four"
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
        type: "truthy",
        value: undefined
    }, {
        attribute: "key2",
        message: "custom error for key2",
        type: "truthy",
        value: undefined
    }])
    assert.equal(errors2, null)

    assert.end()
})

test("type(type, message)", function (assert) {
    var validate = Validator({
        bool: type(Boolean),
        str: type(String),
        obj: type(Object),
        num: type(Number)
    })

    var errors1 = validate({
        bool: "",
        str: {},
        obj: 0,
        num: true
    })
    var errors2 = validate({
        bool: true,
        str: "",
        obj: {},
        num: 0
    })

    assert.deepEqual(errors1, [{
        message: "Expected bool to be a boolean",
        attribute: "bool",
        type: "type",
        value: ""
    }, {
        message: "Expected str to be a string",
        attribute: "str",
        type: "type",
        value: {}
    }, {
        message: "Expected obj to be a object",
        attribute: "obj",
        type: "type",
        value: 0
    }, {
        message: "Expected num to be a number",
        attribute: "num",
        type: "type",
        value: true
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
    var errors4 = validate({
        key1: 6,
        key2: NaN
    })

    assert.deepEqual(errors1, [{
        attribute: "key1",
        message: "Expected key1 to be between 5 and 8 characters long",
        type: "range",
        value: undefined
    }, {
        attribute: "key2",
        message: "key2 Must be greater then 5 and less then 8",
        type: "range",
        value: undefined
    }])
    assert.equal(errors2, null)
    assert.deepEqual(errors3, [{
        attribute: "key2",
        message: "key2 Must be greater then 5 and less then 8",
        type: "range",
        value: 9
    }])
    assert.equal(errors4[0].attribute, "key2")
    assert.equal(errors4[0].message,
        "key2 Must be greater then 5 and less then 8")
    assert.equal(errors4[0].type, "range")
    assert.ok(isNaN(errors4[0].value))

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
        type: "email",
        value: "hello@foo"
    }, {
        attribute: "key2",
        message: "Invalid email in key2",
        type: "email",
        value: "fail@fail"
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
        type: "creditCard",
        value: "4112412"
    }, {
        attribute: "key2",
        message: "give us a real card yo.",
        type: "creditCard",
        value: "WRONG"
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
        type: "min",
        value: "123456789"
    }, {
        attribute: "key2",
        message: "be at least 12",
        type: "min",
        value: "12345678901"
    }])
    assert.equal(errors2, null)
    assert.deepEqual(errors3, [{
        attribute: "key1",
        message: "Expected key1 to be at least 10",
        type: "min",
        value: 5
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
        type: "max",
        value: "123456"
    }, {
        attribute: "key2",
        message: "be at most 4",
        type: "max",
        value: "1234567"
    }])
    assert.equal(errors2, null)
    assert.deepEqual(errors3, [{
        attribute: "key1",
        message: "Expected key1 to be at most 5",
        type: "max",
        value: 6
    }])

    assert.end()
})

test("size(n, message)", function (assert) {
    var validate = Validator({
        key1: [size(4)],
        key2: [size(5, "got's to be the right size")]
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
        type: "size",
        value: "12"
    }, {
        attribute: "key2",
        message: "got's to be the right size",
        type: "size",
        value: "1234567"
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
        type: "match",
        value: "235/1253"
    }, {
        attribute: "key2",
        message: "custom message",
        type: "match",
        value: "foo15*@$*"
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
        type: "memberOf",
        value: "fail"
    }, {
        attribute: "key2",
        message: "not in set!",
        type: "memberOf",
        value: "success"
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
        }, "wrong list error thing")],
        key4: [list([truthy()])],
        key5: [list(truthy())]
    })

    var errors1 = validate({
        key1: ["valid", "number of items", "but", "fail", "", "truthy"],
        key2: ["invalid", "number", "of items"],
        key3: ["valid", "amount", "but not match enum"],
        key4: ["something"],
        key5: ["something"]
    })
    var errors2 = validate({
        key1: ["1", "2", "3", "4", "5", "6"],
        key2: ["1", "2", "3", "4", "5"],
        key3: ["1", "2", "3"],
        key4: ["something"],
        key5: ["something"]
    })

    assert.deepEqual(errors1, [{
        attribute: "key1[4]",
        message: "Expected key1[4] to be truthy",
        type: "truthy",
        value: ""
    }, {
        attribute: "key2",
        message: "Expected key2 to contain at least 4 items",
        type: "min",
        value: ["invalid", "number", "of items"]
    }, {
        attribute: "key3[0]",
        message: "not in set!",
        type: "memberOf",
        value: "valid"
    }, {
        attribute: "key3[1]",
        message: "not in set!",
        type: "memberOf",
        value: "amount"
    }, {
        attribute: "key3[2]",
        message: "not in set!",
        type: "memberOf",
        value: "but not match enum"
    }])
    assert.equal(errors2, null)

    assert.end()
})

test("optional(validator)", function (assert) {
    var validate = Validator({
        key1: optional(truthy()),
        key2: optional([range(0, 5)]),
        key3: optional([truthy()])
    })

    var errors1 = validate({
        key1: false,
        key2: -5,
        key3: 0
    })
    var errors2 = validate({
        key1: null,
        key2: undefined,
        key3: true
    })

    assert.deepEqual(errors1, [{
        message: "Expected key1 to be truthy",
        type: "truthy",
        attribute: "key1",
        value: false
    }, {
        message: "Expected key2 to between 0 and 5",
        type: "range",
        attribute: "key2",
        value: -5
    }, {
        message: "Expected key3 to be truthy",
        type: "truthy",
        attribute: "key3",
        value: 0
    }])
    assert.equal(errors2, null)

    assert.end()
})

test("validateIf(key, test, validator)", function (assert) {
    var validate = Validator({
        option: type(Boolean),
        key1: validateIf("option", truthy(), optional(truthy())),
        key2: validateIf("option", [truthy()], optional([range(0, 5)])),
        key3: validateIf("option", truthy(), optional([truthy()]))
    })

    var errors1 = validate({
        option: true,
        key1: false,
        key2: -5,
        key3: 0
    })
    var errors2 = validate({
        option: true,
        key1: null,
        key2: undefined,
        key3: true
    })
    var errors3 = validate({
        option: false,
        key1: false,
        key2: -5,
        key3: 0
    })
    var errors4 = validate({
        option: false,
        key1: null,
        key2: undefined,
        key3: true
    })

    assert.deepEqual(errors1, [{
        message: "Expected key1 to be truthy",
        type: "truthy",
        attribute: "key1",
        value: false
    }, {
        message: "Expected key2 to between 0 and 5",
        type: "range",
        attribute: "key2",
        value: -5
    }, {
        message: "Expected key3 to be truthy",
        type: "truthy",
        attribute: "key3",
        value: 0
    }])
    assert.equal(errors2, null)
    assert.equal(errors3, null)
    assert.equal(errors4, null)

    assert.end()
})


test("equal(key, message)", function (assert) {
    var validate = Validator({
        key1: [equal("key2")]
    })

    var error1 = validate({
        key1: "Beep",
        key2: "Boop"
    })
    var error2 = validate({
        key1: true,
        key2: false
    })
    var error3 = validate({
        key1: 13,
        key2: 19
    })
    var error4 = validate({
        key1: "Boop",
        key2: "Boop"
    })
    var error5 = validate({
        key1: false,
        key2: false
    })
    var error6 = validate({
        key1: 19,
        key2: 19
    })


    assert.deepEqual(error1, [{
        attribute: "key1",
        message: "Expected key1 to be equal to key2",
        type: "equal",
        value: "Beep"
    }])
    assert.deepEqual(error2, [{
        attribute: "key1",
        message: "Expected key1 to be equal to key2",
        type: "equal",
        value: true
    }])
    assert.deepEqual(error3, [{
        attribute: "key1",
        message: "Expected key1 to be equal to key2",
        type: "equal",
        value: 13
    }])
    assert.equal(error4, null)
    assert.equal(error5, null)
    assert.equal(error6, null)

    assert.end()
})