### ✅ `README.md` for Backend

```md
# 🔙 LIMS Backend (Node.js + PostgreSQL)

This is the backend server for the LIMS application.

## 📦 Tech Stack
- Node.js (ESM mode)
- Express.js
- PostgreSQL
- JSON Web Token (JWT)
- Bcrypt.js for password hashing
- dotenv

## 📁 Folder Structure
```
server/
├── controllers/         # Auth, Component logic
├── routes/              # Auth, Protected, Component, Transaction APIs
├── middleware/          # JWT middleware
├── db/                  # PostgreSQL pool setup
├── .env
└── server.js
```

## 🔧 Setup Instructions
```bash
cd server
npm install
node server.js
```

## 🗃️ Database Tables
- `users`
- `components`
- `transactions`

> SQL setup files are inside `server/db/schema.sql` (or paste here manually if not modularized).

## 🔐 Auth
- `/api/auth/login` — Get JWT token
- Use `Authorization: Bearer <token>` for all protected routes

## 🔁 Component APIs
- `POST /api/components`
- `GET /api/components`
- `PUT /api/components/:id`
- `GET /api/components/:id/history`

## 🔄 Transaction API
- `POST /api/transactions`

## 📊 Dashboard Support (for Grafana)
Just connect PostgreSQL as a data source and use custom SQL panels. Alert rules can be built on:
- Low stock: `quantity < critical_threshold`
- Stale stock: `last_moved < NOW() - interval '60 days'`
```
