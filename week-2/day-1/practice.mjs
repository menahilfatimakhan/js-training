//normal function
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("Menahil"));

//arrow function
const greetArrow = (name) => `Hello, ${name}!`;

console.log(greetArrow("Menahil"));

//default parameters
function multiply(a, b = 2) {
  return a * b;
}

console.log(multiply(5));     
console.log(multiply(5, 3)); 

//forEach -> iteration
const numbers = [1, 2, 3];
numbers.forEach(num => console.log(num * 2));

//map -> new elements
const squares = numbers.map(num => num * num);
console.log(squares);

//filter
const evens = numbers.filter(num => num % 2 === 0);
console.log(evens);

//reduce
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum);

//object destructing
const student = { name: "Menahil", age: 21, cgpa: "3.83" };
const { name, grade } = student;

console.log(name);   
console.log(cgpa);  

//rest
function sumAll(...nums) {
  return nums.reduce((acc, num) => acc + num, 0);
}
console.log(sumAll(1, 2, 3, 4)); // 10


//spread
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];
console.log(arr2);




