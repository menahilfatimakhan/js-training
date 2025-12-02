// index.mjs — Task Manager API (Day 5)
import express from "express";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "tasks.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // parse JSON
// Simple logging middleware
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

// in-memory tasks
let tasks = [];
let nextId = 1;

// helpers
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
    nextId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    console.log("Loaded tasks:", tasks.length);
  } catch (err) {
    console.error("Error loading tasks:", err);
    tasks = [];
    nextId = 1;
  }
}

async function saveTasks() {
  const tmp = DATA_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(tasks, null, 2), "utf-8");
  await fs.rename(tmp, DATA_FILE);
}

// Validation helper
function validateTaskPayload(body) {
  const { title, status } = body;
  if (!title || typeof title !== "string") return "title is required (string)";
  if (status !== undefined) {
    const ok = ["todo", "in-progress", "done"].includes(String(status).toLowerCase());
    if (!ok) return "status must be one of: todo, in-progress, done";
  }
  return null;
}

/* ===== Routes ===== */

// POST /tasks -> create a new task { title, status? }
app.post("/tasks", async (req, res) => {
  const errMsg = validateTaskPayload(req.body);
  if (errMsg) return res.status(400).json({ error: errMsg });

  const task = {
    id: nextId++,
    title: req.body.title,
    status: (req.body.status || "todo").toLowerCase(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.push(task);
  try {
    await saveTasks();
    return res.status(201).json(task);
  } catch (err) {
    console.error("Save failed:", err);
    tasks = tasks.filter(t => t.id !== task.id);
    return res.status(500).json({ error: "Failed to save task" });
  }
});

// GET /tasks -> list all tasks, optional ?status=done
app.get("/tasks", (req, res) => {
  const { status } = req.query;
  if (status) {
    const filtered = tasks.filter(t => t.status === String(status).toLowerCase());
    return res.json(filtered);
  }
  res.json(tasks);
});

// GET /tasks/:id -> get single task
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const t = tasks.find(x => x.id === id);
  if (!t) return res.status(404).json({ error: "Task not found" });
  res.json(t);
});

// PUT /tasks/:id -> update task (title and/or status)
app.put("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const task = tasks.find(x => x.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  // validate payload (title optional here)
  if (req.body.title !== undefined && typeof req.body.title !== "string") {
    return res.status(400).json({ error: "title must be a string" });
  }
  if (req.body.status !== undefined) {
    const ok = ["todo", "in-progress", "done"].includes(String(req.body.status).toLowerCase());
    if (!ok) return res.status(400).json({ error: "status must be todo, in-progress, or done" });
    task.status = req.body.status.toLowerCase();
  }
  if (req.body.title !== undefined) task.title = req.body.title;
  task.updatedAt = new Date().toISOString();

  try {
    await saveTasks();
    res.json(task);
  } catch (err) {
    console.error("Save failed:", err);
    res.status(500).json({ error: "Failed to save task" });
  }
});

// DELETE /tasks/:id -> remove task
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
    console.error("Save failed:", err);
    res.status(500).json({ error: "Failed to save task" });
  }
});

/* 404 fallback */
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

/* Start */
(async () => {
  await loadTasks();
  app.listen(PORT, () => {
    console.log(`Task API running at http://localhost:${PORT}`);
  });
})();
