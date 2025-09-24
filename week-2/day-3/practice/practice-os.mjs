// practice-os.mjs
import os from "os";

console.log("Platform:", os.platform());
console.log("OS Type:", os.type());
console.log("CPU cores:", os.cpus().length);
console.log("Free memory (MB):", Math.round(os.freemem() / 1024 / 1024));
console.log("Home directory:", os.homedir());
