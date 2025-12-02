import express from "express";

const app = express();
const PORT = 3000;

// Middleware: JSON parser
app.use(express.json());

// Middleware: Logging every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Example routes
app.get("/", (req, res) => {
  res.send("Welcome to Day 3!");
});

app.get("/error", (req, res) => {
  throw new Error("Manual crash!");
});

// 404 Middleware
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error-handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
