🔮 Future Implementation
Here’s how LIMS can evolve beyond the MVP:

1. 📦 Automatic Reordering via Supplier APIs
Integrate with vendor APIs (Mouser, Digi-Key, RS) to auto-replenish low stock components.

Trigger API call/email when quantity drops below critical_threshold.

2. 📲 Progressive Web App (PWA)
Convert the frontend into a PWA for mobile devices.

Lab assistants can use it like an app for scanning, issuing, and tracking components offline.

3. 🧠 ML-Based Stock Forecasting
Use historical transaction data to predict stock needs for each project semester or exam season.

Avoid overstocking/understocking with demand prediction charts.

4. 🧾 PDF Export + Barcode Printing
Auto-generate component usage logs as PDFs for monthly audits.

Export and print barcode labels directly from the UI.

5. 🔗 Project Linkage & Accountability
Log components against specific projects, teams, or students.

Track who used what — useful for billing or evaluation.

6. 🔐 Role-Based UI Views
Admins: Full access to logs, dashboard, and users.

Lab Assistants: Issue/return permissions only.

Students: View-only access through chatbot or simplified UI.

7. 🔊 Real-Time Notifications
Integrate push notifications (via OneSignal or Firebase Cloud Messaging).

Notify admins on low stock, expired stock, or repeated failed scans.

8. ☁️ Cloud-Based Multi-Lab Deployment
Deploy LIMS to support multiple departments or branches.

Add lab-level separation in the database and UI.
