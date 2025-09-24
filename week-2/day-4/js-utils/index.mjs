// index.mjs - js-utils
export function capitalize(str = "") {
  if (typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function reverse(str = "") {
  if (typeof str !== "string") return "";
  return str.split("").reverse().join("");
}

export function countVowels(str = "") {
  if (typeof str !== "string") return 0;
  const matches = str.toLowerCase().match(/[aeiou]/g);
  return matches ? matches.length : 0;
}

// Optional default export (object)
export default { capitalize, reverse, countVowels };
