import { useState } from "react"
import "../assets/css/AvatarSetup.css"
import { saveUser } from "../api"

const COLORS = [
  { name: "Red",    body: "#C51111", dark: "#7A0A0A" },
  { name: "Blue",   body: "#132ED2", dark: "#0A1A7A" },
  { name: "Green",  body: "#117F2D", dark: "#0A4A1A" },
  { name: "Pink",   body: "#ED54BA", dark: "#A0317A" },
  { name: "Orange", body: "#EF7D0E", dark: "#A04A0A" },
  { name: "Yellow", body: "#F5F557", dark: "#A0A030" },
  { name: "Purple", body: "#6B2FBB", dark: "#3A1A7A" },
  { name: "White",  body: "#D6DDE0", dark: "#8A9A9A" },
  { name: "Black",  body: "#3f474e", dark: "#1A1E22" },
  { name: "Cyan",   body: "#38FEDC", dark: "#1A9A8A" },
]

const HATS = [
  { id: "none",    label: "None" },
  { id: "crown",   label: "👑 Crown" },
  { id: "cap",     label: "🧢 Cap" },
  { id: "antenna", label: "📡 Antenna" },
  { id: "party",   label: "🎉 Party" },
]

const FACES = [
  { id: "happy",     label: "😊 Happy" },
  { id: "wink",      label: "😉 Wink" },
  { id: "sad",       label: "😢 Sad" },
  { id: "angry",     label: "😠 Angry" },
  { id: "surprised", label: "😮 Wow" },
  { id: "love",      label: "🥰 Love" },
]

function StarCharacter({ color, hat, face }) {

  const blush = (
    <>
      <ellipse cx="62" cy="76" rx="8" ry="5" fill="#ffaacc" opacity="0.6"/>
      <ellipse cx="104" cy="76" rx="8" ry="5" fill="#ffaacc" opacity="0.6"/>
    </>
  )

  const eyes = {
    happy: (
      <>
        <circle cx="72" cy="68" r="8" fill="white" stroke="#000" strokeWidth="1.5"/>
        <circle cx="96" cy="68" r="8" fill="white" stroke="#000" strokeWidth="1.5"/>
        <circle cx="74" cy="70" r="4" fill="#111"/>
        <circle cx="98" cy="70" r="4" fill="#111"/>
      </>
    ),
    wink: (
      <>
        <circle cx="72" cy="68" r="8" fill="white" stroke="#000" strokeWidth="1.5"/>
        <circle cx="74" cy="70" r="4" fill="#111"/>
        <path d="M 88 65 Q 96 60 104 65" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      </>
    ),
    sad: (
      <>
        <circle cx="72" cy="68" r="8" fill="white" stroke="#000" strokeWidth="1.5"/>
        <circle cx="96" cy="68" r="8" fill="white" stroke="#000" strokeWidth="1.5"/>
        <circle cx="74" cy="70" r="4" fill="#111"/>
        <circle cx="98" cy="70" r="4" fill="#111"/>
        <path d="M 66 63 Q 72 58 78 63" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
        <path d="M 90 63 Q 96 58 102 63" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
      </>
    ),
    angry: (
      <>
        <circle cx="72" cy="68" r="8" fill="white" stroke="#000" strokeWidth="1.5"/>
        <circle cx="96" cy="68" r="8" fill="white" stroke="#000" strokeWidth="1.5"/>
        <circle cx="74" cy="70" r="4" fill="#111"/>
        <circle cx="98" cy="70" r="4" fill="#111"/>
        <path d="M 66 62 Q 72 67 78 62" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
        <path d="M 90 62 Q 96 67 102 62" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
      </>
    ),
    surprised: (
      <>
        <circle cx="72" cy="68" r="9" fill="white" stroke="#000" strokeWidth="1.5"/>
        <circle cx="96" cy="68" r="9" fill="white" stroke="#000" strokeWidth="1.5"/>
        <circle cx="72" cy="68" r="5" fill="#111"/>
        <circle cx="96" cy="68" r="5" fill="#111"/>
      </>
    ),
    love: (
      <>
        <path d="M 68 65 C 68 61, 72 59, 74 62 C 76 59, 80 61, 80 65 C 80 68, 74 73, 74 73 C 74 73, 68 68, 68 65 Z" fill="#ff4466"/>
        <path d="M 92 65 C 92 61, 96 59, 98 62 C 100 59, 104 61, 104 65 C 104 68, 98 73, 98 73 C 98 73, 92 68, 92 65 Z" fill="#ff4466"/>
      </>
    ),
  }

  const mouths = {
    happy:     <path d="M 70 78 Q 83 88 96 78" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"/>,
    wink:      <path d="M 70 78 Q 83 88 96 78" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"/>,
    sad:       <path d="M 70 84 Q 83 76 96 84" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"/>,
    angry:     <path d="M 70 84 Q 83 76 96 84" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"/>,
    surprised: <ellipse cx="83" cy="82" rx="7" ry="9" fill="#333" stroke="#000" strokeWidth="1.5"/>,
    love:      <path d="M 70 80 Q 83 92 96 80" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>,
  }

  return (
    <svg viewBox="30 -5 120 130" width="270" height="320" preserveAspectRatio="xMidYMid meet">

      {/* Hats */}
      {hat === "crown" && (
  <polygon points="67,32 73,22 83,28 93,22 99,32"
    fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
)}
{hat === "cap" && (
  <>
    <rect x="55" y="14" width="56" height="12" rx="5" fill="blue"/>
    <ellipse cx="62" cy="26" rx="14" ry="6" fill="#333"/>
  </>
)}
{hat === "antenna" && (
  <>
    <line x1="83" y1="22" x2="83" y2="2" stroke="#aaa" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="83" cy="-4" r="5" fill="#ff4444"/>
  </>
)}
{hat === "party" && (
  <>
    <polygon points="83,0 67,28 99,28" fill="#ff69b4" stroke="#cc3399" strokeWidth="2"/>
    <circle cx="83" cy="0" r="4" fill="#FFD700"/>
  </>
)}

      {/* Star body */}
      <path
        d="M 71,48 
        L 78,26 
        Q 83,10 88,26 
        L 95,48 L 122,56 
        Q 136,48 122,62 
        L 103,71 
        L 110,93 
        Q 115,109 97,100 
        L 83,87 
        L 69,100 
        Q 51,109 56,93 
        L 63,71 
        L 44,62 
        Q 30,48 44,56 
        L 71,48 Z"
        fill={color}
        stroke="#000"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="butt"
      />

      {/* Blush */}
      {blush}

      {/* Eyes */}
      {eyes[face] || eyes.happy}

      {/* Mouth */}
      {mouths[face] || mouths.happy}

    </svg>
  )
}

