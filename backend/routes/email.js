const express = require("express")
const router = express.Router()
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  }
})

// Send email
router.post("/send", async (req, res) => {
  const { to, taskName, startTime, endTime, message } = req.body

  try {
    console.log("before sending mail");
    await transporter.sendMail({
      from: `"Padida App" <${process.env.GMAIL_USER}>`,
      to,
      subject: `📌 Task Reminder: ${taskName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #0a1a0a; color: white; border-radius: 12px;">
          <h2 style="color: plum;">⏰ ${taskName}</h2>
          <p>🕐 Time: ${startTime} → ${endTime}</p>
          <p>${message || "Don't forget your task!"}</p>
          <p style="color: plum; font-weight: bold; letter-spacing: 2px;">PADIDA</p>
        </div>
      `
    });
    console.log("maail sent successfully");
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router