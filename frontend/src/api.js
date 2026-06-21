const BASE_URL = "http://localhost:5000/api"

// ── Helper to get auth headers ──────────────────────────────────
function authHeaders() {
  const token = localStorage.getItem("padida-token")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

// ── User ──────────────────────────────────────────────────────
export async function getUser() {
  const res = await fetch(`${BASE_URL}/user`, {
    headers: authHeaders()
  })
  return res.json()
}

export async function saveUser(data) {
  const res = await fetch(`${BASE_URL}/user`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data)
  })
  return res.json()
}

// ── Tasks ─────────────────────────────────────────────────────
export async function getTasks() {
  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: authHeaders()
  })
  if (!res.ok) {
    console.error("getTasks failed:", res.status, await res.text())
    return []
  }
  return res.json()
}

export async function addTask(task) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(task)
  })
  if (!res.ok) {
    console.error("addTask failed:", res.status, await res.text())
    throw new Error("Failed to add task")
  }
  return res.json()
}

export async function updateTask(id, task) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(task)
  })
  if (!res.ok) {
    console.error("updateTask failed:", res.status, await res.text())
    throw new Error("Failed to update task")
  }
  return res.json()
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  })
  if (!res.ok) {
    console.error("deleteTask failed:", res.status, await res.text())
    throw new Error("Failed to delete task")
  }
  return res.json()
}

// ── Settings ──────────────────────────────────────────────────
export async function getSettings() {
  const res = await fetch(`${BASE_URL}/settings`, {
    headers: authHeaders()
  })
  return res.json()
}

export async function saveSettings(data) {
  const res = await fetch(`${BASE_URL}/settings`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data)
  })
  return res.json()
}

// ── Email ─────────────────────────────────────────────────────
export async function sendEmail(data) {
  const res = await fetch(`${BASE_URL}/email/send`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data)
  })
  return res.json()
}

// ── Notify (AI message generation) ───────────────────────────
export async function generateAIMessage(data) {
  const res = await fetch(`${BASE_URL}/notify/generate`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data)
  })
  return res.json()
}