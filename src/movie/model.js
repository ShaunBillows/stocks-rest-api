const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  actor: {
    type: String,
    default: "Not specified",
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;