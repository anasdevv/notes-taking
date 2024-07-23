const Note = require("../models/noteModel");
const mongoose = require("mongoose");
const logger = require("../logger");

const getAllNotes = async (req, res) => {
  const user_id = req.user._id;
  logger.info(`Fetching all notes for user ${user_id}`);

  try {
    const notes = await Note.find({ user_id }).sort({ createdAt: -1 });
    logger.info(`Fetched ${notes.length} notes for user ${user_id}`);
    res.status(200).json(notes);
  } catch (error) {
    logger.error(`Error fetching notes for user ${user_id}: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

const getNote = async (req, res) => {
  const { id } = req.params;
  logger.info(`Fetching note with id ${id}`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.warn(`Invalid note ID: ${id}`);
    return res.status(404).json({ error: "No such note" });
  }

  try {
    const note = await Note.findById(id);
    if (!note) {
      logger.warn(`Note not found with id ${id}`);
      return res.status(404).json({ error: "No such note" });
    }

    logger.info(`Fetched note with id ${id}`);
    res.status(200).json(note);
  } catch (error) {
    logger.error(`Error fetching note with id ${id}: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch note" });
  }
};

const createNote = async (req, res) => {
  const { title, content, category } = req.body;
  const user_id = req.user._id;

  logger.info(`User ${user_id} is creating a note`);

  try {
    const note = await Note.create({ title, content, category, user_id });
    logger.info(`Note created with ID: ${note._id}`);
    res.status(200).json(note);
  } catch (error) {
    logger.error(`Error creating note for user ${user_id}: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;
  logger.info(`Deleting note with id ${id}`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.warn(`Invalid note ID: ${id}`);
    return res.status(404).json({ error: "No such note" });
  }

  try {
    const note = await Note.findOneAndDelete({ _id: id });
    if (!note) {
      logger.warn(`Note not found with id ${id}`);
      return res.status(404).json({ error: "No such note" });
    }

    logger.info(`Deleted note with id ${id}`);
    res.status(200).json(note);
  } catch (error) {
    logger.error(`Error deleting note with id ${id}: ${error.message}`);
    res.status(500).json({ error: "Failed to delete note" });
  }
};

const updateNote = async (req, res) => {
  const { id } = req.params;
  logger.info(`Updating note with id ${id}`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.warn(`Invalid note ID: ${id}`);
    return res.status(404).json({ error: "No such note" });
  }

  try {
    const note = await Note.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      { new: true }
    );

    if (!note) {
      logger.warn(`Note not found with id ${id}`);
      return res.status(404).json({ error: "No such note" });
    }

    logger.info(`Updated note with id ${id}`);
    res.status(200).json(note);
  } catch (error) {
    logger.error(`Error updating note with id ${id}: ${error.message}`);
    res.status(500).json({ error: "Failed to update note" });
  }
};

module.exports = {
  getAllNotes,
  getNote,
  createNote,
  deleteNote,
  updateNote,
};
