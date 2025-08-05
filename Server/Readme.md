# 🚀 LIMS Backend (Node.js + PostgreSQL)

Welcome to the backend server for the **Laboratory Inventory Management System (LIMS)** — a smart solution for tracking electronics lab components, designed for the A-1 Launchpad 2025 challenge.

---

## 🧰 Tech Stack

- ⚙️ **Node.js** (ESM)
- 🚀 **Express.js** - Web framework
- 🛢 **PostgreSQL** - Relational DB
- 🔐 **JWT** - Secure authentication
- 🔑 **bcrypt** - Password hashing
- 🌿 **dotenv** - Environment variable management

---

## 📁 Folder Structure

```
server/
├── controllers/        # Auth, component, and transaction logic
├── routes/             # API route definitions
├── middleware/         # JWT auth middleware
├── db/                 # PostgreSQL DB pool setup
├── .env                # Secrets & credentials
└── server.js           # Entry point
```

---

## ⚙️ Setup Instructions

```bash
# Navigate to the backend folder
cd server

# Install dependencies
npm install

# Start the server
node server.js
```

---

## 🗃️ Database Tables

- `users`
- `components`
- `transactions`

Each table is linked through foreign keys and constraints to ensure relational consistency.

---

## 🔐 Auth Routes

| Route            | Method | Description               |
|------------------|--------|---------------------------|
| `/api/login`     | POST   | User login                |
| `/api/signup`    | POST   | User registration         |
| `/api/protected` | GET    | Test protected route (JWT)|

Use `Authorization: Bearer <token>` for all secure routes.

---

## 📦 Component APIs

| Route                                | Method | Description              |
|--------------------------------------|--------|--------------------------|
| `/api/components`                    | GET    | Get all/search components|
| `/api/components`                    | POST   | Add new component        |
| `/api/components/:id`               | PUT    | Update component info    |
| `/api/components/:id/history`       | GET    | Get component log        |

---

## 🔁 Transaction API

| Route               | Method | Description               |
|---------------------|--------|---------------------------|
| `/api/transactions` | POST   | Inward/Outward movement   |

Automatically updates stock level & `last_moved`.

---

## 📊 Grafana Integration

LIMS is Grafana-ready! Connect PostgreSQL as a data source and build dashboards with queries like:

- **Low stock**:
```sql
SELECT * FROM components WHERE quantity < critical_threshold;
```

- **Stale components**:
```sql
SELECT * FROM components WHERE last_moved < NOW() - INTERVAL '60 days';
```

- **Daily movements**:
```sql
SELECT DATE(timestamp), COUNT(*) FROM transactions GROUP BY 1;
```

---

## 📬 Contact & Team

Developed with ❤️ by the LIMS Team at A-1 Launchpad 2025.

Feel free to explore the [frontend](../frontend) and [outerPage](../outerPage) for more.

---
