const express = require("express");
const notes = require("../data/notes");
const noteController = require("../controllers/noteController");

const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("API is running");
// });

router.get("/", (req, res) => {
  res.json(notes);
});
//router.post("/create", (req, res) => {})

router.get("/:id", (req, res) => {
  const note = notes.find((n) => n._id === req.params.id);
  res.send(note);
});

//router.delete('/:id', (req, res) => {})

module.exports = router;
