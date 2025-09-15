console.log("--- Objects, Arrays, Destructuring, Rest/Spread ---");

// Objects
const person = { name: "Menahil", age: 21 };
console.log("person.name:", person.name);
console.log("Object.keys:", Object.keys(person));

// Arrays
const nums = [1,2,3,4];
console.log("nums[0]:", nums[0]);
console.log("map *2:", nums.map(n => n * 2));
console.log("filter >2:", nums.filter(n => n > 2));

// Destructuring
const [first, second] = nums;
console.log("first:", first, "second:", second);

const { name, age } = person;
console.log("name:", name, "age:", age);

// Rest/Spread
const [x, ...others] = nums;
console.log("x:", x, "others:", others);

const nums2 = [...nums, 5, 6];
console.log("spread nums2:", nums2);

function sum(...values) {
  return values.reduce((a, b) => a + b, 0);
}
console.log("sum(1,2,3,4):", sum(1,2,3,4));
