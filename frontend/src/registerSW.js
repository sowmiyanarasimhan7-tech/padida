// const activeTimeouts = new Map()

// export function registerSW() {
//   if ("serviceWorker" in navigator) {
//     navigator.serviceWorker
//       .register("/sw.js")
//       .then((reg) => {
//         console.log("SW registered", reg)
//       })
//       .catch((err) => {
//         console.log("SW failed", err)
//       })
//   }
// }

// function detectCategory(taskName) {
//   const name = taskName.toLowerCase()

//   if (/study|read|exam|test|learn|revision|notes|homework|assignment|dbms|math|physics|chemistry|biology|history|english|coding|algorithm/.test(name))
//     return "study"

//   if (/drink|water|eat|meal|sleep|rest|exercise|walk|run|gym|meditate|yoga|health|medicine|tablet|vitamin/.test(name))
//     return "health"

//   if (/submit|meeting|project|deadline|presentation|report|client|email|office|work|task|sprint|review|deploy/.test(name))
//     return "work"

//   if (/call|text|message|visit|friend|family|birthday|party|plan|hangout/.test(name))
//     return "social"

//   return "general"
// }

// async function generateNotificationMessage(taskName, tone, category, character) {
//   try {
//     const response = await fetch("http://localhost:5000/api/notify/generate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         taskName,
//         tone,
//         character,
//         type: "reminder"
//       })
//     })
//     const data = await response.json()
//     return data.message || fallbackMessage(taskName, tone)
//   } catch (err) {
//     return fallbackMessage(taskName, tone)
//   }
// }

// function fallbackMessage(taskName, tone) {
//   const fallbacks = {
//     friendly: [
//       `You've got this! 😊 Time to ${taskName}.`,
//       `Small steps matter! Don't forget to ${taskName} 💙`,
//     ],
//     strict: [
//       `No excuses. Go do: ${taskName}. Now.`,
//       `${taskName} is waiting. Stop delaying.`,
//     ],
//     sarcastic: [
//       `Wow, ${taskName} still not done? Shocking. 🙄`,
//       `Oh look, ${taskName} is still ignoring itself. Go do it.`,
//     ],
//     motivated: [
//       `YOU GOT THIS! 🔥 Time to crush: ${taskName}!`,
//       `Champions don't wait! Go smash ${taskName} right now! 💪`,
//     ],
//     genz: [
//       `bestie ${taskName} is NOT going to do itself no cap 💀`,
//       `fr fr you need to ${taskName} rn, no more delaying bestie 😭`,
//     ],
//   }

//   const options = fallbacks[tone] || fallbacks.friendly
//   return options[Math.floor(Math.random() * options.length)]
// }

// export async function scheduleNotification(task) {
//   if (!("serviceWorker" in navigator)) return
//   if (!("Notification" in window)) return

//   const permission = await Notification.requestPermission()
//   if (permission !== "granted") return

//   const now = new Date()
//   const [h, m] = task.startTime.split(":").map(Number)
//   const fireAt = new Date()
//   fireAt.setHours(h, m, 0, 0)

//   const delay = fireAt - now
//   if (delay < 0) return

//   // Cancel existing timeout for this task
//   if (activeTimeouts.has(task._id)) {
//     clearTimeout(activeTimeouts.get(task._id))
//   }

//   const category = detectCategory(task.name)
//   const settings = JSON.parse(localStorage.getItem("padida-settings") || "{}")
//   const tone = settings.notifStyle || "friendly"
//   const character = settings.character || "astronaut"

//   const characterLabels = {
//     astronaut: "Astronaut", alien: "Alien",
//     robot: "Robot", planet: "Planet",
//     fairy: "Fairy", fox: "Fox",
//     mushroom: "Mushroom", spirit: "Spirit",
//     dolphin: "Dolphin", octopus: "Octopus",
//     crab: "Crab", mermaid: "Mermaid",
//     cactus: "Cactus", scorpion: "Scorpion",
//     camel: "Camel", sun: "Sun",
//   }
//   const characterName = characterLabels[character] || character

