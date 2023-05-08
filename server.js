// require the dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const dataset = require("./db/db.json");
const randomId = require("random-id");

// setting up the port and express
const PORT = process.env.PORT || 3001;
const app = express();

// setting up the paths for the files the customers can interact with
app.use(express.static("public"));

// setting up json with express
app.use(express.json());

// route to homepage
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public")));

// path to the notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "notes.html"))
);

// get request for displaying the notes
app.get("/api/notes", (req, res) => res.json(dataset));

// post request to update the notes
app.post("/api/notes", (req, res) => {
  // get the request and add a random id
  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id: randomId(4, "aA0"),
  };

  // variable for the data that we will use
  let storedNotes;

  // retrieving the data from db.json
  fs.readFile(`./db/db.json`, "utf8", function (error, data) {
    // assigning storedNotes the db data as an array
    storedNotes = JSON.parse(data);
    // pushing the new note onto the variable
    storedNotes.push(newNote);

    // turning the array into a json string
    const noteString = JSON.stringify(storedNotes);
    // Write the string to a file
    fs.writeFile(`./db/db.json`, noteString, (err) =>
      err ? console.error(err) : console.log("Success")
    );
    res.json(dataset);
  });
});

// delete request to delete a note
app.delete("/api/notes/:id", (req, res) => {
  // get the id that for the note that is to be deleted
  const deleteId = req.params.id;
  // retrieveing the data from db.json
  fs.readFile(`./db/db.json`, "utf8", function (error, data) {
    // the json data as an array
    let storedNotes = JSON.parse(data);
    // the index of the note that is to be deleted
    let toDelete;
    for (let i = 0; i < storedNotes.length; i++) {
      const element = storedNotes[i].id;
      // if the element has the id to delete
      if (element == deleteId) {
        // get the index
        toDelete = i;
      }
    }
    // remove the item from the array
    storedNotes.splice(toDelete, 1);
    // turning the array into a json string
    const noteString = JSON.stringify(storedNotes);
    // Write the string to a file
    fs.writeFile(`./db/db.json`, noteString, (err) =>
      err ? console.error(err) : console.log("Success")
    );
    res.json(dataset);
  });
});

// wildcard if any url is requested that isn't a route
app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

// creating the server
app.listen(PORT, () => console.log("App listening at " + PORT));
