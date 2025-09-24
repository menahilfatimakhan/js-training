// practice-path.mjs
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("__filename:", __filename);
console.log("__dirname :", __dirname);

// join and resolve
const p1 = path.join(__dirname, "folder", "file.txt");
const p2 = path.resolve("some", "relative", "path.txt");

console.log("path.join:", p1);
console.log("path.resolve:", p2);

// basename and extname
console.log("basename of p1:", path.basename(p1));
console.log("extname of p1:", path.extname(p1));
