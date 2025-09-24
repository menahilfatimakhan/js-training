// practice-fs.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const samplePath = path.join(__dirname, "sample.txt");

// 1) Write a file synchronously 
fs.writeFileSync(samplePath, "Hello Node\nThis is sample text.\nHello again!");

// 2) Read synchronously
const syncData = fs.readFileSync(samplePath, "utf-8");
console.log("Synchronous read:");
console.log(syncData);

// 3) Read asynchronously using promises (non-blocking)
const fsp = fs.promises;
(async () => {
  await fsp.writeFile(path.join(__dirname, "sample-async.txt"), "Async write example");
  const asyncData = await fsp.readFile(path.join(__dirname, "sample-async.txt"), "utf-8");
  console.log("\nAsynchronous read (fs.promises):");
  console.log(asyncData);
})();
