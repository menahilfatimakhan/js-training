console.log("--- Operators, Control Flow, Functions, Scope  ---");

// Operators
console.log("5 + 2 =", 5 + 2);
console.log("5 === '5':", 5 === "5");
console.log("true && false:", true && false);
console.log("Ternary 5>3 ? 'Yes'or'No':", 5 > 3 ? "Yes" : "No");

// Control Flow
let score = 85;
if (score >= 90) console.log("A");
else if (score >= 80) console.log("B"); 

switch ("apple") {
  case "apple": console.log("Fruit is apple"); break;
  default: console.log("Unknown");
}

// Functions
function greet(name) { return "Hi " + name; }
console.log(greet("Menahil"));

const add = function(a, b) { return a + b; };
console.log("add(2,3):", add(2,3));

const square = x => x*x;
console.log("square(4):", square(4));

// Scope & closure
let globalVar = "global";
function outer() {
  let outerVar = "outer";
  function inner() {
    console.log(globalVar); // global
    console.log(outerVar);  // outer
  }
  inner();
}
outer();
