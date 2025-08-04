import React, { useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, Users, RefreshCw } from 'react-feather';
import { useMetrics } from '../hooks/useMetrics.js';

const AdminDashboard = () => {
  console.log('🔍 AdminDashboard component started');
  
  const { metrics, loading, error, refetch } = useMetrics();
  
  console.log('🔍 Hook returned:', { metrics, loading, error });

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard metrics...');
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Error loading dashboard: {error}</div>
          <button 
            onClick={refetch}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use real metrics data
  const stats = [
    {
      title: 'Total Components',
      value: metrics?.summary?.total_components || 0,
      change: '+2.5%',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Low Stock Items',
      value: metrics?.summary?.low_stock_count || 0,
      change: '-1.2%',
      icon: AlertTriangle,
      color: 'bg-yellow-500'
    },
    {
      title: 'Recent Transactions',
      value: metrics?.summary?.transactions_24h || 0,
      change: '+12.3%',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Total Users',
      value: metrics?.summary?.total_users || 1,
      change: '+5.1%',
      icon: Users,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your inventory system and user approvals</p>
          </div>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Debug Info */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            📊 Real-time data: {metrics?.summary?.total_components || 0} components loaded
            {metrics && (
              <span className="ml-4">
                🔴 {metrics.summary.low_stock_count} low stock
              </span>
            )}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-green-600 text-sm mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Usage Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Component Usage Trend</h3>
            <div className="text-center py-8 text-gray-500">
              Chart data from real metrics coming soon...
            </div>
          </div>

          {/* Low Stock Components */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Low Stock</h3>
            <div className="space-y-3">
              {metrics?.componentStats
                ?.filter(component => component.quantity <= component.low_stock_threshold)
                ?.map((component, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <h4 className="font-medium text-gray-900">{component.name}</h4>
                      <p className="text-sm text-gray-600">
                        Stock: {component.quantity} / Threshold: {component.low_stock_threshold}
                      </p>
                      {component.location && (
                        <p className="text-xs text-gray-500">Location: {component.location}</p>
                      )}
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                      Reorder
                    </button>
                  </div>
                )) || (
                <div className="text-center py-4 text-gray-500">
                  No low stock items found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;