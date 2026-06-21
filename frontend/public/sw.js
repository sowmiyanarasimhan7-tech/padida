// ── Generate AI message ──────────────────────────────────────────
async function generateMessage(taskName, tone, character, type, procrastinated = false) {
  try {
    const response = await fetch("http://localhost:5000/api/notify/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskName, tone, character, type, procrastinated })
    })
    const data = await response.json()
    return data.message || null
  } catch {
    return null
  }
}

// ── Fallbacks ────────────────────────────────────────────────────
function appreciationFallback(taskName, tone) {
  const messages = {
    friendly:  `Amazing! 🌟 So proud of you for starting ${taskName}!`,
    strict:    `Good. You started ${taskName}. Now finish it.`,
    sarcastic: `Oh wow, you actually started ${taskName}? We're all shocked. 😏`,
    motivated: `YESSS! 🔥 You're crushing it! ${taskName} doesn't stand a chance!`,
    genz:      `bestie you actually did it no cap 💀 ${taskName} is getting SLAYED rn!`,
  }
  return messages[tone] || messages.friendly
}

function snoozeFallback(taskName, tone) {
  const messages = {
    friendly:  `5 minutes are up! 😊 Time to get back to ${taskName}!`,
    strict:    `Time's up. No more delays. Do ${taskName} now.`,
    sarcastic: `5 minutes? More like 5 years knowing you. Go do ${taskName}. 🙄`,
    motivated: `YOUR 5 MINUTES ARE UP! 💪 Back to crushing ${taskName}!`,
    genz:      `bestie ur 5 mins are UP fr fr go back to ${taskName} no cap 💀`,
  }
  return messages[tone] || messages.friendly
}

// ── Notification click handler ───────────────────────────────────
self.addEventListener("notificationclick", function (event) {
  event.notification.close()
  const { name, tone, character } = event.notification.data || {}

  // ── YES I'M GOING ──────────────────────────────────────────────
  if (event.action === "going") {
    event.waitUntil(
      (async () => {
        const msg = await generateMessage(name, tone, character, "appreciation")
        const body = msg || appreciationFallback(name, tone)

        // Show appreciation + trust check
        await self.registration.showNotification(`🎉 ${body}`, {
          body: `Wait... are you REALLY starting or just saying that? 👀`,
          icon: "/icon.png",
          badge: "/icon.png",
          data: event.notification.data,
          actions: [
            { action: "yes_promise", title: "✅ Yes I'm really starting!" },
            { action: "sorry_lied",  title: "😬 Sorry I lied..." },
          ],
          requireInteraction: true,
        })
      })()
    )
  }

  // ── YES I'M REALLY STARTING ────────────────────────────────────
  if (event.action === "yes_promise") {
    event.waitUntil(
      self.registration.showNotification(`💪 That's what I like to hear!`, {
        body: `I believe you! Now go crush ${name}! 🚀`,
        icon: "/icon.png",
        requireInteraction: false,
      })
    )
  }

  // ── SORRY I LIED ──────────────────────────────────────────────
  if (event.action === "sorry_lied") {
    event.waitUntil(
      self.registration.showNotification(`😤 Okay you lied...`, {
        body: `Are you going to keep lying or actually start ${name}?`,
        icon: "/icon.png",
        badge: "/icon.png",
        data: event.notification.data,
        actions: [
          { action: "want_start",  title: "🙏 I want to start!" },
          { action: "keep_lying",  title: "😈 Keep lying lol" },
        ],
        requireInteraction: true,
      })
    )
  }

  // ── I WANT TO START ───────────────────────────────────────────
  if (event.action === "want_start") {
    event.waitUntil(
      self.registration.showNotification(`✅ Good!`, {
        body: `That's the spirit! Go start ${name} RIGHT NOW! 🔥`,
        icon: "/icon.png",
        requireInteraction: false,
      })
    )
  }

  // ── KEEP LYING ────────────────────────────────────────────────
  if (event.action === "keep_lying") {
    event.waitUntil(
      self.registration.showNotification(`🚫 Absolutely NOT!`, {
        body: `No no no! You CANNOT keep lying! Start ${name} RIGHT NOW! I'm watching you! 👁️`,
        icon: "/icon.png",
        requireInteraction: false,
      })
    )
  }

  // ── FINISHED ─────────────────────────────────────────────────
  if (event.action === "finished") {
    event.waitUntil(
      self.registration.showNotification(`🏆 Amazing work!`, {
        body: `You finished ${name}! You're an absolute legend! 🌟`,
        icon: "/icon.png",
        requireInteraction: false,
      })
    )
  }

  // ── NOT FINISHED ──────────────────────────────────────────────
  if (event.action === "not_finished") {
    event.waitUntil(
      self.registration.showNotification(`⏰ That's okay!`, {
        body: `No worries! Keep going on ${name}, you're almost there! 💪`,
        icon: "/icon.png",
        requireInteraction: false,
      })
    )
  }

  // ── SNOOZE ────────────────────────────────────────────────────
  if (event.action === "snooze") {
    event.waitUntil(
      (async () => {
        const clients = await self.clients.matchAll({
          type: "window",
          includeUncontrolled: true
        })

        console.log("SW: found clients:", clients.length)

        clients.forEach(client => {
          client.postMessage({
            type: "SNOOZE_TASK",
            taskName: name,
            snoozeMinutes: 5,
            timestamp: Date.now()
          })
        })

        const confirmMsg = await generateMessage(name, tone, character, "snooze_confirm")
        await self.registration.showNotification(`⏱ See you in 5!`, {
          body: confirmMsg || `I'll remind you in 5 minutes!`,
          icon: "/icon.png",
          requireInteraction: false,
        })

        await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000))

        const procrastinated = event.notification.data?.procrastinated || false
        const msg = await generateMessage(name, tone, character, "reminder", procrastinated)
        const body = msg || snoozeFallback(name, tone)

        await self.registration.showNotification(`⏰ ${name}`, {
          body,
          icon: "/icon.png",
          badge: "/icon.png",
          data: { ...event.notification.data, procrastinated: true },
          actions: [
            { action: "going",  title: "✅ Yes I'm going" },
            { action: "snooze", title: "⏱ 5 more minutes" },
          ],
          requireInteraction: true,
        })
      })()
    )
  }
})
// ── Push Notification Handler ────────────────────────────────────
self.addEventListener("push", event => {
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon.png",
      badge: "/icon.png",
      data: data.taskData || {},
      actions: [
        { action: "going",  title: "✅ Yes I'm going" },
        { action: "snooze", title: "⏱ 5 more minutes" },
      ],
      requireInteraction: true,
    })
  )
})