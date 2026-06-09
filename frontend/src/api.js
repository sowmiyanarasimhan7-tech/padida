const BASE_URL = "http://localhost:5000/api"

// ── User ──────────────────────────────────────────────────────
export async function getUser() {
  const res = await fetch(`${BASE_URL}/user`)
  return res.json()
}

export async function saveUser(data) {
  const res = await fetch(`${BASE_URL}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  return res.json()
}

// ── Tasks ─────────────────────────────────────────────────────
export async function getTasks() {
  const res = await fetch(`${BASE_URL}/tasks`)
  return res.json()
}

export async function addTask(task) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  })
  return res.json()
}

export async function updateTask(id, task) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  })
  return res.json()
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE"
  })
  return res.json()
}

// ── Settings ──────────────────────────────────────────────────
export async function getSettings() {
  const res = await fetch(`${BASE_URL}/settings`)
  return res.json()
}

export async function saveSettings(data) {
  const res = await fetch(`${BASE_URL}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  return res.json()
}

// ── Email ─────────────────────────────────────────────────────
export async function sendEmail(data) {
  const res = await fetch(`${BASE_URL}/email/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  return res.json()
}
// ── Notify (AI message generation) ───────────────────────────
export async function generateAIMessage(data) {
  const res = await fetch(`${BASE_URL}/notify/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  return res.json()
}