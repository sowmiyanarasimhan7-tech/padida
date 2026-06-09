const mongoose = require("mongoose")

const SettingsSchema = new mongoose.Schema({
  theme: { type: String, default: "space" },
  character: { type: String, default: "astronaut" },
  notifStyle: { type: String, default: "friendly" },
})

module.exports = mongoose.model("Settings", SettingsSchema) 