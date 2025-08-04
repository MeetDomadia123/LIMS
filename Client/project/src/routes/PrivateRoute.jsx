import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { mockAuth } from '../utils/mockAuth';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = mockAuth.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to correct dashboard based on role
    const dashboardMap = {
      'admin': '/admin/dashboard',
      'lab-technician': '/lab/dashboard',
      'researcher': '/research/dashboard',
      'manufacturing-engineer': '/engineer/dashboard'
    };
    
    return <Navigate to={dashboardMap[user.role] || '/login'} replace />;
  }

  return children;
};

export default PrivateRoute;