const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({
  name: String,
  startTime: String,
  endTime: String,
  selectedDays: [String],
  priority: String,
  streak: { type: Number, default: 0 },
  done: { type: Boolean, default: false },
  emails:[String],
})

module.exports = mongoose.model("Task", TaskSchema)