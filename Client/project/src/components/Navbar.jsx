import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Settings } from 'lucide-react';
import { mockAuth } from '../utils/mockAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = mockAuth.getCurrentUser();

  const handleLogout = () => {
    mockAuth.logout();
    navigate('/login');
  };

  if (!user) return null;

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'lab-technician': return 'bg-blue-100 text-blue-800';
      case 'researcher': return 'bg-green-100 text-green-800';
      case 'manufacturing-engineer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDashboardPath = () => {
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'lab-technician': return '/lab/dashboard';
      case 'researcher': return '/research/dashboard';
      case 'manufacturing-engineer': return '/engineer/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to={getDashboardPath()} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Inventory Control</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {user.role === 'admin' && (
                <>
                  <Link 
                    to="/admin/dashboard" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/admin/dashboard' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/inventory" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/inventory' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Inventory
                  </Link>
                  <Link
                    to="/admin/user-approvals"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    User Approvals
                  </Link>
                </>
              )}

              {user.role === 'researcher' && (
                <Link 
                  to="/inventory" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/inventory' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Inventory
                </Link>
              )}

              {(user.role === 'lab-technician' || user.role === 'manufacturing-engineer') && (
                <Link 
                  to="/transaction/qr" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/transaction/qr' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  QR Scanner
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user.fullName}</span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                {user.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;