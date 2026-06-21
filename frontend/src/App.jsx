import "./App.css"
import { useState, useEffect } from "react"
import Profilesetup from "./components/Profilesetup"
import Starsbackground from "./components/Starsbackground"
import PadidaLogo from "./components/PadidaLogo"
import AvatarSetup from "./components/AvatarSetup"
import Homepage from "./components/Homepage"
import Settings from "./components/Settings"
import Login from "./components/Login"

function App() {
  const [page, setPage] = useState("logo")
  const [theme, setTheme] = useState(() => {
    const settings = JSON.parse(localStorage.getItem("padida-settings") || "{}")
    return settings.theme || "space"
  })

  useEffect(() => {
    // After logo, always show login screen — no token auto-skip
    const timer = setTimeout(() => {
      setPage("login")
    }, 8700)

    return () => clearTimeout(timer)
  }, [])

  // Called after successful login/register
  const handleLoginSuccess = ({ isNewUser, isAvatarComplete }) => {
    if (isNewUser) {
      setPage("profile")
    } else if (!isAvatarComplete) {
      setPage("style")
    } else {
      setPage("home")
    }
  }

  // Called when profile setup is done
  const handleProfileNext = async () => {
    const token = localStorage.getItem("padida-token")
    if (token) {
      await fetch("/api/auth/profile-complete", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      })
    }
    setPage("style")
  }

  // Called when avatar setup is done
  const handleAvatarNext = async () => {
    const token = localStorage.getItem("padida-token")
    if (token) {
      await fetch("/api/auth/avatar-complete", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      })
    }
    setPage("home")
  }

  return (
    <div className={`app theme-${theme}`}>
      {theme === "space" && <Starsbackground />}
      {page === "logo"     && <PadidaLogo />}
      {page === "login"    && <Login onLoginSuccess={handleLoginSuccess} />}
      {page === "profile"  && <Profilesetup onNext={handleProfileNext} />}
      {page === "style"    && <AvatarSetup onNext={handleAvatarNext} />}
      {page === "home"     && <Homepage
        onSettings={() => setPage("settings")}
        onhome={() => setPage("home")}
        theme={theme}
        onEditAvatar={() => setPage("style")}
      />}
      {page === "settings" && <Settings
        onHome={() => setPage("home")}
        onThemeChange={(t) => setTheme(t)}
        theme={theme}
      />}
    </div>
  )
}

export default App