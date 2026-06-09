import { useState, useRef, useEffect } from "react"
import "../assets/css/Addtask.css"
import "../assets/css/Homepage.css"
import Addtask from "./Addtask"
import { registerSW, scheduleNotification } from "../registerSW"
import { getTasks, addTask, updateTask, deleteTask } from "../api"
import ThemeEffects from "./ThemeEffects"

const DAYS_SHORT = ["SUN","MON","TUE","WED","THU","FRI","SAT"]
const MONTHS     = ["January","February","March","April","May","June",
                    "July","August","September","October","November","December"]

function StarAvatar({ color, hat }) {
  return (
    <svg viewBox="0 0 200 160" width="38" height="30">
      <path
        d="M 71,48 L 78,26 Q 83,10 88,26 L 95,48 L 122,56 Q 136,48 122,62 L 103,71 L 110,93 Q 115,109 97,100 L 83,87 L 69,100 Q 51,109 56,93 L 63,71 L 44,62 Q 30,48 44,56 L 71,48 Z"
        fill={color}
        stroke="#000"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="butt"
      />
      <circle cx="72" cy="68" r="8" fill="white" stroke="#000" strokeWidth="1.5"/>
      <circle cx="96" cy="68" r="8" fill="white" stroke="#000" strokeWidth="1.5"/>
      <circle cx="74" cy="70" r="4" fill="#111"/>
      <circle cx="98" cy="70" r="4" fill="#111"/>
      <path d="M 70 78 Q 83 86 96 78" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
      {hat === "crown" && (
        <polygon points="44,20 56,4 70,16 84,4 96,20" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
      )}
      {hat === "antenna" && (
        <>
          <line x1="83" y1="10" x2="83" y2="-18" stroke="#aaa" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="83" cy="-23" r="7" fill="#ff4444"/>
        </>
      )}
      {hat === "party" && (
        <>
          <polygon points="83,-10 60,18 106,18" fill="#ff69b4" stroke="#cc3399" strokeWidth="2"/>
          <circle cx="83" cy="-10" r="5" fill="#FFD700"/>
        </>
      )}
    </svg>
  )
}

