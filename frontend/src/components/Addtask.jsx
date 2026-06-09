import { useState } from "react"
import "../assets/css/Addtask.css"

const ALL_DAYS = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
]
const WEEKDAY_IDS = ["mon","tue","wed","thu","fri"]
const WEEKEND_IDS = ["sat","sun"]

const QUICK_OPTIONS = [
  { id: "daily",    label: "Daily" },
  { id: "weekdays", label: "Weekdays" },
  { id: "weekends", label: "Weekends" },
]

export default function Addtask({ onSave = () => {}, onClose = () => {}, editTask = null }) {
  const [name,         setName]        = useState(editTask?.name || "")
  const [startTime,    setStartTime]   = useState(editTask?.startTime || "")
  const [endTime,      setEndTime]     = useState(editTask?.endTime || "")
  const [selectedDays, setSelectedDays]= useState(new Set(editTask?.selectedDays || []))
  const [activeQuick,  setActiveQuick] = useState(null)
  const [errors,       setErrors]      = useState({})
  const [priority,     setPriority]    = useState(editTask?.priority || "")
  
  // Email states
  const [emailInput,   setEmailInput]  = useState("")
  const [emails,       setEmails]      = useState(editTask?.emails || [])
  const [emailError,   setEmailError]  = useState("")

  function applyQuick(type) {
    let next
    if (type === "daily")         next = new Set(ALL_DAYS.map(d => d.id))
    else if (type === "weekdays") next = new Set(WEEKDAY_IDS)
    else if (type === "weekends") next = new Set(WEEKEND_IDS)
    setSelectedDays(next)
    setActiveQuick(type)
    clearError("days")
  }

  function toggleDay(id) {
    const next = new Set(selectedDays)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelectedDays(next)
    setActiveQuick(null)
    clearError("days")
  }

  // Add email
  function handleAddEmail() {
    const email = emailInput.trim()
    if (!email) return
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email!")
      return
    }
    if (emails.includes(email)) {
      setEmailError("Email already added!")
      return
    }
    setEmails(prev => [...prev, email])
    setEmailInput("")
    setEmailError("")
  }

  // Remove email
  function handleRemoveEmail(email) {
    setEmails(prev => prev.filter(e => e !== email))
  }

  function validate() {
    const errs = {}
    if (!name.trim())                           errs.name  = "Task name is required."
    if (!startTime)                             errs.start = "Start time is required."
    if (!endTime)                               errs.end   = "End time is required."
    else if (startTime && endTime <= startTime) errs.end   = "End time must be after start time."
    if (selectedDays.size === 0)                errs.days  = "Select at least one day."
    return errs
  }

  function clearError(key) {
    setErrors(prev => { const e = { ...prev }; delete e[key]; return e })
  }

  function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    onSave({
      name: name.trim(),
      startTime,
      endTime,
      selectedDays: [...selectedDays],
      priority,
      emails,  // save emails with task
    })
    onClose()
  }

  return (
    <div
      className="at-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="at-sheet">
        <div className="at-handle" />
        <h2 className="at-title">{editTask ? "Edit Task" : "New Task"}</h2>

        {/* Task name */}
        <div className="at-field">
          <label className="at-label">Task name</label>
          <input
            className={`at-input ${errors.name ? "at-input--error" : ""}`}
            placeholder="What do you need to do?"
            value={name}
            onChange={e => { setName(e.target.value); clearError("name") }}
            autoFocus
          />
          {errors.name && <span className="at-error">{errors.name}</span>}
        </div>

        {/* Time row */}
        <div className="at-row">
          <div className="at-field">
            <label className="at-label">Start time</label>
            <input
              type="time"
              className={`at-input ${errors.start ? "at-input--error" : ""}`}
              value={startTime}
              onChange={e => { setStartTime(e.target.value); clearError("start") }}
            />
            {errors.start && <span className="at-error">{errors.start}</span>}
          </div>
          <div className="at-field">
            <label className="at-label">End time</label>
            <input
              type="time"
              className={`at-input ${errors.end ? "at-input--error" : ""}`}
              value={endTime}
              onChange={e => { setEndTime(e.target.value); clearError("end") }}
            />
            {errors.end && <span className="at-error">{errors.end}</span>}
          </div>
        </div>

        {/* Repeat */}
        <div className="at-field">
          <label className="at-label">Repeat</label>
          <div className="at-quick-row">
            {QUICK_OPTIONS.map(q => (
              <button
                key={q.id}
                className={`at-quick-btn ${activeQuick === q.id ? "active" : ""}`}
                onClick={() => applyQuick(q.id)}
              >
                {q.label}
              </button>
            ))}
          </div>
          <div className="at-days-row">
            {ALL_DAYS.map(d => (
              <button
                key={d.id}
                className={`at-day-btn ${selectedDays.has(d.id) ? "active" : ""}`}
                onClick={() => toggleDay(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
          {errors.days && <span className="at-error">{errors.days}</span>}
        </div>

        {/* Priority */}
        <div className="at-field">
          <label className="at-label">Priority</label>
          <div className="at-quick-row">
            {["high", "medium", "low"].map(p => (
              <button
                key={p}
                className={`at-quick-btn ${priority === p ? "active" : ""}`}
                onClick={() => setPriority(priority === p ? "" : p)}
              >
                {p === "high" ? "🔴 High" : p === "medium" ? "🟡 Medium" : "🟢 Low"}
              </button>
            ))}
          </div>
        </div>

        {/* Email reminders */}
        <div className="at-field">
          <label className="at-label">📧 Send reminder to</label>
          <div className="at-email-row">
            <input
              className="at-input"
              placeholder="friend@email.com"
              value={emailInput}
              onChange={e => { setEmailInput(e.target.value); setEmailError("") }}
              onKeyDown={e => e.key === "Enter" && handleAddEmail()}
            />
            <button className="at-email-add-btn" onClick={handleAddEmail}>+</button>
          </div>
          {emailError && <span className="at-error">{emailError}</span>}
          
          {/* Email tags */}
          {emails.length > 0 && (
            <div className="at-email-tags">
              {emails.map(email => (
                <div key={email} className="at-email-tag">
                  <span>{email}</span>
                  <button onClick={() => handleRemoveEmail(email)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="at-save" onClick={handleSave}>
          {editTask ? "Update Task 🚀" : "Save Task 🚀"}
        </button>
        <button className="at-cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}