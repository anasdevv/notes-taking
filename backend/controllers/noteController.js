const Note = require("../models/noteModel");
const mongoose = require("mongoose");

const getAllNotes = async (req, res) => {
  const user_id = req.user._id;
  const notes = await Note.find({ user_id }).sort({ createdAt: -1 });
  res.status(200).json(notes);
};

const getNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such note" });
  }

  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).json({ error: "No such note" });
  }

  res.status(200).json(note);
};

const createNote = async (req, res) => {
  const { title, content, category } = req.body;

  try {
    const user_id = req.user._id;
    const note = await Note.create({ title, content, category, user_id });
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such note" });
  }

  const note = await Note.findOneAndDelete({ _id: id });

  if (!note) {
    return res.status(404).json({ error: "No such note" });
  }

  res.status(200).json(note);
};

const updateNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such note" });
  }

  const note = await Note.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!note) {
    return res.status(404).json({ error: "No such note" });
  }

  res.status(200).json(note);
};
module.exports = {
  getAllNotes,
  getNote,
  createNote,
  deleteNote,
  updateNote,
};
