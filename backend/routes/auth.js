const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Auth = require("../models/Auth")

const JWT_SECRET = process.env.JWT_SECRET || "padida_secret_key"

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" })

    const existing = await Auth.findOne({ email })
    if (existing)
      return res.status(409).json({ message: "Email already registered" })

    const hashed = await bcrypt.hash(password, 10)
    const user = await Auth.create({ email, password: hashed })

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "30d" })
    res.json({ token, isNewUser: true })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" })

    const user = await Auth.findOne({ email })
    if (!user)
      return res.status(404).json({ message: "No account found with this email" })

    const match = await bcrypt.compare(password, user.password)
    if (!match)
      return res.status(401).json({ message: "Incorrect password" })

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "30d" })
    res.json({
      token,
      userId:user._id,
      isNewUser: !user.isProfileComplete,
      isAvatarComplete: user.isAvatarComplete
    })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// VERIFY TOKEN (used on app open)
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ message: "No token" })

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await Auth.findById(decoded.userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    res.json({
      email: user.email,
      isNewUser: !user.isProfileComplete,
      isAvatarComplete: user.isAvatarComplete
    })
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" })
  }
})

// MARK PROFILE COMPLETE
router.post("/profile-complete", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    const decoded = jwt.verify(token, JWT_SECRET || "padida_secret_key")
    await Auth.findByIdAndUpdate(decoded.userId, { isProfileComplete: true })
    res.json({ success: true })
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" })
  }
})

// MARK AVATAR COMPLETE
router.post("/avatar-complete", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    const decoded = jwt.verify(token, JWT_SECRET || "padida_secret_key")
    await Auth.findByIdAndUpdate(decoded.userId, { isAvatarComplete: true, isProfileComplete: true})
    res.json({ success: true })
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" })
  }
})

module.exports = router