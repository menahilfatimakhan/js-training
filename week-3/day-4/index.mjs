// index.mjs
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// make sure users.json is in the same folder as this file
const DATA_FILE = path.join(__dirname, "users.json");

console.log("DATA_FILE ->", DATA_FILE); // helpful debug line

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let users = [];
let nextId = 1;

async function loadUsers() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    users = JSON.parse(raw);
    nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    console.log("Users loaded from file:", users.length, "users");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("No existing users.json file — starting with empty users array.");
      users = [];
      nextId = 1;
    } else {
      console.error("Error reading users file:", err);
      // rethrow so server won't start with corrupt state
      throw err;
    }
  }
}

async function saveUsers() {
  // ensure directory exists (should be same folder, but this is safe)
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), "utf-8");
  console.log("Saved users to file.");
}

/* Routes */
app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email required" });

  const newUser = { id: nextId++, name, email };
  users.push(newUser);
  try {
    await saveUsers();
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Failed to save users:", err);
    res.status(500).json({ error: "Failed to save user" });
  }
});

/* 404 */
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

/* Start server after loading file */
(async () => {
  try {
    await loadUsers();
    app.listen(PORT, () => {
      console.log(`Users API running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start due to error:", err);
    process.exit(1);
  }
})();