function TopBar({ avatar, taskCount, doneCount, onSearch, onMenuOpen, onEditAvatar }) {
  const [name, setName] = useState(localStorage.getItem("padida-username") || "Player")
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState(name)
  const [query, setQuery] = useState("")
  const inputRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
        setEditingName(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handleSearchToggle() {
    setSearchOpen(o => !o)
    setQuery("")
    onSearch("")
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  function handleSearchChange(e) {
    setQuery(e.target.value)
    onSearch(e.target.value)
  }

  function handleSaveName() {
    if (tempName.trim()) {
      localStorage.setItem("padida-username", tempName.trim())
      setName(tempName.trim())
    }
    setEditingName(false)
  }

  return (
    <div className="topbar">
      {!searchOpen ? (
        <>
          <div className="topbar-profile" onClick={(e) => {
            e.stopPropagation()
            setProfileOpen(o => !o)
          }}>
            <div className="topbar-avatar-wrap">
              <StarAvatar color={avatar.color} hat={avatar.hat}/>
            </div>
            <div className="topbar-info">
              <span className="topbar-name">{name}</span>
              <span className="topbar-sub">Keep going!</span>
            </div>
          </div>

          {profileOpen && (
            <div className="profile-popup" ref={profileRef} onClick={(e) => e.stopPropagation()}>
              <div className="profile-popup-avatar-wrap">
                <div className="profile-popup-avatar" onClick={(e) => {
                  e.stopPropagation()
                  onEditAvatar()
                }}>
                  <svg viewBox="30 10 120 110" width="100" height="100">
                    <path
                      d="M 71,48 L 78,26 Q 83,10 88,26 L 95,48 L 122,56 Q 136,48 122,62 L 103,71 L 110,93 Q 115,109 97,100 L 83,87 L 69,100 Q 51,109 56,93 L 63,71 L 44,62 Q 30,48 44,56 L 71,48 Z"
                      fill={avatar.color}
                      stroke="#000"
                      strokeWidth="4"
                      strokeLinejoin="round"
                      strokeLinecap="butt"
                    />
                    <circle cx="72" cy="68" r="8" fill="white" stroke="#000" strokeWidth="1.5"/>
                    <circle cx="96" cy="68" r="8" fill="white" stroke="#000" strokeWidth="1.5"/>
                    <circle cx="74" cy="70" r="4" fill="#111"/>
                    <circle cx="98" cy="70" r="4" fill="#111"/>
                    <path d="M 70 78 Q 83 86 96 78" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                    {avatar.hat === "crown" && (
                      <polygon points="44,20 56,4 70,16 84,4 96,20" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
                    )}
                    {avatar.hat === "antenna" && (
                      <>
                        <line x1="83" y1="10" x2="83" y2="-18" stroke="#aaa" strokeWidth="3" strokeLinecap="round"/>
                        <circle cx="83" cy="-23" r="7" fill="#ff4444"/>
                      </>
                    )}
                    {avatar.hat === "party" && (
                      <>
                        <polygon points="83,-10 60,18 106,18" fill="#ff69b4" stroke="#cc3399" strokeWidth="2"/>
                        <circle cx="83" cy="-10" r="5" fill="#FFD700"/>
                      </>
                    )}
                  </svg>
                  <div className="profile-edit-corner">✏️</div>
                </div>
              </div>

              {editingName ? (
                <div className="profile-name-edit">
                  <input
                    className="profile-name-input"
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    autoFocus
                  />
                  <button className="profile-tick-btn" onClick={handleSaveName}>✓</button>
                </div>
              ) : (
                <div className="profile-name-row">
                  <span className="profile-name-text">{name}</span>
                  <button className="profile-edit-btn" onClick={() => setEditingName(true)}>✏️</button>
                </div>
              )}
            </div>
          )}

          <div className="topbar-logo">PADIDA</div>

          <div className="topbar-right">
            <span className="topbar-count">{doneCount}/{taskCount}</span>
            <button className="topbar-icon-btn" onClick={handleSearchToggle}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            <button className="topbar-icon-btn" onClick={onMenuOpen}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="topbar-search-bar">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
            stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            className="topbar-search-input"
            placeholder="Search tasks..."
            value={query}
            onChange={handleSearchChange}
          />
          <button className="topbar-search-close" onClick={handleSearchToggle}>✕</button>
        </div>
      )}
    </div>
  )
}

function TopMenu({ onClose, alignment, setAlignment, priority, setPriority }) {
  const [subMenu, setSubMenu] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose()
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  const alignments = [
    { id: "list",    label: "📋 List view" },
    { id: "grid",    label: "⊞ Grid view" },
    { id: "compact", label: "≡ Compact view" },
  ]

  const priorities = [
    { id: "none",   label: "🔘 No priority" },
    { id: "high",   label: "🔴 High first" },
    { id: "medium", label: "🟡 Medium first" },
    { id: "low",    label: "🟢 Low first" },
    { id: "time",   label: "⏰ By time" },
  ]

  return (
    <div className="top-menu" ref={menuRef}>
      {!subMenu && (
        <>
          <button className="top-menu-item" onClick={() => setSubMenu("alignment")}>
            ⊞ Task Alignment
            <span className="top-menu-arrow">›</span>
          </button>
          <button className="top-menu-item" onClick={() => setSubMenu("priority")}>
            🎯 Priority
            <span className="top-menu-arrow">›</span>
          </button>
        </>
      )}
      {subMenu === "alignment" && (
        <>
          <button className="top-menu-back" onClick={() => setSubMenu(null)}>‹ Back</button>
          <p className="top-menu-sub-title">Task Alignment</p>
          {alignments.map(a => (
            <button
              key={a.id}
              className={`top-menu-item ${alignment === a.id ? "active" : ""}`}
              onClick={() => { setAlignment(a.id); onClose() }}
            >
              {a.label}
              {alignment === a.id && <span className="top-menu-check">✓</span>}
            </button>
          ))}
        </>
      )}
      {subMenu === "priority" && (
        <>
          <button className="top-menu-back" onClick={() => setSubMenu(null)}>‹ Back</button>
          <p className="top-menu-sub-title">Sort by Priority</p>
          {priorities.map(p => (
            <button
              key={p.id}
              className={`top-menu-item ${priority === p.id ? "active" : ""}`}
              onClick={() => { setPriority(p.id); onClose() }}
            >
              {p.label}
              {priority === p.id && <span className="top-menu-check">✓</span>}
            </button>
          ))}
        </>
      )}
    </div>
  )
}

function WeekStrip({ selectedDate, onSelect }) {
  const today = new Date()
  const [weekOffset, setWeekOffset] = useState(0)

  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7)

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    return d
  })

  const monthLabel = MONTHS[days[3].getMonth()] + " " + days[3].getFullYear()

  return (
    <div className="week-section">
      <div className="week-header">
        <button className="week-nav" onClick={() => setWeekOffset(w => w - 1)}>‹</button>
        <span className="week-month">{monthLabel}</span>
        <button className="week-nav" onClick={() => setWeekOffset(w => w + 1)}>›</button>
      </div>
      <div className="week-strip">
        {days.map((d, i) => {
          const isToday    = d.toDateString() === today.toDateString()
          const isSelected = d.toDateString() === selectedDate.toDateString()
          return (
            <button key={i}
              className={`week-day ${isToday ? "today" : ""} ${isSelected && !isToday ? "selected" : ""}`}
              onClick={() => onSelect(d)}>
              <span className="wd-label">{DAYS_SHORT[d.getDay()]}</span>
              <span className="wd-num">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TaskCard({ task, onToggle, onDelete, onEdit, alignment }) {
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [exploding, setExploding] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function fmt(t) {
    const [h, m] = t.split(":").map(Number)
    const ampm = h >= 12 ? "PM" : "AM"
    const hr   = h % 12 || 12
    return `${hr}:${m.toString().padStart(2,"0")} ${ampm}`
  }

  function handleCheck() {
    setExploding(true)
    setTimeout(() => onToggle(task._id), 600)
  }

  const priorityColors = { high: "#f87171", medium: "#fbbf24", low: "#4ade80" }
  const priorityDot = task.priority ? (
    <span className="task-priority-dot" style={{ background: priorityColors[task.priority] }}/>
  ) : null

  return (
    <div className={`task-card task-card--${alignment || "list"} ${exploding ? "exploding" : ""}`}>
      <button className="task-check" onClick={handleCheck}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
          stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </button>
      <div className="task-info">
        <div className="task-name-row">
          {priorityDot}
          <span className="task-name">{task.name}</span>
        </div>
        <span className="task-time">
          {fmt(task.startTime)} → {fmt(task.endTime)}
          {task.selectedDays && ` · ${task.selectedDays.join(", ")}`}
        </span>
      </div>
      <div className="task-right">
        <div className="task-streak">
          <span className="streak-fire">🔥</span>
          <span className="streak-num">{task.streak || 0}</span>
        </div>
        <div className="task-menu-wrap" ref={menuRef}>
          <button className="task-dots" onClick={() => setMenuOpen(o => !o)}>⋮</button>
          {menuOpen && (
            <div className="task-menu">
              <button className="task-menu-item edit"
                onClick={() => { onEdit(task); setMenuOpen(false) }}>
                ✏️ Edit task
              </button>
              <button className="task-menu-item delete"
                onClick={() => { onDelete(task._id); setMenuOpen(false) }}>
                🗑 Delete task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TaskList({ tasks, selectedDate, onToggle, onDelete, onEdit, searchQuery, alignment, priority }) {
  const day     = selectedDate.getDay()
  const DAY_IDS = ["sun","mon","tue","wed","thu","fri","sat"]

  let filtered = tasks.filter(t => {
    if (!t.selectedDays) return false
    return t.selectedDays.includes(DAY_IDS[day])
  })

  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(t => {
      const nameMatch = t.name.toLowerCase().includes(q)
      const timeMatch = t.startTime.includes(q) || t.endTime.includes(q)
      const dayMatch  = t.selectedDays?.some(d => d.includes(q))
      return nameMatch || timeMatch || dayMatch
    })
  }

  const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 3, null: 3 }
  if (priority === "high" || priority === "medium" || priority === "low") {
    filtered = [...filtered].sort((a, b) => {
      const pa = priorityOrder[a.priority] ?? 3
      const pb = priorityOrder[b.priority] ?? 3
      return pa - pb
    })
  } else if (priority === "time") {
    filtered = [...filtered].sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const isToday = selectedDate.toDateString() === new Date().toDateString()
  const label   = isToday
    ? "Today's Tasks"
    : `${DAYS_SHORT[day][0] + DAYS_SHORT[day].slice(1).toLowerCase()}'s Tasks`

  return (
    <div className="task-section">
      <p className="tasks-label">{label}</p>
      {filtered.length === 0
        ? <div className="no-tasks">
            <p>{searchQuery ? "No tasks found 🔍" : "No tasks 🌙"}</p>
            <p className="no-tasks-sub">{searchQuery ? "Try a different search" : "Tap + to add one"}</p>
          </div>
        : <div className={`task-list--${alignment || "list"}`}>
            {filtered.map(t =>
              <TaskCard key={t._id} task={t} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} alignment={alignment}/>
            )}
          </div>
      }
    </div>
  )
}

export default function Home({ onSettings, onhome, theme, onEditAvatar }) {
  const [tasks,        setTasks]    = useState([])
  const [showAdd,      setShowAdd]  = useState(false)
  const [editTask,     setEditTask] = useState(null)
  const [selectedDate, setSelected] = useState(new Date())
  const [searchQuery,  setSearch]   = useState("")
  const [alignment,    setAlignment]= useState("list")
  const [priority,     setPriority] = useState("none")
  const [menuOpen,     setMenuOpen] = useState(false)

  const avatar = JSON.parse(localStorage.getItem("padida-avatar") || '{"color":"#C51111","hat":"none"}')

  const day = selectedDate.getDay()
  const DAY_IDS = ["sun","mon","tue","wed","thu","fri","sat"]
  const todayTasks = tasks.filter(t => t.selectedDays?.includes(DAY_IDS[day]))
  const taskCount  = todayTasks.length
  const doneCount  = todayTasks.filter(t => t.done).length

  useEffect(() => {
    getTasks().then(data => {
      if (Array.isArray(data)) {
        setTasks(data)
        // reschedule notifications for all existing tasks
        data.forEach(task => scheduleNotification(task))
      }
    })
    registerSW()
    Notification.requestPermission()

    let snoozeProcessed = false

    function handleSWMessage(event) {
      console.log("Message received from SW:", event.data) 
      if (event.data?.type === "SNOOZE_TASK") {
        // ignore old messages
        if (!event.data.timestamp || Date.now() - event.data.timestamp > 5000) return

        if (snoozeProcessed) return
        snoozeProcessed = true
        setTimeout(() => { snoozeProcessed = false }, 2000)

        const { taskName, snoozeMinutes } = event.data
        setTasks(prev => {
          const task = prev.find(t => t.name === taskName)
          if (!task) return prev

          function addMinutes(timeStr, mins) {
            const [h, m] = timeStr.split(":").map(Number)
            const total = h * 60 + m + mins
            const newH = Math.floor(total / 60) % 24
            const newM = total % 60
            return `${String(newH).padStart(2,"0")}:${String(newM).padStart(2,"0")}`
          }

          const updatedTask = {
            ...task,
            startTime: addMinutes(task.startTime, snoozeMinutes),
            endTime:   addMinutes(task.endTime,   snoozeMinutes),
          }
          updateTask(task._id, updatedTask)
          return prev.map(t => t._id === task._id ? updatedTask : t)
        })
      }
    }

    navigator.serviceWorker.addEventListener("message", handleSWMessage)
    return () => navigator.serviceWorker.removeEventListener("message", handleSWMessage)
  }, [])

  async function handleAddTask(task) {
    const newTask = await addTask({
      ...task,
      done: false,
      streak: 0,
    })
    setTasks(prev => [...prev, newTask])
    scheduleNotification(newTask)
    setShowAdd(false)
  }

  async function handleToggle(id) {
    await deleteTask(id)
    setTasks(prev => prev.filter(t => t._id !== id))
  }

  async function handleDelete(id) {
    await deleteTask(id)
    setTasks(prev => prev.filter(t => t._id !== id))
  }

  function handleEdit(task) {
    setEditTask(task)
    setShowAdd(true)
  }

  return (
    <div className={`home-page theme-${theme}`}>
      <ThemeEffects theme = {theme}/>
      <TopBar
        avatar={avatar}
        taskCount={taskCount}
        doneCount={doneCount}
        onSearch={setSearch}
        onMenuOpen={() => setMenuOpen(o => !o)}
        onEditAvatar={onEditAvatar}
      />

      {menuOpen && (
        <div className="top-menu-wrap">
          <TopMenu
            onClose={() => setMenuOpen(false)}
            alignment={alignment}
            setAlignment={setAlignment}
            priority={priority}
            setPriority={setPriority}
          />
        </div>
      )}

      <WeekStrip selectedDate={selectedDate} onSelect={setSelected}/>

      <div className="home-scroll">
        <TaskList
          tasks={tasks}
          selectedDate={selectedDate}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
          searchQuery={searchQuery}
          alignment={alignment}
          priority={priority}
        />
      </div>

      <div className="bottom-nav">
        <button className="nav-btn active" onClick={onhome}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
            <path d="M9 21V12h6v9"/>
          </svg>
          <span>Home</span>
        </button>

        <button className="nav-fab" onClick={() => setShowAdd(true)}>+</button>

        <button className="nav-btn" onClick={onSettings}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            {/* <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 1.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/> */}
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          <span>Settings</span>
        </button>
      </div>

      {showAdd && (
        <Addtask
          editTask={editTask}
          onSave={async (updatedTask) => {
            if (editTask) {
              const updated = await updateTask(editTask._id, updatedTask)
              setTasks(prev => prev.map(t => t._id === editTask._id ? updated : t))
              scheduleNotification(updated)
              setEditTask(null)
              setShowAdd(false)
            } else {
              handleAddTask(updatedTask)
            }
          }}
          onClose={() => {
            setEditTask(null)
            setShowAdd(false)
          }}
        />
      )}
    </div>
  )
}