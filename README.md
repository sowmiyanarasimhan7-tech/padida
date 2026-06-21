# 🪐 Padida

A space-themed (with Forest, Sea, and Desert options!) task management app that motivates you to get things done — built as a college project by a B.E AI/ML student.

Padida isn't just another to-do list. It uses **AI-generated notifications** that adapt their tone, character, and message based on what you're doing and how you want to be reminded — friendly, strict, sarcastic, motivational, or full Gen-Z energy.

---

## ✨ Features

- **Multiple Themes** — Space 🚀, Forest 🌲, Sea 🌊, Desert 🏜️, each with its own background and notification characters
- **Custom Avatar Builder** — pick your color, hat, and facial expression for your star character
- **Smart Task Scheduling** — add tasks with custom days, start/end times, and repeat presets (daily, weekdays, weekends)
- **AI-Generated Notifications** — powered by Claude, notifications are dynamically written based on:
  - the actual task you entered
  - the tone you selected (Friendly, Strict, Sarcastic, Motivated, Gen-Z)
  - the character delivering the message (astronaut, mermaid, fairy, etc. depending on theme)
  - automatic task category detection (study, health, work, social)
- **Three-Stage Notifications** — start reminder, halfway check-in, and end-of-task follow-up
- **Custom Notification Tones** — Web Audio API generated sound tones (Cosmic, Drop, Pulse, Glitch, Bubble, Crystal)
- **Snooze with Auto-Reschedule** — snoozing a task automatically shifts its start and end time
- **Task Search** — search tasks by name, time, or day
- **Task Alignment Options** — switch between List, Grid, and Compact views
- **Priority Sorting** — sort tasks by priority or by time
- **Edit & Delete Tasks** — full task management from the home screen
- **Email Reminders** — optional email notifications alongside push notifications
- **Streak Tracking** — keep your task streaks alive 🔥
- **User Authentication** — login/signup system with persistent sessions

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Service Workers (PWA push notifications)
- Web Audio API (custom notification tones)
- CSS animations

**Backend**
- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- Nodemailer (email notifications)

**AI**
- Claude (Anthropic API) — dynamic notification message generation

---

## 📂 Project Structure

```
padida/
├── frontend/          # React app (Vite)
│   ├── src/
│   │   ├── components/  # Homepage, Settings, AvatarSetup, Addtask, Login...
│   │   ├── assets/css/  # Stylesheets
│   │   ├── registerSW.js   # Notification scheduling logic
│   │   └── toneplayer.js   # Web Audio tone generator
│   └── public/
│       └── sw.js        # Service worker for push notifications
├── backend/           # Express API server
│   ├── routes/         # auth, notify
│   └── models/         # auth, subscription
└── package.json
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/padida.git
cd padida

# Install frontend dependencies
cd frontend
npm install
npm run dev

# Install backend dependencies (in a separate terminal)
cd backend
npm install
node server.js
```

You'll need a `.env` file in both `frontend` and `backend` with your own API keys (MongoDB URI, JWT secret, Anthropic API key, email credentials).

---

## 📸 Screenshots

*(Coming soon!)*

---

## 🎓 About

Built by a B.E AI/ML student as a hands-on project to explore full-stack development, service workers, push notifications, and AI integration with practical web development skills.

---

## 📝 License

This project is for educational purposes.