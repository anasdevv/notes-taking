const express = require("express");
const notes = require("../data/notes");
const noteController = require("../controllers/noteController");
const Note = require("../models/noteModel");

const router = express.Router();

// GET all notes
router.get("/", noteController.getAllNotes);

// GET single note
router.get("/:id", noteController.getNote);

// POST a new note
router.post("/create", noteController.createNote);

// DELETE a note
router.delete("/:id", noteController.deleteNote);

// EDIT a note
router.patch("/:id", noteController.updateNote);

module.exports = router;
