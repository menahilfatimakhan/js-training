// index.mjs — Week 3 Day 2: simple Users REST API (in-memory)
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies (Content-Type: application/json)
app.use(express.json());

/* --- In-memory "database" (for today's assignment) --- */
let users = [
  { id: 1, name: "Aisha", email: "aisha@example.com" },
  { id: 2, name: "Bilal", email: "bilal@example.com" }
];
let nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;

/* ===== Routes ===== */

// GET /users -> return all users (optionally filter by ?name=)
app.get("/users", (req, res) => {
  const { name } = req.query; // query params: /users?name=aisha
  if (name) {
    const filtered = users.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
    return res.json(filtered);
  }
  res.json(users);
});

// GET /users/:id -> return a single user by id
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid user id" });

  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// POST /users -> add a new user { name, email }
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  // Optional: simple email format check (very small)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const newUser = { id: nextId++, name, email };
  users.push(newUser);

  // 201 Created is the correct status for a successful POST that creates a resource
  res.status(201).json(newUser);
});

/* 404 handler for unknown routes */
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

/* Start server */
app.listen(PORT, () => {
  console.log(`Users API listening: http://localhost:${PORT}`);
});
