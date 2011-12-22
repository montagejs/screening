/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var asserts = require("../../../server/lib/testcase/assert.js");

function buildTest(func, equalTo, values) {
    describe(func, function() {
        values.forEach(function(vals) {
            var valsIsArray = Object.prototype.toString.apply(vals) === '[object Array]';
            var funcString = func + "(" + JSON.stringify(vals) + ")";
            if (valsIsArray) {
                funcString = func + "(" + JSON.stringify(vals[0]) + ", " + JSON.stringify(vals[1]) + ")";
            }
            it("should " + (equalTo ? "PASS" : "FAIL") + " for: " + funcString, function() {
                if (valsIsArray) {
                    expect(asserts[func](vals[0], vals[1])).toEqual(equalTo)
                } else {
                    expect(asserts[func](vals)).toEqual(equalTo)
                }
            });
        });
    });
}

//
// assertTrue, assertFalse
//
var truthys = [true, 1, " ", "1", "jo", "null", "undefined", -1, 100, "200"];
var falsys = [false, 0, null, undefined, ""];
buildTest("assertTrue", true, truthys);
buildTest("assertTrue", false, falsys);
buildTest("assertFalse", true, falsys);
buildTest("assertFalse", false, truthys);

//
// assert(Not)Contains
//
var containsValues = [
    ["abc", "abc"],
    ["", "AAabcCC"],
    ["abc", "AAabcCC"],
    ["abc", " abc "],
    ["abc", "A lot of words start with 'abc'"],
    [1, "123"],
    [2, "123"],
    [3, "123"]
];
var notContainsValues = [
    ["abc", "aBc"],
    ["x", "AAabcCC"],
    ["abc", "AAacCC"],
    ["abc", "A lot of words start with 'xyz'"],
    [4, "123"],
    [234, "123"]
];
buildTest("assertContains", true, containsValues);
buildTest("assertContains", false, notContainsValues);
buildTest("assertNotContains", true, notContainsValues);
buildTest("assertNotContains", false, containsValues);

//
// assert(Not)Equal
//
var equalValues = [
    [123, 123],
    ["123", "123"],
    ["123", '123'],
    [1.1, 1.1],
    [Math.PI, Math.PI],
    [
        {obj:1},
        {"obj":1}
    ],
    [
        {obj:1, value:2},
        {"obj":1, value:2}
    ]
    //[{value:2, obj:1}, {"obj":1, value:2}] // TODO
];
var notEqualValues = [
    ["12", 123],
    ["123", "1234"],
    ["123", '12'],
    [1.1, 1.101],
    [Math.PI, Math.PI + 1],
    [
        {obj:1},
        {"obj":2}
    ],
    [
        {obj:1, value:0},
        {"obj":1, value:2}
    ]
];
buildTest("assertEqual", true, equalValues);
buildTest("assertEqual", false, notEqualValues);
buildTest("assertNotEqual", true, notEqualValues);
buildTest("assertNotEqual", false, equalValues);

//
// assertStartsWith
//
var startsWithValues = [
    [1, 12],
    [2, 2],
    ["a", "abc"],
    ["ABC", "ABC"],
    ["0.1", "0.1111"],
    [0.1, 0.11],
    [.1, 0.11]
]
var startsNotWithValues = [
    [0, 12],
    [1, 2],
    ["b", "abc"],
    ["BC", "ABC"],
    [".1", "0.1111"],
    [.01, 0.11]
]
buildTest("assertStartsWith", true, startsWithValues);
buildTest("assertStartsWith", false, startsNotWithValues);
buildTest("assertStartsNotWith", true, startsNotWithValues);
buildTest("assertStartsNotWith", false, startsWithValues);

//
// assertEndsWith
//
var endsWithValues = [
    [2, 12],
    [2, 2],
    ["c", "abc"],
    ["BC", "ABC"],
    ["111", "0.1111"],
    [0.11, 0.11],
    [.11, 0.11]
]
var endsNotWithValues = [
    [0, 12],
    [1, 2],
    ["b", "abc"],
    ["AB", "ABC"],
    [".1", "0.1111"],
    [.01, 0.11]
]
buildTest("assertEndsWith", true, endsWithValues);
buildTest("assertEndsWith", false, endsNotWithValues);
buildTest("assertEndsNotWith", true, endsNotWithValues);
buildTest("assertEndsNotWith", false, endsWithValues);

