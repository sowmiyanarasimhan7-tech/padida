// const express = require("express")
// const router = express.Router()

// router.post("/generate", async (req, res) => {
//   console.log("Notify route hit!", req.body)
//   const { taskName, tone, character, type, procrastinated } = req.body

//   const toneDescriptions = {
//     friendly:  "friendly, warm and encouraging",
//     strict:    "strict, no-nonsense and direct",
//     sarcastic: "sarcastic and witty but not mean",
//     motivated: "highly motivational and energetic",
//     genz:      "Gen Z style with slang like 'bestie', 'no cap', 'fr fr', 'slay'",
//   }

//   const prompt = type === "appreciation"
//     ? `One sentence only. Celebrate that someone just started "${taskName}". Tone: ${toneDescriptions[tone] || "friendly"}. Character: ${character}. No hashtags. Just the message.`
//     : type === "snooze_confirm"
//     ? `One sentence only. Tell user you'll remind them in 5 minutes for "${taskName}". Tone: ${toneDescriptions[tone] || "friendly"}. No hashtags. Just the message.`
//     : type === "halfway"
//     ? `One sentence only. Check if someone is halfway done with "${taskName}". Tone: ${toneDescriptions[tone] || "friendly"}. Character: ${character}. Encouraging but also checking on them. No hashtags. Just the message.`
//     : type === "finished_check"
//     ? `One sentence only. Ask if someone has finished "${taskName}". Tone: ${toneDescriptions[tone] || "friendly"}. Character: ${character}. No hashtags. Just the message.`
//     : procrastinated
//     ? `One sentence only. Remind someone who snoozed 5 mins ago about "${taskName}". Tone: ${toneDescriptions[tone] || "friendly"}. Mention they already delayed. No hashtags. Just the message.`
//     : `One sentence only. Remind user about "${taskName}". Tone: ${toneDescriptions[tone] || "friendly"}. Naturally mention ${character}. No hashtags. Just the message.`
//   try {
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: "llama-3.3-70b-versatile",
//         messages: [{ role: "user", content: prompt }],
//         max_tokens: 30
//       })
//     })

//     const data = await response.json()
//     console.log("Groq response:", JSON.stringify(data))
//     const message = data.choices?.[0]?.message?.content?.trim()
//     console.log("Extracted message:", message)
//     res.json({ message: message || null })
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })

// module.exports = router
const express = require("express")
const router = express.Router()
const webpush = require("web-push")
const Subscription = require("../models/Subscription")

// ─── VAPID Setup ───────────────────────────────────────────
webpush.setVapidDetails(
  "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

// ─── Your existing route (unchanged) ──────────────────────
router.post("/generate", async (req, res) => {
  console.log("Notify route hit!", req.body)
  const { taskName, tone, character, type, procrastinated } = req.body

  const toneDescriptions = {
    friendly:  "friendly, warm and encouraging",
    strict:    "strict, no-nonsense and direct",
    sarcastic: "sarcastic and witty but not mean",
    motivated: "highly motivational and energetic",
    genz:      "Gen Z style with slang like 'bestie', 'no cap', 'fr fr', 'slay'",
  }

  const prompt = type === "appreciation"
    ? `One sentence only. Celebrate that someone just started "${taskName}". Tone: ${toneDescriptions[tone] || "friendly"}. Character: ${character}. No hashtags. Just the message.`
    : type === "snooze_confirm"
    ? `One sentence only. Tell user you'll remind them in 5 minutes for "${taskName}". Tone: ${toneDescriptions[tone] || "friendly"}. No hashtags. Just the message.`
    : type === "halfway"
    ? `One sentence only. Check if someone is halfway done with "${taskName}". Tone: ${toneDescriptions[tone] || "friendly"}. Character: ${character}. Encouraging but also checking on them. No hashtags. Just the message.`
    : type === "finished_check"
    ? `One sentence only. Ask if someone has finished "${taskName}". Tone: ${toneDescriptions[tone] || "friendly"}. Character: ${character}. No hashtags. Just the message.`
    : procrastinated
    ? `One sentence only. Remind someone who snoozed 5 mins ago about "${taskName}". Tone: ${toneDescriptions[tone] || "friendly"}. Mention they already delayed. No hashtags. Just the message.`
    : `One sentence only. Remind user about "${taskName}". Tone: ${toneDescriptions[tone] || "friendly"}. Naturally mention ${character}. No hashtags. Just the message.`

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 30
      })
    })

    const data = await response.json()
    console.log("Groq response:", JSON.stringify(data))
    const message = data.choices?.[0]?.message?.content?.trim()
    console.log("Extracted message:", message)
    res.json({ message: message || null })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── New: Save push subscription ──────────────────────────
router.post("/subscribe", async (req, res) => {
  const { userId, subscription } = req.body
  if (!userId || !subscription) {
    return res.status(400).json({ error: "userId and subscription required" })
  }

  await Subscription.findOneAndUpdate(
    { userId },
    { subscription },
    { upsert: true, new: true }
  )
  res.json({ success: true })
})

// ─── New: Send push notification ──────────────────────────
router.post("/send", async (req, res) => {
  const { userId, title, body } = req.body
  const doc = await Subscription.findOne({ userId })
  if (!doc) return res.status(404).json({ error: "No subscription found" })

  try {
    await webpush.sendNotification(
      doc.subscription,
      JSON.stringify({ title, body })
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router