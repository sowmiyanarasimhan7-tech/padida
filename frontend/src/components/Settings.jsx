// ── Imports ──────────────────────────────────────────────────────
import { useState } from "react"
// useState lets us track which theme, character, and style the user picked

import "../assets/css/Settings.css"
// imports the styles for this page
import ThemeEffects from "./ThemeEffects"
import { saveSettings } from "../api"
// ── Theme Data ───────────────────────────────────────────────────
// Each theme has an id, label, and emoji icon
const THEMES = [
  { id: "space",  label: "Space",  icon: "🚀" },
  { id: "forest", label: "Forest", icon: "🌲" },
  { id: "sea",    label: "Sea",    icon: "🌊" },
  { id: "desert", label: "Desert", icon: "🏜️" },
]

// ── Notification Characters per Theme ────────────────────────────
// Each theme has 4 characters. When theme changes, characters change too.
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
// Each style has an id, label, icon, and a sample message the character says
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

// ── Main Settings Component ──────────────────────────────────────
export default function Settings({ onHome, onThemeChange, theme}) {
  // onHome is a function passed from App.jsx to go back to home page
  // when user clicks the Home button in bottom nav

  // Load saved settings from localStorage, or use defaults
  const saved = JSON.parse(localStorage.getItem("padida-settings") || "{}")

  // character state — default is first character of current theme
  const [character, setCharacter] = useState(saved.character || "astronaut")

  // notification style state — default is "friendly"
  const [notifStyle, setNotifStyle] = useState(saved.notifStyle || "friendly")

  // ── Save to localStorage whenever something changes ────────────
  async function saveSetting(key, value) {
  const current = JSON.parse(localStorage.getItem("padida-settings") || "{}")
  const updated = { ...current, [key]: value }
  localStorage.setItem("padida-settings", JSON.stringify(updated))
  
  // save to MongoDB
  await saveSettings(updated)
}

  // ── When theme changes, reset character to first of new theme ──
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

  // ── Get current character icon for preview ────────────────────
  // finds the character object that matches current character id
  const currentChar = CHARACTERS[theme].find(c => c.id === character)

  // ── Get current notification style object ─────────────────────
  const currentStyle = NOTIF_STYLES.find(s => s.id === notifStyle)

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className={`settings-page theme-${theme}`}>
      <ThemeEffects theme={theme}/>

      {/* ── Top bar ── */}
      <div className="settings-topbar">
        <h1 className="settings-title">Settings</h1>
        {/* shows current theme icon next to title */}
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
            {/* loop through all 4 themes and render a card for each */}
            {THEMES.map(t => (
              <button
                key={t.id}
                // if this theme is selected, add "active" class for highlight
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
            {/* shows which theme's characters are showing */}
            Characters from the {THEMES.find(t => t.id === theme)?.label} theme
          </p>
          <div className="settings-char-row">
            {/* loop through the 4 characters of current theme */}
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
            {/* loop through all 5 notification styles */}
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
            SECTION 4 — NOTIFICATION PREVIEW
        ════════════════════════════════ */}
        <div className="settings-section">
          <p className="settings-section-title">👀 Notification Preview</p>
          {/* preview card showing what the notification will look like */}
          <div className="settings-preview-card">
            <span className="preview-char-icon">{currentChar?.icon}</span>
            <div className="preview-text">
              <p className="preview-title">Task Reminder</p>
              {/* calls the message function with the character label */}
              <p className="preview-msg">
                {currentStyle?.message(currentChar?.label)}
              </p>
            </div>
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
          {/* widget preview showing the character */}
          <div className="settings-widget-card">
            <div className="widget-buddy">
              <span className="widget-char-icon">{currentChar?.icon}</span>
              <div className="widget-info">
                <p className="widget-name">PADIDA</p>
                <p className="widget-msg">Tap to check your tasks!</p>
              </div>
            </div>
            {/* add to home screen button */}
            <button className="widget-add-btn">
              + Add to Home Screen
            </button>
          </div>
        </div>

      </div>{/* end settings-scroll */}

      {/* ── Bottom Nav ── */}
      {/* same nav as homepage but settings is now active */}
      <div className="bottom-nav">
        {/* Home button — goes back to home page */}
        <button className="nav-btn" onClick={onHome}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
            <path d="M9 21V12h6v9"/>
          </svg>
          <span>Home</span>
        </button>

        {/* FAB plus button — still accessible from settings */}
        <div className="nav-fab-placeholder"/>

        {/* Settings button — active because we are on this page */}
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