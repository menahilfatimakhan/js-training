import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();

// Allow the frontend dev server to talk to this API
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: false,
  })
);
app.use(express.json());

// ✅ Basic config (can be overridden via env vars)
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/authDB";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_please_change";
const JWT_EXPIRES_IN = "7d";

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err.message));

// ========================
//  Models
// ========================
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

// ========================
//  Auth Helpers & Middleware
// ========================

// Very simple in-memory blacklist to support logout token invalidation.
// NOTE: This resets whenever the server restarts (OK for this training app).
const tokenBlacklist = new Set();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ error: "Authorization token missing" });
  }

  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: "Token has been logged out" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.userId };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ========================
//  Auth Routes
// ========================

// ✅ Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed });

    // Auto-login on signup for smoother UX
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      message: "Signup successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(400).json({ error: err.message || "Signup failed" });
  }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// ✅ Logout Route – blacklists current token
app.post("/logout", authMiddleware, (req, res) => {
  const authHeader = req.headers.authorization || "";
  const [, token] = authHeader.split(" ");
  if (token) {
    tokenBlacklist.add(token);
  }
  res.json({ message: "Logged out successfully" });
});

// ========================
//  Task Routes (Protected)
// ========================

// Get all tasks for current user
app.get("/tasks", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(tasks);
});

// Create a task
app.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const { title, status } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = await Task.create({
      user: req.user.id,
      title,
      status: status === "done" ? "done" : "pending",
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to create task" });
  }
});

// Update a task
app.put("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;

    const task = await Task.findOne({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (title !== undefined) task.title = title;
    if (status !== undefined)
      task.status = status === "done" ? "done" : "pending";

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to update task" });
  }
});

// Delete a task
app.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to delete task" });
  }
});

// Simple health route
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Auth + Task API running → http://localhost:${PORT}`)
);