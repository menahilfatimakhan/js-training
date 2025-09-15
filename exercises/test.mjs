import { myMap } from './map.mjs';
import { myFilter } from './filter.mjs';
import { myReduce } from './reduce.mjs';
import { sum, avg, median, squares, evens } from './maths.mjs';

console.log("=== Testing Implementations ===");

// Core implementations
console.log("myMap [1,2,3] *2:", myMap([1,2,3], x => x * 2));
console.log("myFilter evens [1,2,3,4]:", myFilter([1,2,3,4], x => x % 2 === 0));
console.log("myReduce sum [1,2,3,4]:", myReduce([1,2,3,4], (a, b) => a + b, 0));

// Maths module
console.log("--- Maths Module ---");
console.log("Sum [1,2,3,4]:", sum([1,2,3,4]));
console.log("Avg [1,2,3,4]:", avg([1,2,3,4]));
console.log("Median odd [3,1,2]:", median([3,1,2]));
console.log("Median even [4,1,2,3]:", median([4,1,2,3]));
console.log("Squares [1,2,3]:", squares([1,2,3]));
console.log("Evens [1,2,3,4,5,6]:", evens([1,2,3,4,5,6]));
