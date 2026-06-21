// const express = require("express")
// const mongoose = require("mongoose")
// const cors = require("cors")
// require("dotenv").config()

// const app = express()
// app.use(cors())
// app.use(express.json())
     

// // Routes
// app.use("/api/user", require("./routes/user"))
// app.use("/api/auth", require("./routes/auth"))
// app.use("/api/tasks", require("./routes/tasks"))
// app.use("/api/settings", require("./routes/settings"))
// app.use("/api/email", require("./routes/email"))
// app.use("/api/notify", require("./routes/notify"))

// // Connect MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   serverSelectionTimeoutMS: 5000,
//   family: 4
// })
//   .then(() => console.log("MongoDB connected!"))
//   .catch(err => console.log("MongoDB error:", err))
// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cron = require("node-cron")
const webpush = require("web-push")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/user", require("./routes/user"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/tasks", require("./routes/tasks"))
app.use("/api/settings", require("./routes/settings"))
app.use("/api/email", require("./routes/email"))
app.use("/api/notify", require("./routes/notify"))

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  family: 4
}).then(async () => {
  console.log("MongoDB connected!")

  const Task = require("./models/Task")
  const Subscription = require("./models/Subscription")
  const Settings = require("./models/Settings")

  webpush.setVapidDetails(
    "mailto:you@example.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )

  // ── Runs every minute ───────────────────────────────────
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date()
      const currentTime = now.toTimeString().slice(0, 5) // "HH:MM"
      const currentDay = now.toLocaleDateString("en-US", { weekday: "long" }) // "Monday"

      console.log(`Cron running at ${currentTime} on ${currentDay}`)

      // Find tasks matching current time and day
      const tasks = await Task.find({
        startTime: currentTime,
        selectedDays: currentDay,
        done: false
      })

      if (tasks.length === 0) return

      // Get tone and character from settings
      const settings = await Settings.findOne()
      const tone = settings?.notifStyle || "friendly"
      const character = settings?.character || "astronaut"

      // Get all subscriptions
      const subscriptions = await Subscription.find()
      if (subscriptions.length === 0) return

      for (const task of tasks) {
        for (const sub of subscriptions) {
          try {
            await webpush.sendNotification(
              sub.subscription,
              JSON.stringify({
                title: `⏰ ${task.name}`,
                body: `It's time to start ${task.name}!`,
                taskData: {
                  name: task.name,
                  tone,
                  character
                }
              })
            )
            console.log(`Push sent for task: ${task.name}`)
          } catch (err) {
            console.log("Push failed:", err.message)
          }
        }
      }
    } catch (err) {
      console.log("Cron error:", err.message)
    }
  })

}).catch(err => console.log("MongoDB error:", err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))