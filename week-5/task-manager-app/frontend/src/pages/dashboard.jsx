import { useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState("pending");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingStatus, setEditingStatus] = useState("pending");

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setError("");
      try {
        const res = await apiClient.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        const message =
          err.response?.data?.error ||
          err.message ||
          "Failed to load tasks. Please try again.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const resetNewTaskForm = () => {
    setNewTitle("");
    setNewStatus("pending");
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSaving(true);
    setError("");
    try {
      const res = await apiClient.post("/tasks", {
        title: newTitle.trim(),
        status: newStatus,
      });
      setTasks((prev) => [res.data, ...prev]);
      resetNewTaskForm();
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to create task. Please try again.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditingTitle(task.title);
    setEditingStatus(task.status);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingStatus("pending");
  };

  const handleUpdateTask = async (taskId) => {
    if (!editingTitle.trim()) return;

    setSaving(true);
    setError("");
    try {
      const res = await apiClient.put(`/tasks/${taskId}`, {
        title: editingTitle.trim(),
        status: editingStatus,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data : t))
      );
      cancelEditing();
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to update task. Please try again.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setSaving(true);
    setError("");
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to delete task. Please try again.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>My Tasks</h1>
          <p>Stay on top of your work with a simple, focused task board.</p>
        </div>
      </div>

      {error && <div className="alert alert-error mb-16">{error}</div>}

      <section className="card new-task-card">
        <h2>Create a new task</h2>
        <form className="task-form" onSubmit={handleCreateTask}>
          <input
            type="text"
            className="form-input flex-1"
            placeholder="Task title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <select
            className="form-select"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
          <button
            type="submit"
            className="btn-primary"
            disabled={saving || !newTitle.trim()}
          >
            {saving ? "Saving..." : "Add Task"}
          </button>
        </form>
      </section>

      <section className="card">
        <div className="tasks-header">
          <h2>Task list</h2>
          <div className="filter-group">
            <button
              type="button"
              className={`chip ${filter === "all" ? "chip-active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              className={`chip ${filter === "pending" ? "chip-active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
            <button
              type="button"
              className={`chip ${filter === "done" ? "chip-active" : ""}`}
              onClick={() => setFilter("done")}
            >
              Done
            </button>
          </div>
        </div>

        {loading ? (
          <div className="fullscreen-center">
            <div className="spinner" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <p className="empty-state">
            No tasks in this view yet. Create one above to get started.
          </p>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((task) => (
              <li key={task._id} className="task-item">
                {editingId === task._id ? (
                  <div className="task-edit-row">
                    <input
                      className="form-input flex-1"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                    />
                    <select
                      className="form-select"
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="done">Done</option>
                    </select>
                    <button
                      type="button"
                      className="btn-primary btn-sm"
                      disabled={saving}
                      onClick={() => handleUpdateTask(task._id)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn-ghost btn-sm"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="task-main">
                      <span className="task-title">{task.title}</span>
                      <span
                        className={`status-pill status-${task.status || "pending"
                          }`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <div className="task-actions">
                      <button
                        type="button"
                        className="btn-ghost btn-sm"
                        onClick={() => startEditing(task)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-danger btn-sm"
                        disabled={saving}
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
