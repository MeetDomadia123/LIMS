LIMS - Laboratory Inventory Management System
A comprehensive web-based Laboratory Inventory Management System built with React.js frontend and Node.js backend, featuring role-based access control, real-time inventory tracking, and user approval workflows.

🎯 Project Overview
LIMS is a modern inventory management solution designed for laboratories, research facilities, and manufacturing environments. It provides multi-role access control, real-time inventory tracking, and comprehensive user management capabilities.

✨ Features
🔐 Authentication & Authorization
✅ Multi-role system: Admin, Lab Technician, Researcher, Manufacturing Engineer
✅ JWT-based authentication with secure token management
✅ User registration with admin approval workflow
✅ Role-based dashboard access control

📊 Dashboard & Analytics
✅ Real-time metrics - Component counts, low stock alerts
✅ Role-specific dashboards for different user types
✅ Live inventory statistics with automatic refresh
✅ Critical low stock monitoring

📦 Inventory Management
✅ Complete component catalog with search and filtering
✅ Real-time stock levels and location tracking
✅ Low stock threshold alerts
✅ Component details with quantities and specifications

👥 User Management
✅ Admin user approval system
✅ Pending registration requests management
✅ User role assignment and status tracking
✅ Registration request approval/rejection

🛠 Additional Features
✅ QR Code scanning for transactions
✅ Responsive design for all devices
✅ Toast notifications for user feedback
✅ Professional UI/UX with modern styling

🏗️ System Architecture
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React.js)    │◄──►│   (Node.js)     │◄──►│  (PostgreSQL)   │
│   Port: 5173    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘


📂 Project Structure

LIMS/
├── Client/project/                 # Frontend React Application
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Navbar.jsx        # Navigation component
│   │   │   ├── Toast.jsx         # Notification system
│   │   │   └── UserApprovals.jsx # Admin approval interface
│   │   ├── pages/                # Main application pages
│   │   │   ├── Login.jsx         # User authentication
│   │   │   ├── Signup.jsx        # User registration
│   │   │   ├── AdminDashboard.jsx # Admin dashboard
│   │   │   ├── Inventory.jsx     # Inventory management
│   │   │   └── dashboards/       # Role-specific dashboards
│   │   ├── hooks/                # Custom React hooks
│   │   │   └── useMetrics.js     # Dashboard metrics hook
│   │   ├── services/             # API services
│   │   │   └── apiAuth.js        # Authentication service
│   │   ├── routes/               # Route protection
│   │   │   └── PrivateRoute.jsx  # Protected route wrapper
│   │   └── config/               # Configuration files
│   │       └── api.js            # API endpoints
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite configuration
├── Server/                        # Backend Node.js Application
│   ├── controllers/              # Business logic controllers
│   │   ├── authController.js     # Authentication logic
│   │   ├── componentController.js # Inventory management
│   │   └── registrationController.js # User registration
│   ├── middleware/               # Express middleware
│   │   └── authMiddleware.js     # JWT token verification
│   ├── routes/                   # API route definitions
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── componentRoutes.js    # Inventory API routes
│   │   └── registrationRoutes.js # User management routes
│   ├── config/                   # Server configuration
│   │   └── database.js           # PostgreSQL connection
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Main server file
└── Database/                      # Database schema and setup
    ├── schema.sql                # Database tables creation
    └── sample_data.sql           # Initial test data
