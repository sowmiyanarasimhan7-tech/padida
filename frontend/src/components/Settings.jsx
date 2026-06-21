// ── Imports ──────────────────────────────────────────────────────
import { useState } from "react"
import "../assets/css/Settings.css"
import ThemeEffects from "./ThemeEffects"
import { saveSettings } from "../api"
import {playTone} from "../toneplayer"

// ── Theme Data ───────────────────────────────────────────────────
const THEMES = [
  { id: "space",  label: "Space",  icon: "🚀" },
  { id: "forest", label: "Forest", icon: "🌲" },
  { id: "sea",    label: "Sea",    icon: "🌊" },
  { id: "desert", label: "Desert", icon: "🏜️" },
]

// ── Notification Characters per Theme ────────────────────────────
const CHARACTERS = {
  space:  [
    { id: "astronaut", label: "Astronaut", icon: "👨‍🚀" },
    { id: "alien",     label: "Alien",     icon: "👽"  },
    { id: "robot",     label: "Robot",     icon: "🤖"  },
    { id: "planet",    label: "Planet",    icon: "🪐"  },
  ],
  forest: [
    { id: "fairy",     label: "Fairy",     icon: "🧚"  },
    { id: "fox",       label: "Fox",       icon: "🦊"  },
    { id: "mushroom",  label: "Mushroom",  icon: "🍄"  },
    { id: "spirit",    label: "Spirit",    icon: "🌿"  },
  ],
  sea: [
    { id: "dolphin",   label: "Dolphin",   icon: "🐬"  },
    { id: "octopus",   label: "Octopus",   icon: "🐙"  },
    { id: "crab",      label: "Crab",      icon: "🦀"  },
    { id: "mermaid",   label: "Mermaid",   icon: "🧜"  },
  ],
  desert: [
    { id: "cactus",    label: "Cactus",    icon: "🌵"  },
    { id: "scorpion",  label: "Scorpion",  icon: "🦂"  },
    { id: "camel",     label: "Camel",     icon: "🐪"  },
    { id: "sun",       label: "Sun",       icon: "☀️"  },
  ],
}

// ── Notification Styles ──────────────────────────────────────────
const NOTIF_STYLES = [
  { id: "friendly",  label: "Friendly",   icon: "😊",
    message: (char) => `Hey! ${char} believes in you. Time to get it done! 💙` },
  { id: "strict",    label: "Strict",     icon: "😤",
    message: (char) => `${char} says: No excuses. Do your task. NOW.` },
  { id: "sarcastic", label: "Sarcastic",  icon: "😏",
    message: (char) => `${char} Oh wow, another task you're definitely going to finish... right? 🙄` },
  { id: "motivated", label: "Motivated",  icon: "💪",
    message: (char) => `YOU GOT THIS! ${char} is cheering for you! Let's GOOO! 🔥` },
  { id: "genz",      label: "Funny/GenZ", icon: "😂",
    message: (char) => `bestie ur task is NOT going to do itself no cap 💀 ${char} said do it rn` },
]

// ── Notification Tones ───────────────────────────────────────────
const NOTIF_TONES = [
  { id: "cosmic",  label: "Cosmic",  icon: "🌌" },
  { id: "drop",    label: "Drop",    icon: "💧" },
  { id: "pulse",   label: "Pulse",   icon: "💓" },
  { id: "glitch",  label: "Glitch",  icon: "⚡" },
  { id: "bubble",  label: "Bubble",  icon: "🫧" },
  { id: "crystal", label: "Crystal", icon: "💎" },
]


