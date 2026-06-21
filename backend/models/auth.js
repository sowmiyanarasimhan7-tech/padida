const mongoose = require("mongoose")

const authSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isProfileComplete: { type: Boolean, default: false },
  isAvatarComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Auth", authSchema)