import React, { useState } from 'react';
import { Search, Package, BookOpen, TrendingUp } from 'lucide-react';

const ResearchDashboard = () => {
  const [recentSearches] = useState([
    { id: 1, query: 'Arduino sensors', timestamp: '2024-01-15T11:30:00Z' },
    { id: 2, query: 'Raspberry Pi GPIO', timestamp: '2024-01-15T10:15:00Z' },
    { id: 3, query: 'ESP32 modules', timestamp: '2024-01-14T16:45:00Z' },
    { id: 4, query: 'Power supply circuits', timestamp: '2024-01-14T14:20:00Z' }
  ]);

  const [favoriteComponents] = useState([
    { id: 1, name: 'Arduino Uno R3', stock: 45, location: 'A1-B2' },
    { id: 2, name: 'Raspberry Pi 4', stock: 23, location: 'A2-C1' },
    { id: 3, name: 'ESP32 DevKit', stock: 67, location: 'B1-A3' },
    { id: 4, name: 'LM358 Op-Amp', stock: 234, location: 'C2-B1' }
  ]);

  const [stats] = useState({
    searchesPerformed: 47,
    componentsViewed: 156,
    bookmarkedItems: 23
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Research Dashboard</h1>
          <p className="text-gray-600 mt-2">Explore and manage inventory for your research projects</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Searches Performed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.searchesPerformed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Components Viewed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.componentsViewed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bookmarked Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bookmarkedItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.href = '/inventory'}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Inventory
            </button>
            <button className="flex items-center justify-center px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              <BookOpen className="w-5 h-5 mr-2" />
              View Bookmarks
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Searches */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Searches</h2>
            <div className="space-y-4">
              {recentSearches.map((search) => (
                <div key={search.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Search className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900">{search.query}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(search.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite Components */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Favorite Components</h2>
            <div className="space-y-4">
              {favoriteComponents.map((component) => (
                <div key={component.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{component.name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">Stock: {component.stock}</span>
                      <span className="text-sm text-gray-600">Location: {component.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      component.stock > 50 ? 'bg-green-100 text-green-800' :
                      component.stock > 20 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {component.stock > 50 ? 'In Stock' :
                       component.stock > 20 ? 'Low Stock' :
                       'Critical'}
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

export default ResearchDashboard;