// ── Main Settings Component ──────────────────────────────────────
export default function Settings({ onHome, onThemeChange, theme }) {
  const saved = JSON.parse(localStorage.getItem("padida-settings") || "{}")

  const [character,  setCharacter]  = useState(saved.character  || "astronaut")
  const [notifStyle, setNotifStyle] = useState(saved.notifStyle || "friendly")
  const [notifTone,  setNotifTone]  = useState(saved.notifTone  || "cosmic")

  async function saveSetting(key, value) {
    const current = JSON.parse(localStorage.getItem("padida-settings") || "{}")
    const updated = { ...current, [key]: value }
    localStorage.setItem("padida-settings", JSON.stringify(updated))
    await saveSettings(updated)
  }

  async function handleThemeChange(newTheme) {
    onThemeChange(newTheme)
    await saveSetting("theme", newTheme)
    const firstChar = CHARACTERS[newTheme][0].id
    setCharacter(firstChar)
    await saveSetting("character", firstChar)
  }

  async function handleCharacterChange(charId) {
    setCharacter(charId)
    await saveSetting("character", charId)
  }

  async function handleStyleChange(styleId) {
    setNotifStyle(styleId)
    await saveSetting("notifStyle", styleId)
  }

  async function handleToneChange(toneId) {
    setNotifTone(toneId)
    await saveSetting("notifTone", toneId)
    playTone(toneId)
  }

  const currentChar  = CHARACTERS[theme].find(c => c.id === character)

  return (
    <div className={`settings-page theme-${theme}`}>
      <ThemeEffects theme={theme}/>

      {/* ── Top bar ── */}
      <div className="settings-topbar">
        <h1 className="settings-title">Settings</h1>
        <span className="settings-theme-icon">
          {THEMES.find(t => t.id === theme)?.icon}
        </span>
      </div>

      {/* ── Scrollable content ── */}
      <div className="settings-scroll">

        {/* ════════════════════════════════
            SECTION 1 — THEME
        ════════════════════════════════ */}
        <div className="settings-section">
          <p className="settings-section-title">🎨 Theme</p>
          <div className="settings-grid">
            {THEMES.map(t => (
              <button
                key={t.id}
                className={`settings-theme-card ${theme === t.id ? "active" : ""}`}
                onClick={() => handleThemeChange(t.id)}
              >
                <span className="theme-icon">{t.icon}</span>
                <span className="theme-label">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════
            SECTION 2 — NOTIFICATION CHARACTER
        ════════════════════════════════ */}
        <div className="settings-section">
          <p className="settings-section-title">🔔 Notification Character</p>
          <p className="settings-section-sub">
            Characters from the {THEMES.find(t => t.id === theme)?.label} theme
          </p>
          <div className="settings-char-row">
            {CHARACTERS[theme].map(c => (
              <button
                key={c.id}
                className={`settings-char-btn ${character === c.id ? "active" : ""}`}
                onClick={() => handleCharacterChange(c.id)}
              >
                <span className="char-icon">{c.icon}</span>
                <span className="char-label">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════
            SECTION 3 — NOTIFICATION STYLE
        ════════════════════════════════ */}
        <div className="settings-section">
          <p className="settings-section-title">💬 Notification Style</p>
          <div className="settings-style-row">
            {NOTIF_STYLES.map(s => (
              <button
                key={s.id}
                className={`settings-style-btn ${notifStyle === s.id ? "active" : ""}`}
                onClick={() => handleStyleChange(s.id)}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════
            SECTION 4 — NOTIFICATION TONE
        ════════════════════════════════ */}
        <div className="settings-section">
          <p className="settings-section-title">🔊 Notification Tone</p>
          <p className="settings-section-sub">Tap to preview the tone</p>
          <div className="settings-style-row">
            {NOTIF_TONES.map(t => (
              <button
                key={t.id}
                className={`settings-style-btn ${notifTone === t.id ? "active" : ""}`}
                onClick={() => handleToneChange(t.id)}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════
            SECTION 5 — WIDGET
        ════════════════════════════════ */}
        <div className="settings-section">
          <p className="settings-section-title">🧩 Widget</p>
          <p className="settings-section-sub">
            Add your buddy to your home screen
          </p>
          <div className="settings-widget-card">
            <div className="widget-buddy">
              <span className="widget-char-icon">{currentChar?.icon}</span>
              <div className="widget-info">
                <p className="widget-name">PADIDA</p>
                <p className="widget-msg">Tap to check your tasks!</p>
              </div>
            </div>
            <button className="widget-add-btn">
              + Add to Home Screen
            </button>
          </div>
        </div>

      </div>{/* end settings-scroll */}

      {/* ── Bottom Nav ── */}
      <div className="bottom-nav">
        <button className="nav-btn" onClick={onHome}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
            <path d="M9 21V12h6v9"/>
          </svg>
          <span>Home</span>
        </button>
        <div className="nav-fab-placeholder"/>
        <button className="nav-btn active">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          <span>Settings</span>
        </button>
      </div>

    </div>
  )
}