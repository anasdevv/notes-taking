const Note = require("../models/noteModel");

const getNotes = (req, res) => {
  Note.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

const test = (req, res) => {};

module.exports = { getNotes };
