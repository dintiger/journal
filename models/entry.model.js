const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const entrySchema = new Schema({
  entryImage: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    required: true,
  },
  // to track creation of entry
  createdBy: {
    type: mongoose.ObjectId,
    ref: "User",
  },
  creator: {
    type: String,
  },
});

module.exports = mongoose.model("Entry", entrySchema);
