const express = require("express")
const router = express.Router()
const User = require("../models/User")

// Get user
router.get("/", async (req, res) => {
  try {
    const user = await User.findOne()
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Save user
router.post("/", async (req, res) => {
  try {
    await User.deleteMany()
    const user = new User(req.body)
    await user.save()
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router