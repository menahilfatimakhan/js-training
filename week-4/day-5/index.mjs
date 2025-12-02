// index.mjs — Task Manager API (rebuild)
import express from "express";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "tasks.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // allow frontend dev to fetch
app.use(express.json());

// simple request logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

let tasks = [];
let nextId = 1;

async function ensureDir() {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
}

async function loadTasks() {
  try {
    await ensureDir();
    if (!fsSync.existsSync(DATA_FILE)) {
      tasks = [];
      nextId = 1;
      console.log("No tasks.json — starting fresh");
      return;
    }
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    tasks = JSON.parse(raw);
    nextId = tasks.length ? Math.max(...tasks.map(t => Number(t.id) || 0)) + 1 : 1;
    console.log("Loaded tasks:", tasks.length);
  } catch (err) {
    console.error("Error loading tasks:", err);
    tasks = [];
    nextId = 1;
  }
}

async function saveTasks() {
  try {
    await ensureDir();
    const tmp = DATA_FILE + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(tasks, null, 2), "utf-8");
    await fs.rename(tmp, DATA_FILE);
    console.log("Saved tasks to file.");
  } catch (err) {
    console.error("Failed to save tasks:", err);
    throw err;
  }
}

/* Routes */

// Create task
app.post("/tasks", async (req, res) => {
  const { title, status } = req.body;
  if (!title || typeof title !== "string") return res.status(400).json({ error: "title is required (string)" });

  const task = {
    id: nextId++,
    title,
    status: (status || "todo").toLowerCase(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.push(task);
  try {
    await saveTasks();
    res.status(201).json(task);
  } catch (err) {
    tasks = tasks.filter(t => t.id !== task.id);
    nextId = Math.max(1, ...tasks.map(t => t.id)) + 1;
    res.status(500).json({ error: "Failed to save task" });
  }
});

// List tasks, optional ?status=
app.get("/tasks", (req, res) => {
  const { status } = req.query;
  if (status) {
    return res.json(tasks.filter(t => t.status === String(status).toLowerCase()));
  }
  res.json(tasks);
});

// Get single task
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const t = tasks.find(x => x.id === id);
  if (!t) return res.status(404).json({ error: "Task not found" });
  res.json(t);
});

// Update task
app.put("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const idx = tasks.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });

  const { title, status } = req.body;
  if (title !== undefined) {
    if (typeof title !== "string") return res.status(400).json({ error: "title must be a string" });
    tasks[idx].title = title;
  }
  if (status !== undefined) {
    tasks[idx].status = String(status).toLowerCase();
  }
  tasks[idx].updatedAt = new Date().toISOString();

  try {
    await saveTasks();
    res.json(tasks[idx]);
  } catch (err) {
    res.status(500).json({ error: "Failed to save task" });
  }
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const index = tasks.findIndex(x => x.id === id);
  if (index === -1) return res.status(404).json({ error: "Task not found" });

  const removed = tasks.splice(index, 1)[0];
  try {
    await saveTasks();
    res.json({ success: true, removed });
  } catch (err) {
    // rollback
    tasks.splice(index, 0, removed);
    res.status(500).json({ error: "Failed to save task" });
  }
});

app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// Start
(async () => {
  await loadTasks();
  app.listen(PORT, () => console.log(`Task API running at http://localhost:${PORT}`));
})();
