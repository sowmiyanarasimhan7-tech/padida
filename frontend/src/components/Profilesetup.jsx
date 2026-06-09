import { useState } from "react"
import "../assets/css/profilesetup.css"
import { saveUser } from "../api"

function Profilesetup({ onNext }) {
  const [name, setName] = useState("")

  async function handleSubmit() {
    if (name.trim() === "") return
    localStorage.setItem("padida-username", name.trim())
    
    // save to MongoDB
    await saveUser({ username: name.trim() })
    
    onNext()
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSubmit()
  }

  return (
    <div className="full-width">
      <div className="profile">
        <h1>Choose your main character name ✨</h1>
        <input
          type="text"
          placeholder="Your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button onClick={handleSubmit}>
          Let's Lock In 🔥
        </button>
      </div>
    </div>
  )
}

export default Profilesetup