console.log("--- Values & Types ---");

// Primitive types
console.log(typeof 42);          // number
console.log(typeof "Hello");     // string
console.log(typeof true);        // boolean
console.log(typeof undefined);   // undefined
console.log(typeof null);        // object (quirk)
console.log(typeof Symbol("x")); // symbol
console.log(typeof 123n);        // bigint

// NaN comparison
console.log("NaN === NaN:", NaN === NaN);            // false
console.log("Object.is(NaN, NaN):", Object.is(NaN, NaN)); // true

// Value vs reference with primitives
let text1 = "Hello";
let text2 = text1;
text2 += " World";
console.log("text1:", text1); // Hello
console.log("text2:", text2); // Hello World

// Value vs reference with objects
let box1 = { val: 1 };
let box2 = box1;
box2.val = 42;
console.log("box1:", box1); // { val: 42 }
console.log("box2:", box2); // { val: 42 }
