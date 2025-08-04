import React, { useState, useEffect } from 'react';
import { Search, Package, MapPin, Filter } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { apiAuth } from '../services/apiAuth';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Microcontroller', label: 'Microcontroller' },
    { value: 'LED', label: 'LED' },
    { value: 'Resistor', label: 'Resistor' },
    { value: 'Prototyping', label: 'Prototyping' },
    { value: 'Wiring', label: 'Wiring' }
  ];

  const getStockStatus = (quantity, threshold) => {
    if (quantity <= threshold) {
      return { status: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' };
    } else if (quantity <= threshold * 1.5) {
      return { status: 'low', label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'normal', label: 'In Stock', color: 'bg-green-100 text-green-800' };
    }
  };

  // Fetch components from backend
  useEffect(() => {
    async function fetchComponents() {
      try {
        setLoading(true);
        console.log('🔄 Fetching components from:', API_ENDPOINTS.COMPONENTS);
        
        const response = await fetch(API_ENDPOINTS.COMPONENTS, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Raw API response:', data);
        
        // Extract components array from response
        const componentsArray = Array.isArray(data) ? data : (data.components || []);
        console.log('✅ Components array:', componentsArray);
        
        setComponents(componentsArray);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching components:', err);
        setError(err.message);
        setComponents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchComponents();
  }, []);

  // Filter components
  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || component.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading components...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Error loading components: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Rest of your existing JSX (search, filters, component cards) stays the same...
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your existing header, search, and component display JSX */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Inventory Management</h1>
        
        {/* Debug info */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            📊 Showing {components.length} total components, {filteredComponents.length} after filters
          </p>
        </div>

        {/* Your existing search and filter JSX */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-2">Search and explore available components</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by component name or part number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="lg:w-64">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredComponents.length} of {components.length} components
                {searchTerm && (
                  <span className="ml-2 font-medium">
                    for "{searchTerm}"
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map((component) => {
              const stockStatus = getStockStatus(component.quantity, component.threshold);
              return (
                <div key={component.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {component.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Part #: {component.partNumber}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                      {stockStatus.label}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {component.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">Available Quantity</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {component.quantity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">Storage Location</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {component.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">Low Stock Threshold</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {component.threshold}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Stock Level</span>
                      <span>{Math.round((component.quantity / (component.threshold * 2)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          stockStatus.status === 'critical' ? 'bg-red-500' :
                          stockStatus.status === 'low' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (component.quantity / (component.threshold * 2)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredComponents.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No components found</h3>
              <p className="text-gray-500">
                Try adjusting your search terms or category filter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;