//   const characterEmojis = {
//     astronaut: "👨‍🚀", alien: "👽",
//     robot: "🤖", planet: "🪐",
//     fairy: "🧚", fox: "🦊",
//     mushroom: "🍄", spirit: "🌿",
//     dolphin: "🐬", octopus: "🐙",
//     crab: "🦀", mermaid: "🧜",
//     cactus: "🌵", scorpion: "🦂",
//     camel: "🐪", sun: "☀️",
//   }
//   const characterEmoji = characterEmojis[character] || "⏰"

//   const timeoutId = setTimeout(async () => {
//     activeTimeouts.delete(task._id)

//     const aiMessage = await generateNotificationMessage(task.name, tone, category, characterName)

//     const reg = await navigator.serviceWorker.ready
//     reg.showNotification(`${characterEmoji} ${task.name}`, {
//       body: aiMessage,
//       icon: "/icon.png",
//       badge: "/icon.png",
//       data: {
//         name: task.name,
//         tone: tone,
//         character: characterName,
//         category: category,
//       },
//       actions: [
//         { action: "going",  title: "✅ Yes I'm going" },
//         { action: "snooze", title: "⏱ 5 more minutes" },
//       ],
//       requireInteraction: true,
//     })
//      if (task.emails && task.emails.length > 0) {
//       fetch("http://localhost:5000/api/email/send", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           to: task.emails.join(","),
//           taskName: task.name,
//           startTime: task.startTime,
//           endTime: task.endTime,
//           message: aiMessage
//         })
//       })
//     }
//   }, delay)

//   // Store timeout
//   activeTimeouts.set(task._id, timeoutId)
// }
const activeTimeouts = new Map()

export function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("SW registered", reg)
      })
      .catch((err) => {
        console.log("SW failed", err)
      })
  }
}

function detectCategory(taskName) {
  const name = taskName.toLowerCase()
  if (/study|read|exam|test|learn|revision|notes|homework|assignment|dbms|math|physics|chemistry|biology|history|english|coding|algorithm/.test(name))
    return "study"
  if (/drink|water|eat|meal|sleep|rest|exercise|walk|run|gym|meditate|yoga|health|medicine|tablet|vitamin/.test(name))
    return "health"
  if (/submit|meeting|project|deadline|presentation|report|client|email|office|work|task|sprint|review|deploy/.test(name))
    return "work"
  if (/call|text|message|visit|friend|family|birthday|party|plan|hangout/.test(name))
    return "social"
  return "general"
}

async function generateNotificationMessage(taskName, tone, category, character, type = "reminder") {
  try {
    const response = await fetch("http://localhost:5000/api/notify/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskName, tone, character, type })
    })
    const data = await response.json()
    return data.message || fallbackMessage(taskName, tone)
  } catch (err) {
    return fallbackMessage(taskName, tone)
  }
}

function fallbackMessage(taskName, tone) {
  const fallbacks = {
    friendly: [
      `You've got this! 😊 Time to ${taskName}.`,
      `Small steps matter! Don't forget to ${taskName} 💙`,
    ],
    strict: [
      `No excuses. Go do: ${taskName}. Now.`,
      `${taskName} is waiting. Stop delaying.`,
    ],
    sarcastic: [
      `Wow, ${taskName} still not done? Shocking. 🙄`,
      `Oh look, ${taskName} is still ignoring itself. Go do it.`,
    ],
    motivated: [
      `YOU GOT THIS! 🔥 Time to crush: ${taskName}!`,
      `Champions don't wait! Go smash ${taskName} right now! 💪`,
    ],
    genz: [
      `bestie ${taskName} is NOT going to do itself no cap 💀`,
      `fr fr you need to ${taskName} rn, no more delaying bestie 😭`,
    ],
  }
  const options = fallbacks[tone] || fallbacks.friendly
  return options[Math.floor(Math.random() * options.length)]
}