export default function AvatarSetup({ onNext }) {
  const name = localStorage.getItem("padida-username") || "Player"
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [selectedHat, setSelectedHat]     = useState("none")
  const [selectedFace, setSelectedFace]   = useState("happy")

  async function handleDone() {
  const avatarData = {
    color: selectedColor.body,
    dark:  selectedColor.dark,
    name:  selectedColor.name,
    hat:   selectedHat,
    face:  selectedFace,
  }
  localStorage.setItem("padida-avatar", JSON.stringify(avatarData))
  
  // save to MongoDB
  await saveUser({ avatar: avatarData })
  
  onNext()
}

  return (
    <div className="avatar-page">
      <h1 className="avatar-title">Choose your style {name}! ✨</h1>

      <div className="avatar-preview">
        <StarCharacter
          color={selectedColor.body}
          hat={selectedHat}
          face={selectedFace}
        />
      </div>

      <div className="avatar-Scroll">
      <div className="avatar-section">
        <p className="avatar-label">🎨 Pick your color</p>
        <div className="color-row">
          {COLORS.map(c => (
            <button
              key={c.name}
              className={`color-dot ${selectedColor.name === c.name ? "selected" : ""}`}
              style={{ background: c.body }}
              onClick={() => setSelectedColor(c)}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <div className="avatar-section">
        <p className="avatar-label">🎩 Pick your hat</p>
        <div className="hat-row">
          {HATS.map(h => (
            <button
              key={h.id}
              className={`hat-btn ${selectedHat === h.id ? "selected" : ""}`}
              onClick={() => setSelectedHat(h.id)}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      <div className="avatar-section">
        <p className="avatar-label">😊 Pick your expression</p>
        <div className="hat-row">
          {FACES.map(f => (
            <button
              key={f.id}
              className={`hat-btn ${selectedFace === f.id ? "selected" : ""}`}
              onClick={() => setSelectedFace(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <button className="avatar-done" onClick={handleDone}>
        Let's Go 🚀
      </button>
    </div>
    </div>
  )
}