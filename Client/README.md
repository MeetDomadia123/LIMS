# 🌐 LIMS Frontend - React + Tailwind

Welcome to the **frontend interface** of the Electronics Lab Inventory Management System (LIMS), built with modern web technologies to provide a seamless, mobile-responsive user experience.

---

## 🖼️ Purpose
This UI acts as the control panel for:
- Managing electronic components
- Scanning QR codes to log inventory movement
- Viewing stock dashboards
- Chatting with the AI assistant to query inventory in real time

---

## ⚙️ Tech Stack

| Tool            | Purpose                          |
|------------------|----------------------------------|
| React 18+        | Frontend framework               |
| Tailwind CSS     | Styling with utility-first classes|
| Axios            | API communication                |
| html5-qrcode     | QR scanner integration           |
| Dialogflow       | AI chatbot widget                |
| Vite             | Lightning-fast bundler           |

---

## 📁 Project Structure
```
frontend/
|--Project
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── pages/             # Route-level views (Home, Dashboard, etc)
    │   ├── services/          # Axios API logic
    │   ├── hooks/             # Custom hooks (auth, scanner)
    │   └── App.jsx, main.jsx
    ├── public/
    ├── .env
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ✨ Features

### 1. 🧾 Authentication UI
- Login page for users/admins
- JWT token storage in localStorage

### 2. 📦 Inventory Dashboard
- View all components in table view
- Search and filter by part number or location

### 3. 📲 QR Code Scanner
- Built using `html5-qrcode`
- On scan → backend fetch → choose Inward/Outward → quantity → submit

### 4. 📉 Low Stock Alerts
- Conditional pop-ups when `quantity < critical_threshold`

### 5. 💬 AI Chatbot (Dialogflow)
- Embedded Dialogflow widget
- Users can ask inventory questions naturally

---

## 🔧 Setup Instructions
```bash
cd frontend
cd Project
npm install
npm run dev
```

### 📦 Environment Variables
Create a `.env` file:
```
VITE_API_URL=http://localhost:3001/api
VITE_CHATBOT_PROJECT_ID=your-dialogflow-id
```

---

## 🧪 Sample API Usage via Axios
```js
const res = await axios.get(`${import.meta.env.VITE_API_URL}/components`, {
  headers: { Authorization: `Bearer ${token}` }
});
```



## 🤝 Team Credits
- Frontend Developer: QR scanner, Tailwind UI, routing, chatbot
- Backend Developer: Auth, APIs, PostgreSQL, Grafana

---

## 🔗 Related Docs
- [📘 Backend README](../server/README.md)
- [📘 Project Overview](../README_Project_Overview.md)

---

Built with ❤️ for A-1 Launchpad 2025 Submission
