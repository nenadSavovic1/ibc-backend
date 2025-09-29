const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/notes", async (_req, res) => {
  const notes = await prisma.note.findMany({ orderBy: { id: "desc" } });
  res.json(notes);
});

app.post("/notes", async (req, res) => {
  const { text } = req.body || {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "text (string) is required" });
  }
  const note = await prisma.note.create({ data: { text } });
  res.status(201).json(note);
});

app.put("/notes/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { text } = req.body || {};
  if (!Number.isInteger(id)) return res.status(400).json({ error: "invalid id" });
  if (!text || typeof text !== "string") return res.status(400).json({ error: "text (string) is required" });

  try {
    const note = await prisma.note.update({ where: { id }, data: { text } });
    res.json(note);
  } catch {
    res.status(404).json({ error: "not found" });
  }
});

app.delete("/notes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "invalid id" });
  try {
    await prisma.note.delete({ where: { id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "not found" });
  }
});


// ---------- Users ----------
app.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { id: "desc" } });
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "invalid id" });
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: "not found" });
  res.json(user);
});

app.post("/users", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || typeof email !== "string") return res.status(400).json({ error: "email (string) is required" });
  try {
    const user = await prisma.user.create({ data: { email, passwordHash: password} });
    res.status(201).json(user);
  } catch (e) {
    if (e.code === "P2002") return res.status(409).json({ error: "email already exists" });
    res.status(500).json({ error: "failed to create user" });
  }
});

app.put("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { email, name } = req.body || {};
  if (!Number.isInteger(id)) return res.status(400).json({ error: "invalid id" });
  try {
    const user = await prisma.user.update({ where: { id }, data: { email, name } });
    res.json(user);
  } catch (e) {
    if (e.code === "P2002") return res.status(409).json({ error: "email already exists" });
    if (e.code === "P2025") return res.status(404).json({ error: "not found" });
    res.status(500).json({ error: "failed to update user" });
  }
});

app.delete("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "invalid id" });
  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).end();
  } catch (e) {
    if (e.code === "P2025") return res.status(404).json({ error: "not found" });
    res.status(500).json({ error: "failed to delete user" });
  }
});


const port = Number(process.env.PORT) || 3001;
app.listen(port, () => console.log(`API running at http://localhost:${port}`));
