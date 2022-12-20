var express = require("express");
var router = express.Router();
const Note = require("../models/note");
const WithAuth = require("../middlewares/auth");
const { json } = require("express");

router.post("/", WithAuth, async (req, res) => {
  const { title, body } = req.body;
  try {
    const note = new Note({ title, body, user: req.user._id });
    note.save();
    res.status(200).json(note);
  } catch (error) {
    res.status(401).json({ error });
  }
});

router.get("/search", WithAuth, async (req, res) => {
  const { query } = req.query;
  try {
    let notes = await Note.find({ user: req.user._id }).find({
      $text: { $search: query },
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/:id", WithAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (isOwner(req.user, note)) res.status(200).json(note);
    else res.status(403).json({ error: "Permission denied. Check your id." });
  } catch (error) {
    res.status(401).json({ error: "Trouble on getting the note" });
  }
});

router.get("/", WithAuth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(401).json({ error: "Trouble on getting the notes" });
  }
});

router.put("/:id", WithAuth, async (req, res) => {
  const { title, body } = req.body;
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (isOwner(req.user, note)) {
      const newNote = await Note.findOneAndUpdate(
        id,
        {
          $set: { title: title, body: body },
        },
        {
          upsert: true,
          new: true,
        }
      );
      newNote.save();
      res.status(200).json(newNote);
    } else res.status(403).json({ error: "Permission denied." });
  } catch (error) {
    res.status(401).json({ error: "Can't update this note" });
  }
});

router.delete("/:id", WithAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (isOwner(req.user, note)) {
      await note.delete();
      res.status(204).json({ message: "Note successfully deleted." });
    } else res.status(403).json({ error: "Permission denied." });
  } catch (error) {
    res.status(500).json({ error: "Can't delete this note." });
  }
});

const isOwner = (user, note) => {
  if (JSON.stringify(user._id) === JSON.stringify(note.user._id)) return true;
  return false;
};

module.exports = router;
