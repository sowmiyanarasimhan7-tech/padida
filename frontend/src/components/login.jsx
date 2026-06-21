// import { useState, useEffect } from "react"
// import "../assets/css/login.css"

// function Login({ onLoginSuccess }) {
//   const [showPassword, setShowPassword] = useState(false)
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [isRegister, setIsRegister] = useState(false)
//   const [error, setError] = useState("")
//   const [loading, setLoading] = useState(false)
  
//   // Pre-fill email if returning user
//   useEffect(() => {
//     const savedEmail = localStorage.getItem("padida-email")
//     if (savedEmail) setEmail(savedEmail)
//   }, [])

//   const handleSubmit = async () => {
//     setError("")
//     if (!email || !password) {
//       setError("Please enter email and password")
//       return
//     }
//     setLoading(true)
//     try {
//       const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login"
//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password })
//       })
//       const data = await res.json()
//       if (!res.ok) {
//         setError(data.message || "Something went wrong")
//         setLoading(false)
//         return
//       }
//       // Save token and email
//       localStorage.setItem("padida-token", data.token)
//       localStorage.setItem("padida-email", email)

//       onLoginSuccess({
//         isNewUser: data.isNewUser,
//         isAvatarComplete: data.isAvatarComplete
//       })
//     } catch (err) {
//       setError("Cannot connect to server")
//     }
//     setLoading(false)
//   }

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h1 className="login-title">PADIDA</h1>
//         <p className="login-subtitle">{isRegister ? "Create your account" : "Welcome back"}</p>

//         <div className="login-fields">
//   <input
//     className="login-input"
//     type="email"
//     placeholder="Email address"
//     value={email}
//     onChange={e => setEmail(e.target.value)}
//     onKeyDown={e => e.key === "Enter" && handleSubmit()}
//   />
//   <div className="password-wrapper">
//     <input
//       className="login-input"
//       type={showPassword ? "text" : "password"}
//       placeholder="Password"
//       value={password}
//       onChange={e => setPassword(e.target.value)}
//       onKeyDown={e => e.key === "Enter" && handleSubmit()}
//     />
//     <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
//       {showPassword ? "🙈" : "👁️"}
//     </span>
//   </div>
// </div>

//         {error && <p className="login-error">{error}</p>}

//         <button className="login-btn" onClick={handleSubmit} disabled={loading}>
//           {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
//         </button>

//         <p className="login-toggle">
//           {isRegister ? "Already have an account?" : "New to Padida?"}{" "}
//           <span onClick={() => { setIsRegister(!isRegister); setError("") }}>
//             {isRegister ? "Login" : "Sign up"}
//           </span>
//         </p>
//       </div>
//     </div>
//   )
// }

// export default Login
import { useState, useEffect } from "react"
import "../assets/css/login.css"

// ─── Add this function outside the component ───────────────
async function subscribeToPush(userId) {
  try {
    const reg = await navigator.serviceWorker.ready

    const existing = await reg.pushManager.getSubscription()
    if (existing) await existing.unsubscribe() // clear old one if any

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: "BNaA2v9zv8R5leN3Uc20W1yqMAkyjLBIYrjlhiAdMJfAVFwhiYiH2T-to7zg5Mi_adnTv5qu0GduSSgnIXzvoUI" // paste your public key
    })

    await fetch("/api/notify/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, subscription })
    })

    console.log("Push subscription saved!")
  } catch (err) {
    console.error("Push subscription failed:", err)
  }
}
// ───────────────────────────────────────────────────────────

function Login({ onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const savedEmail = localStorage.getItem("padida-email")
    if (savedEmail) setEmail(savedEmail)
  }, [])

  const handleSubmit = async () => {
    setError("")
    if (!email || !password) {
      setError("Please enter email and password")
      return
    }
    setLoading(true)
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login"
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Something went wrong")
        setLoading(false)
        return
      }

      localStorage.setItem("padida-token", data.token)
      localStorage.setItem("padida-email", email)

      // ─── Add these 2 lines after saving token ───────────
      const userId = data.userId
      await subscribeToPush(userId)
      // ────────────────────────────────────────────────────

      onLoginSuccess({
        isNewUser: data.isNewUser,
        isAvatarComplete: data.isAvatarComplete
      })
    } catch (err) {
      setError("Cannot connect to server")
    }
    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">PADIDA</h1>
        <p className="login-subtitle">{isRegister ? "Create your account" : "Welcome back"}</p>

        <div className="login-fields">
          <input
            className="login-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
          <div className="password-wrapper">
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🐵" : "🙈"}
            </span>
          </div>
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="login-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
        </button>

        <p className="login-toggle">
          {isRegister ? "Already have an account?" : "New to Padida?"}{" "}
          <span onClick={() => { setIsRegister(!isRegister); setError("") }}>
            {isRegister ? "Login" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login