//
// assert(Not)Empty
//
buildTest("assertEmpty", true, falsys);
buildTest("assertEmpty", false, truthys);
buildTest("assertNotEmpty", true, truthys);
buildTest("assertNotEmpty", false, falsys);

//
// assert(Not)Greater
//
var greaterValues = [
    [1, 2],
    [2.00001, 2.0001],
    [1, 10000],
    [-0.1, 0.1],
    ["A", "B"],
    ["ab", "bc"],
    ["ABC", "XYZ"]
];
var notGreaterValues = [
    [1, 1],
    // they are equal, so definitely not greater!
    [2, 1],
    [10000, 1],
    [0.1, -0.1],
    ["B", "A"],
    ["bc", "ab"],
    ["XYZ", "ABC"],
    ["ABC", "ABC"]
    // equal is NOT greater!!!
];
buildTest("assertGreater", true, greaterValues);
buildTest("assertGreater", false, notGreaterValues);
buildTest("assertLessOrEqual", true, notGreaterValues);
buildTest("assertLessOrEqual", false, greaterValues);

//
// assert(Not)Less
//
var lessValues = [
    [2, 1],
    [2.0001, 2.00001],
    [10000, 1],
    [0.1, -0.1],
    ["B", "A"],
    ["bc", "ab"],
    ["XYZ", "ABC"]
];
var notLessValues = [
    [1, 1],
    // they are equal, not less!
    [1, 2],
    [1, 10000],
    [-0.1, 0.1],
    ["A", "B"],
    ["ab", "bc"],
    ["ABC", "XYZ"],
    ["ABC", "ABC"]
    // equal is NOT less!!!
];
buildTest("assertLess", true, lessValues);
buildTest("assertLess", false, notLessValues);
buildTest("assertGreaterOrEqual", true, notLessValues);
buildTest("assertGreaterOrEqual", false, lessValues);

//
// assert(Not)Between
//
var betweenValues = [
    [
        [0, 2],
        1
    ],
    [
        [0, 200],
        100
    ],
    [
        ["a", "c"],
        "b"
    ],
    [
        ["a", "z"],
        "m"
    ],
    [
        ["A", "z"],
        "M"
    ]
];
var notBetweenValues = [
    [
        [0, 2],
        3
    ],
    [
        [0, 200],
        300
    ],
    [
        ["a", "c"],
        "c"
    ],
    [
        ["a", "z"],
        "z"
    ],
    [
        ["a", "Z"],
        "a"
    ]
];
buildTest("assertBetween", true, betweenValues);
buildTest("assertBetween", false, notBetweenValues);
buildTest("assertNotBetween", true, notBetweenValues);
buildTest("assertNotBetween", false, betweenValues);

//
// assert(Not)Precision
//
var precisionValues = [
    [
        [1, 0.1],
        1
    ],
    [
        [100, 100],
        100
    ],
    [
        [0, .1],
        0.01
    ],
    [
        [0, .1],
        -0.01
    ]
];
var notPrecisionValues = [
    [
        [0, 2],
        -3
    ],
    [
        [100, 10],
        90
    ],
    [
        [100, 10],
        89
    ],
    [
        [100, 10],
        110
    ],
    [
        [100, 10],
        111
    ]
];
buildTest("assertPrecision", true, precisionValues);
buildTest("assertPrecision", false, notPrecisionValues);
buildTest("assertNotPrecision", true, notPrecisionValues);
buildTest("assertNotPrecision", false, precisionValues);


//
// space character tests
//
describe("various space characters in all asserts that compare strings", function() {
    var expected = "ABC  ";
    var actuals = ["ABC  ", "ABC\u00A0\u00A0", "ABC\u00A0 ", "ABC \u00A0"];
    // List all functions that can take strings to compare.
    var funcs = ["assertEqual", "assertContains", "assertStartsWith", "assertEndsWith"];
    it("should PASS the same for the two different kind of spaces - with char code 32 and 160", function() {
        for (var i = 0; i < funcs.length; i++) {
            for (var j = 0; j < actuals.length; j++) {
                expect(asserts[funcs[i]](expected, actuals[j])).toEqual(true);
            }
        }
    });
});
