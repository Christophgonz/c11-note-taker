const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static("public"));

app.use(express.json());

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public")));
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "notes.html"))
);
app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

app.get("/api/notes", (req, res) => console.log("1"));
app.post("/api/notes", (req, res) => console.log("1"));
app.listen(PORT, () => console.log("App listening at " + PORT));
