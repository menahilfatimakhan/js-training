// notes.js
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "notes.json");

async function loadNotes() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") return []; // file doesn't exist yet
    throw err;
  }
}

async function saveNotes(notes) {
  await fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2), "utf-8");
}

export async function addNote(title, body) {
  const notes = await loadNotes();
  const duplicate = notes.find(n => n.title === title);
  if (duplicate) {
    return { success: false, message: "Note title already exists." };
  }
  notes.push({ title, body, createdAt: new Date().toISOString() });
  await saveNotes(notes);
  return { success: true, message: "Note added." };
}

export async function listNotes() {
  const notes = await loadNotes();
  return notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function readNote(title) {
  const notes = await loadNotes();
  const note = notes.find(n => n.title === title);
  if (!note) return null;
  return note;
}

export async function removeNote(title) {
  const notes = await loadNotes();
  const filtered = notes.filter(n => n.title !== title);
  if (filtered.length === notes.length) {
    return { success: false, message: "Note not found." };
  }
  await saveNotes(filtered);
  return { success: true, message: "Note removed." };
}
