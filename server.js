const express = require("express");
const path = require("path");
const fs = require("fs");
const dataset = require("./db/db.json");
const randomId = require("random-id");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static("public"));

app.use(express.json());

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public")));
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "notes.html"))
);

app.get("/api/notes", (req, res) => res.json(dataset));
app.post("/api/notes", (req, res) => {
  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id: randomId(4, "aA0"),
  };

  let storedNotes;
  fs.readFile(`./db/db.json`, "utf8", function (error, data) {
    storedNotes = JSON.parse(data);
    storedNotes.push(newNote);
    const noteString = JSON.stringify(storedNotes);
    // Write the string to a file
    fs.writeFile(`./db/db.json`, noteString, (err) =>
      err ? console.error(err) : console.log("Success")
    );
    res.json(dataset);
  });
});
app.delete("/api/notes/:id", (req, res) => {
  const deleteId = req.params.id;
  fs.readFile(`./db/db.json`, "utf8", function (error, data) {
    let storedNotes = JSON.parse(data);
    let toDelete;
    let newNotes;
    for (let i = 0; i < storedNotes.length; i++) {
      const element = storedNotes[i].id;
      if (element == deleteId) {
        toDelete = i;
      }
    }
    storedNotes.splice(toDelete, 1);
    const noteString = JSON.stringify(storedNotes);
    // Write the string to a file
    fs.writeFile(`./db/db.json`, noteString, (err) =>
      err ? console.error(err) : console.log("Success")
    );
    res.json(dataset);
  });
});

app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);
app.listen(PORT, () => console.log("App listening at " + PORT));
