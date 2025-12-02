// src/App.jsx
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

function TaskItem({ task }) {
  return (
    <li
      style={{
        backgroundColor: "white",
        margin: "10px 0",
        padding: "12px 20px",
        borderRadius: 8,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "left" }}>
        <div style={{ fontWeight: 700 }}>{task.title}</div>
        <div style={{ fontSize: 12, color: "#666" }}>
          ID: {task.id ?? task._id} {task.createdAt ? `• ${new Date(task.createdAt).toLocaleString()}` : ""}
        </div>
      </div>

      <div
        style={{
          padding: "6px 10px",
          borderRadius: 16,
          background: task.status === "done" ? "#daf5e1" : task.status === "in-progress" ? "#fff7cc" : "#f0f0f0",
          color: "#333",
          fontSize: 13,
          fontWeight: 600
        }}
      >
        {task.status}
      </div>
    </li>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/tasks`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Arial, sans-serif",
        backgroundColor: "#f6f8fa",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 900 }}>
        <header style={{ textAlign: "center", marginBottom: 20 }}>
          <h1 style={{ margin: 0, color: "#007bff" }}>📝 My Tasks</h1>
          <p style={{ marginTop: 6, color: "#666" }}>Simple task list — React + Express</p>
        </header>

        {loading && <p style={{ textAlign: "center" }}>Loading tasks…</p>}

        {error && (
          <div style={{ color: "crimson", marginBottom: 12, textAlign: "center" }}>
            Error: {error}
            <div style={{ fontSize: 13, color: "#666" }}>
              Make sure your Tasks API is running at {API}/tasks and CORS is enabled.
            </div>
          </div>
        )}

        {!loading && !error && tasks && tasks.length === 0 && <p style={{ textAlign: "center" }}>No tasks yet.</p>}

        {!loading && !error && tasks && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {tasks.map((t) => (
              <TaskItem key={t.id ?? t._id} task={t} />
            ))}
          </ul>
        )}

        {!loading && !error && !tasks && <p style={{ textAlign: "center" }}>No data loaded.</p>}
      </div>
    </div>
  );
}
