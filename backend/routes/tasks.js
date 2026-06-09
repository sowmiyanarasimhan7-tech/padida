const express = require("express")
const router = express.Router()
const Task = require("../models/Task")

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add task
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body)
    await task.save()
    res.json(task)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' })
    res.json(task)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id)
    res.json({ message: "Task deleted" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router