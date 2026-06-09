const express = require("express")
const router = express.Router()
const Settings = require("../models/Settings")

// Get settings
router.get("/", async (req, res) => {
  try {
    const settings = await Settings.findOne()
    res.json(settings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update settings
router.put("/", async (req, res) => {
  try {
    await Settings.deleteMany()
    const settings = new Settings(req.body)
    await settings.save()
    res.json(settings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router