export async function scheduleNotification(task) {
  if (!("serviceWorker" in navigator)) return
  if (!("Notification" in window)) return

  const permission = await Notification.requestPermission()
  if (permission !== "granted") return

  const now = new Date()
  const [startH, startM] = task.startTime.split(":").map(Number)
  const [endH, endM] = task.endTime.split(":").map(Number)

  const fireAt = new Date()
  fireAt.setHours(startH, startM, 0, 0)

  const endAt = new Date()
  endAt.setHours(endH, endM, 0, 0)

  const startDelay = fireAt - now
  const endDelay = endAt - now
  const durationMs = endAt - fireAt
  const midDelay = startDelay + durationMs / 2

  if (startDelay < 0 && midDelay < 0 && endDelay < 0) return

  // Cancel existing timeouts for this task
  ["_start", "_mid", "_end"].forEach(suffix => {
    const key = task._id + suffix
    if (activeTimeouts.has(key)) {
      clearTimeout(activeTimeouts.get(key))
      activeTimeouts.delete(key)
    }
  })

  const category = detectCategory(task.name)
  const settings = JSON.parse(localStorage.getItem("padida-settings") || "{}")
  const tone = settings.notifStyle || "friendly"
  const character = settings.character || "astronaut"

  const characterLabels = {
    astronaut: "Astronaut", alien: "Alien",
    robot: "Robot", planet: "Planet",
    fairy: "Fairy", fox: "Fox",
    mushroom: "Mushroom", spirit: "Spirit",
    dolphin: "Dolphin", octopus: "Octopus",
    crab: "Crab", mermaid: "Mermaid",
    cactus: "Cactus", scorpion: "Scorpion",
    camel: "Camel", sun: "Sun",
  }
  const characterName = characterLabels[character] || character

  const characterEmojis = {
    astronaut: "👨‍🚀", alien: "👽", robot: "🤖", planet: "🪐",
    fairy: "🧚", fox: "🦊", mushroom: "🍄", spirit: "🌿",
    dolphin: "🐬", octopus: "🐙", crab: "🦀", mermaid: "🧜",
    cactus: "🌵", scorpion: "🦂", camel: "🐪", sun: "☀️",
  }
  const characterEmoji = characterEmojis[character] || "⏰"

  const notifData = {
    name: task.name,
    tone,
    character: characterName,
    category,
    startTime: task.startTime,
    endTime: task.endTime,
  }

  const reg = await navigator.serviceWorker.ready

  // ── 1. START notification ──────────────────────────────────────
  if (startDelay >= 0) {
    const t1 = setTimeout(async () => {
      activeTimeouts.delete(task._id + "_start")
      const aiMessage = await generateNotificationMessage(task.name, tone, category, characterName, "reminder")
      reg.showNotification(`${characterEmoji} ${task.name}`, {
        body: aiMessage,
        icon: "/icon.png",
        badge: "/icon.png",
        data: { ...notifData, notifType: "start" },
        actions: [
          { action: "going",  title: "✅ Yes I'm going" },
          { action: "snooze", title: "⏱ 5 more minutes" },
        ],
        requireInteraction: true,
      })
        
      // Send email
console.log("task emails:", task.emails) // add this
      if (task.emails && task.emails.length > 0) {
        fetch("http://localhost:5000/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: task.emails.join(","),
            taskName: task.name,
            startTime: task.startTime,
            endTime: task.endTime,
            message: aiMessage
          })
        })
      }
    }, startDelay)
    activeTimeouts.set(task._id + "_start", t1)
  }

  // ── 2. MIDDLE notification ─────────────────────────────────────
  if (midDelay > 0) {
    const t2 = setTimeout(async () => {
      activeTimeouts.delete(task._id + "_mid")
      const midMessage = await generateNotificationMessage(task.name, tone, category, characterName, "halfway")
      reg.showNotification(`⏳ Halfway there! ${task.name}`, {
        body: midMessage,
        icon: "/icon.png",
        badge: "/icon.png",
        data: { ...notifData, notifType: "middle" },
        requireInteraction: false,
      })
    }, midDelay)
    activeTimeouts.set(task._id + "_mid", t2)
  }
  // ── 3. END notification ────────────────────────────────────────
  if (endDelay > 0) {
    const t3 = setTimeout(async () => {
      activeTimeouts.delete(task._id + "_end")
      const endMessage = await generateNotificationMessage(task.name, tone, category, characterName, "finished_check")
      reg.showNotification(`🏁 Time's up! ${task.name}`, {
        body: endMessage,
        icon: "/icon.png",
        badge: "/icon.png",
        data: { ...notifData, notifType: "end" },
        actions: [
          { action: "finished",     title: "✅ Yes, finished!" },
          { action: "not_finished", title: "😅 Not yet..." },
        ],
        requireInteraction: true,
      })
    }, endDelay)
    activeTimeouts.set(task._id + "_end", t3)
  }
}