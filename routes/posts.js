const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const POSTS_FILE = "./data/posts.json";

function readPosts() {
  if (!fs.existsSync(POSTS_FILE)) fs.writeFileSync(POSTS_FILE, "[]");
  return JSON.parse(fs.readFileSync(POSTS_FILE));
}

function writePosts(posts) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// Get all posts
router.get("/", (req, res) => {
  const posts = readPosts();
  res.json(posts);
});

// Admin middleware
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") return next();
  return res.status(403).send("Acesso negado.");
}

// Create post
router.post("/create", isAdmin, (req, res) => {
  const { title, content } = req.body;
  const posts = readPosts();
  posts.push({ id: uuidv4(), title, content, date: new Date() });
  writePosts(posts);
  res.send("Post criado com sucesso!");
});

// Delete post
router.delete("/delete/:id", isAdmin, (req, res) => {
  const posts = readPosts().filter(p => p.id !== req.params.id);
  writePosts(posts);
  res.send("Post removido!");
});

module.exports = router;
