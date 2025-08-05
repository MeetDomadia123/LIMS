# 📘 Project Overview: Electronics Lab Inventory Management System (LIMS)

Welcome to the official documentation for our submission to the **A-1 Launchpad 2025 Case Study**.

This project addresses the challenge of managing and tracking electronic components in a lab environment, replacing traditional error-prone manual logs with a modern, intelligent, and user-friendly system.

---

## 💡 Problem Statement
> Manual tracking of electronics inventory is prone to errors, time-consuming, and lacks real-time insight.

Labs often face:
- Stockouts due to inaccurate logs
- Lack of accountability
- Wastage from expired/unused components
- Delays in project execution

---

## 🧠 Our Solution: Smart LIMS

A full-stack digital solution built with modern technologies and enhanced by automation and analytics.

### 🔑 Key Features

1. **📦 Component Management**  
   Admins can add, update, and search for components with detailed metadata including part number, quantity, location, and manufacturer.

2. **📲 QR-Based Movement Logging**  
   Each component bin is labeled with a QR code. Using a built-in scanner:
   - Scan the QR code
   - Choose **Inward** (add stock) or **Outward** (issue component)
   - Enter quantity and reason
   - Inventory auto-updates in real time

3. **🧾 Transaction History**  
   Every action is logged in a `transactions` table, tracking who did what, when, and why. This ensures complete traceability and audit-readiness.

4. **📊 Grafana Dashboard Integration**  
   Real-time analytics and alerting with Grafana:
   - Low stock alerts
   - Daily/weekly issue trends
   - Old unused stock listing
   - Visualized usage patterns

5. **💬 Chatbot Assistant (Dialogflow)**  
   For non-technical users like students/researchers:
   - Ask: "Do we have Arduino Uno?"
   - Bot replies with quantity and location
   - Reduces learning curve for users unfamiliar with the dashboard

---

## 🧱 Tech Stack

| Layer        | Technologies                             |
|--------------|-------------------------------------------|
| Frontend     | React, Tailwind CSS, html5-qrcode        |
| Backend      | Node.js (ESM), Express, JWT, PostgreSQL   |
| Monitoring   | Grafana with PostgreSQL plugin            |
| AI Chatbot   | Dialogflow (Google NLP)                   |
| Deployment   | Vercel (frontend), Railway/Render (backend)|

---

## 🌈 What Makes It Unique?

- ✅ QR-based stock logging (no manual form filling)
- ✅ Full historical audit trail per component
- ✅ Visual dashboard + email/popup alerts
- ✅ AI assistant for natural-language access to inventory
- ✅ Scalable PostgreSQL schema with future-proofing

---

## 📌 Status: MVP Complete
- Backend secured with JWT
- Fully functional component and transaction APIs
- Postman-tested routes with role-based protection
- QR scanner working in browser
- Chatbot webhook integration pending (optional)

---


## 👥 Team Contribution
- **Backend Lead**: APIs, Auth, PostgreSQL, Grafana setup
- **Frontend Developer**: UI, QR integration, React structure

---
---
# 🔮 Future Implementation

The current version of LIMS provides a solid MVP foundation. Here’s how the platform can be scaled and enhanced in future iterations:

---

## 📦 1. Automatic Reordering via Supplier APIs
- Integrate with external supplier APIs (e.g., Digi-Key, Mouser)
- Trigger reordering when `quantity < critical_threshold`
- Enable tracking of order status and expected delivery

---

## 📲 2. Progressive Web App (PWA) Mode
- Make the frontend PWA-compatible for mobile usability
- Allow lab technicians to scan QR codes using smartphones
- Enable offline access to component logs and sync when online

---

## 📊 3. ML-Based Stock Forecasting
- Analyze historical transaction logs to predict demand
- Forecast usage per semester or academic cycle
- Suggest restocking plans in advance

---

## 🧾 4. PDF Reports and Barcode Printing
- Export monthly usage and stock reports as downloadable PDFs
- Automatically generate and print barcode labels for bins

---

## 🔗 5. Project-Based Component Tracking
- Assign transactions to projects or student teams
- Enable component accountability and reporting
- View component usage by project for analysis or billing

---

## 🔐 6. Role-Based Dashboard Views
- Customize views based on roles:
  - Admin: Full access
  - Lab Assistant: Issue and return rights only
  - Student: View-only or chatbot queries

---

## 🔔 7. Real-Time Notification System
- Use WebSockets or FCM to push alerts
- Notify about:
  - Low stock levels
  - Inactivity of components (not used for months)
  - New transactions

---

## ☁️ 8. Cloud-Hosted Multi-Lab System
- Support for multiple departments/labs
- Lab-level data isolation
- Admin panel for super-admins to manage all labs

---

These future enhancements will help LIMS grow into a truly intelligent and autonomous inventory ecosystem.
---

## 📬 Contact
Created by passionate engineers at DJSCE, submitted for **A-1 Launchpad 2025**. 

For any queries or collaboration: meetdomadia201684@gmail.com

---

> "We built LIMS not just to manage components — but to make labs smarter, faster, and audit-ready."
