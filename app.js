const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: "supersecret", resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
