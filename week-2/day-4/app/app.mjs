// app.mjs
import chalk from "chalk";
import { capitalize, reverse, countVowels } from "js-utils";

const samples = [
  "hello world",
  "nodejs",
  "javascript",
  "internship"
];

console.log(chalk.blue.bold("\n=== JS Utils Demo ===\n"));

samples.forEach((s) => {
  console.log(chalk.green("Original:"), s);
  console.log(chalk.yellow("Capitalize:"), capitalize(s));
  console.log(chalk.yellow("Reverse:"), reverse(s));
  console.log(chalk.yellow("Vowels:"), countVowels(s));
  console.log(); // blank line
});
