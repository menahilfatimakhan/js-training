// assignment.mjs
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT = path.join(__dirname, "input.txt");
const OUTPUT = path.join(__dirname, "output.json");

// Helper: normalize text -> lowercase + replace punctuation with spaces
function normalizeText(text) {
  // Use Unicode-aware regex if supported; fallback simple regex if not
  try {
    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ") // keep letters & numbers, replace others with space
      .trim();
  } catch (e) {
    // older engines: fallback (basic ASCII)
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, " ")
      .trim();
  }
}

async function countWordsFromFile() {
  try {
    const raw = await fs.readFile(INPUT, "utf-8");
    const normalized = normalizeText(raw);
    if (!normalized) {
      console.log("No words found in input file.");
      await fs.writeFile(OUTPUT, JSON.stringify({}, null, 2));
      return;
    }

    const words = normalized.split(/\s+/);
    const counts = Object.create(null);
    for (const w of words) {
      counts[w] = (counts[w] || 0) + 1;
    }

    // write JSON output
    await fs.writeFile(OUTPUT, JSON.stringify(counts, null, 2), "utf-8");
    console.log(`Word counts written to: ${OUTPUT}`);

    // print top 10 words
    const top = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    console.log("\nTop words:");
    top.forEach(([word, c], i) => {
      console.log(`${i + 1}. ${word} — ${c}`);
    });
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error("Input file not found. Create 'input.txt' in the assignment folder and try again.");
    } else {
      console.error("Error:", err);
    }
  }
}

// run
countWordsFromFile();
