const mongoose = require("mongoose");

let NoteSchema = new mongoose.Schema({
  title: String,
  body: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

NoteSchema.index({ title: "text", body: "text" });

module.exports = mongoose.model("Note", NoteSchema);
