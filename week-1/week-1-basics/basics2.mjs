console.log("--- var, let, const ---");

// var is hoisted → initialized as undefined
console.log("varDemo before:", varDemo);
var varDemo = "I am var";
console.log("varDemo after:", varDemo);

// let → TDZ
try {
  console.log(letDemo);
} catch (e) {
  console.log("letDemo error:", e.message);
}
let letDemo = "I am let";
console.log("letDemo after:", letDemo);

// const → must initialize
const constArr = [1, 2];
constArr.push(3); // can mutate contents
console.log("constArr:", constArr);

// Block scoping
if (true) {
  var outerVar = "var inside block";
  let innerLet = "let inside block";
}
console.log("outerVar:", outerVar); // works
try {
  console.log(innerLet);
} catch (e) {
  console.log("innerLet error:", e.message); // error
}
