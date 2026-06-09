const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  username: String,
  avatar: {
    color: String,
    hat: String,
    face: String,
  }
})

module.exports = mongoose.model("User", UserSchema)