const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const USERS_FILE = "./data/users.json";

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]");
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Signup
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  if (users.find(u => u.username === username)) {
    return res.status(400).send("Usuário já existe!");
  }

  const hash = await bcrypt.hash(password, 10);
  const newUser = { id: uuidv4(), username, password: hash, role: "user" };
  users.push(newUser);
  writeUsers(users);

  res.send("Cadastro realizado com sucesso!");
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).send("Usuário não encontrado.");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).send("Senha incorreta.");

  req.session.user = { username: user.username, role: user.role };
  res.send("Login efetuado!");
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("Logout realizado!");
});

module.exports = router;
