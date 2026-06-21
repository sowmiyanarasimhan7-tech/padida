// import "./App.css"
// import { useState, useEffect } from "react"
// import Profilesetup from "./components/Profilesetup"
// import Starsbackground from "./components/Starsbackground"
// import PadidaLogo from "./components/PadidaLogo"
// import AvatarSetup from "./components/AvatarSetup"
// import Homepage from "./components/Homepage"
// import Settings from "./components/Settings"

// function App() {
//   const [page, setPage] = useState("logo")
//   const [theme, setTheme] = useState(() => {
//     const settings = JSON.parse(localStorage.getItem("padida-settings") || "{}")
//     return settings.theme || "space"
//   })

//   useEffect(() => {
//     setTimeout(() => {
//       setPage("profile")
//     }, 8700)
//   }, [])

//   return (
//     <div className={`app theme-${theme}`}>
//       {theme === "space" && <Starsbackground />}
//       {page === "logo"     && <PadidaLogo />}
//       {page === "profile"  && <Profilesetup onNext={() => setPage("style")} />}
//       {page === "style"    && <AvatarSetup onNext={() => setPage("home")} />}
//       {page === "home"     && <Homepage
//         onSettings={() => setPage("settings")}
//         onhome={() => setPage("home")}
//         theme={theme}
//         onEditAvatar={() => setPage("style")}
//       />}
//       {page === "settings" && <Settings
//         onHome={() => setPage("home")}
//         onThemeChange={(t) => setTheme(t)}
//         theme={theme}
//       />}
//     </div>
//   )
// }

// export default App
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
    // After logo, check token
    const timer = setTimeout(async () => {
      const token = localStorage.getItem("padida-token")

      if (!token) {
        // No token → show login
        setPage("login")
        return
      }

      // Verify token with backend
      try {
        const res = await fetch("/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()

        if (!res.ok) {
          // Token invalid or expired → clear and show login
          localStorage.removeItem("padida-token")
          setPage("login")
          return
        }

        // Token valid → check where user left off
        if (data.isNewUser) {
          setPage("profile")
        } else if (!data.isAvatarComplete) {
          setPage("style")
        } else {
          setPage("home")
        }
      } catch (err) {
        // Network error → show login
        setPage("login")
      }
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