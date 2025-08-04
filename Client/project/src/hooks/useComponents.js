import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { apiAuth } from '../services/apiAuth';


export function useComponents() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchComponents() {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.COMPONENTS, {
          headers: apiAuth.getHeaders()
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch components');
        }
        
        const data = await response.json();
        setComponents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchComponents();
  }, []);

  return { components, loading, error, refetch: fetchComponents };
}