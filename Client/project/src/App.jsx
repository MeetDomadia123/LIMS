import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { mockAuth } from './utils/mockAuth';
import Toast from './components/Toast';
import Navbar from './components/Navbar';
import PrivateRoute from './routes/PrivateRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import LabDashboard from './pages/dashboards/LabDashboard';
import ResearchDashboard from './pages/dashboards/ResearchDashboard';
import EngineerDashboard from './pages/dashboards/EngineerDashboard';
import Inventory from './pages/Inventory';
import QRScanTransaction from './pages/QRScanTransaction';

function App() {
  const user = mockAuth.getCurrentUser();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar />}
        
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={user ? <Navigate to={getDashboardPath(user.role)} replace /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to={getDashboardPath(user.role)} replace /> : <Signup />} 
          />

          {/* Private Routes - Admin */}
          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />

          {/* Private Routes - Lab Technician */}
          <Route 
            path="/lab/dashboard" 
            element={
              <PrivateRoute allowedRoles={['lab-technician']}>
                <LabDashboard />
              </PrivateRoute>
            } 
          />

          {/* Private Routes - Researcher */}
          <Route 
            path="/research/dashboard" 
            element={
              <PrivateRoute allowedRoles={['researcher']}>
                <ResearchDashboard />
              </PrivateRoute>
            } 
          />

          {/* Private Routes - Manufacturing Engineer */}
          <Route 
            path="/engineer/dashboard" 
            element={
              <PrivateRoute allowedRoles={['manufacturing-engineer']}>
                <EngineerDashboard />
              </PrivateRoute>
            } 
          />

          {/* Shared Private Routes */}
          <Route 
            path="/inventory" 
            element={
              <PrivateRoute allowedRoles={['admin', 'researcher']}>
                <Inventory />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/transaction/qr" 
            element={
              <PrivateRoute allowedRoles={['admin', 'lab-technician', 'manufacturing-engineer']}>
                <QRScanTransaction />
              </PrivateRoute>
            } 
          />

          {/* Default redirect */}
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to={getDashboardPath(user.role)} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Catch all route */}
          <Route 
            path="*" 
            element={
              user ? (
                <Navigate to={getDashboardPath(user.role)} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>

        <Toast />
      </div>
    </Router>
  );
}

// Helper function to get dashboard path based on role
function getDashboardPath(role) {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'lab-technician': return '/lab/dashboard';
    case 'researcher': return '/research/dashboard';
    case 'manufacturing-engineer': return '/engineer/dashboard';
    default: return '/login';
  }
}

export default App;