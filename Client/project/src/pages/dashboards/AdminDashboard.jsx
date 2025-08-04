import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Package, AlertTriangle, TrendingUp, Clock, CheckCircle, XCircle, Bell } from 'lucide-react';
import { mockAuth } from '../../utils/mockAuth';
import { showToast } from '../../components/Toast';

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [stats, setStats] = useState({
    totalComponents: 1247,
    lowStockItems: 23,
    oldStockItems: 12,
    pendingApprovals: 0
  });

  const [usageData] = useState([
    { month: 'Jan', usage: 450 },
    { month: 'Feb', usage: 380 },
    { month: 'Mar', usage: 520 },
    { month: 'Apr', usage: 490 },
    { month: 'May', usage: 630 },
    { month: 'Jun', usage: 580 }
  ]);

  const [criticalComponents] = useState([
    { id: 1, name: 'Arduino Uno R3', currentStock: 5, threshold: 20, location: 'A1-B2' },
    { id: 2, name: 'Raspberry Pi 4', currentStock: 3, threshold: 15, location: 'A2-C1' },
    { id: 3, name: 'ESP32 DevKit', currentStock: 8, threshold: 25, location: 'B1-A3' },
    { id: 4, name: 'LM358 Op-Amp', currentStock: 12, threshold: 50, location: 'C2-B1' }
  ]);

  const [oldStock] = useState([
    { id: 1, name: 'Legacy PIC16F84A', lastUsed: '2023-09-15', quantity: 45, location: 'D3-C2' },
    { id: 2, name: 'Old LCD 16x2', lastUsed: '2023-08-22', quantity: 23, location: 'D1-A1' },
    { id: 3, name: 'Vintage 555 Timer', lastUsed: '2023-10-05', quantity: 67, location: 'C3-D2' }
  ]);

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = () => {
    const pending = mockAuth.getPendingUsers();
    setPendingUsers(pending);
    setStats(prev => ({ ...prev, pendingApprovals: pending.length }));
  };

  const handleApproveUser = (userId, userName) => {
    mockAuth.approveUser(userId);
    loadPendingUsers();
    showToast.success(`${userName} has been approved successfully`);
  };

  const handleRejectUser = (userId, userName) => {
    mockAuth.rejectUser(userId);
    loadPendingUsers();
    showToast.error(`${userName}'s request has been rejected`);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'lab-technician': return 'bg-blue-100 text-blue-800';
      case 'researcher': return 'bg-green-100 text-green-800';
      case 'manufacturing-engineer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRoleName = (role) => {
    return role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your inventory system and user approvals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Components</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalComponents.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Old Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.oldStockItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Usage Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Component Usage Trend</h2>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px' 
                  }}
                />
                <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Critical Components */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Critical Low Stock</h2>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="space-y-4">
              {criticalComponents.map((component) => (
                <div key={component.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{component.name}</h3>
                    <p className="text-sm text-gray-600">
                      Stock: {component.currentStock} / Threshold: {component.threshold}
                    </p>
                    <p className="text-xs text-gray-500">Location: {component.location}</p>
                  </div>
                  <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors">
                    Reorder
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Old Stock */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Old Stock (90+ days unused)</h2>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="space-y-4">
              {oldStock.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-xs text-gray-500">
                      Last used: {new Date(item.lastUsed).toLocaleDateString()} • {item.location}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                    Old Stock
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending User Approvals */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Pending User Approvals</h2>
              <Bell className="w-5 h-5 text-indigo-600" />
            </div>
            
            {pendingUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{user.fullName}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {formatRoleName(user.role)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          Aadhar: {user.aadharNumber} • Requested: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={() => handleApproveUser(user.id, user.fullName)}
                        className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectUser(user.id, user.fullName)}
                        className="flex items-center px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;