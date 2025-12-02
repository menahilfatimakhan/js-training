// index.mjs
import express from "express";
import mongoose from "mongoose";
import { User } from "./user.mjs";

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test";


async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: "week4DB" });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connect error:", err.message);
    process.exit(1);
  }
}
await connectDB();

/* ---------- Routes ---------- */

// POST /users -> create a new user
app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }
    const user = new User({ name, email, password });
    await user.save();
    // hide password in response
    const obj = user.toObject();
    delete obj.password;
    res.status(201).json(obj);
  } catch (err) {
    // duplicate email error handling
    if (err.code === 11000) return res.status(400).json({ error: "Email already exists" });
    res.status(500).json({ error: err.message });
  }
});

// GET /users -> get all users
app.get("/users", async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

// GET /users/:id -> get single user
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Invalid user id" });
  }
});

// PUT /users/:id -> update user fields (name, email, password)
app.put("/users/:id", async (req, res) => {
  try {
    const updates = (({ name, email, password }) => ({ name, email, password }))(req.body);
    // remove undefined fields
    Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k]);

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ error: err.message });
    res.status(400).json({ error: "Invalid user id or data" });
  }
});

// DELETE /users/:id -> delete user
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted", user });
  } catch (err) {
    res.status(400).json({ error: "Invalid user id" });
  }
});

/* 404 */
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
