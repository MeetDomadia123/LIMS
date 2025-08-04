import React, { useState } from 'react';
import { QrCode, Package, TrendingDown, ArrowDownCircle } from 'lucide-react';

const EngineerDashboard = () => {
  const [recentTransactions] = useState([
    { id: 1, component: 'Arduino Uno R3', quantity: 15, reason: 'Production Batch A', timestamp: '2024-01-15T10:30:00Z' },
    { id: 2, component: 'Raspberry Pi 4', quantity: 8, reason: 'Prototype Development', timestamp: '2024-01-15T09:15:00Z' },
    { id: 3, component: 'ESP32 DevKit', quantity: 25, reason: 'Manufacturing Line B', timestamp: '2024-01-14T16:45:00Z' },
    { id: 4, component: 'LM358 Op-Amp', quantity: 50, reason: 'Quality Testing', timestamp: '2024-01-14T14:20:00Z' }
  ]);

  const [stats] = useState({
    itemsProcessed: 98,
    totalQuantityRemoved: 645,
    avgProcessingTime: '1.8 min'
  });

  const [productionBatches] = useState([
    { id: 'A001', name: 'Smart Home Sensors', componentsUsed: 45, status: 'In Progress' },
    { id: 'B002', name: 'IoT Weather Stations', componentsUsed: 32, status: 'Completed' },
    { id: 'C003', name: 'Automation Controllers', componentsUsed: 67, status: 'In Progress' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manufacturing Engineer Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage outward inventory for production and manufacturing</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Items Processed Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.itemsProcessed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Quantity Used</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuantityRemoved.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <QrCode className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgProcessingTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.href = '/transaction/qr'}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition-all"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Start QR Scanning
            </button>
            <button className="flex items-center justify-center px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              <ArrowDownCircle className="w-5 h-5 mr-2" />
              Manual Outward Entry
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Outward Transactions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Outward Transactions</h2>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{transaction.component}</h3>
                      <p className="text-sm text-gray-600 mt-1">Quantity Used: {transaction.quantity}</p>
                      <p className="text-sm text-gray-600">Reason: {transaction.reason}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Outward
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Production Batches */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Active Production Batches</h2>
            <div className="space-y-4">
              {productionBatches.map((batch) => (
                <div key={batch.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{batch.name}</h3>
                        <span className="text-sm text-gray-500">#{batch.id}</span>
                      </div>
                      <p className="text-sm text-gray-600">Components Used: {batch.componentsUsed}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      batch.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {batch.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineerDashboard;