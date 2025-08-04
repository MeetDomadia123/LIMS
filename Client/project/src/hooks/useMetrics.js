import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

export function useMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      console.log('🔄 Starting metrics fetch...');
      
      // Force fallback for testing
      throw new Error('Testing fallback mode');
      
    } catch (err) {
      console.error('❌ Error (expected for testing):', err);
      
      // Fallback: Fetch components
      try {
        console.log('🔄 Trying fallback metrics...');
        const componentsResponse = await fetch('http://localhost:3001/api/components', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        console.log('📡 Components response status:', componentsResponse.status);
        
        if (componentsResponse.ok) {
          const componentsData = await componentsResponse.json();
          console.log('📊 Raw components data:', componentsData);
          
          const components = Array.isArray(componentsData) ? componentsData : (componentsData.components || []);
          
          const fallbackMetrics = {
            summary: {
              total_components: components.length,
              low_stock_count: components.filter(c => c.quantity <= 10).length,
              transactions_24h: 0,
              total_users: 1
            },
            componentStats: components
          };
          
          console.log('✅ Fallback metrics created:', fallbackMetrics);
          setMetrics(fallbackMetrics);
          setError(null);
        }
      } catch (fallbackErr) {
        console.error('❌ Fallback failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 useMetrics useEffect triggered');
    fetchMetrics();
  }, []);

  return { metrics, loading, error, refetch: fetchMetrics };
}