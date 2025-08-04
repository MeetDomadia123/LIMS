const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  
  // Components
  COMPONENTS: 'http://localhost:3001/api/components',
  COMPONENT_BY_ID: (id) => `${API_BASE_URL}/components/${id}`,
  
  // Metrics
  COMPREHENSIVE_METRICS: 'http://localhost:3001/api/metrics/comprehensive',
  SIMPLE_METRICS: `${API_BASE_URL}/metrics/simple`,
  
  // Chatbot
  CHATBOT_QUERY: `${API_BASE_URL}/chatbot/query`,
  
  // Transactions
  TRANSACTIONS: `${API_BASE_URL}/transactions`,
  
  // Health
  HEALTH: `${API_BASE_URL}/health`
};

export default API_BASE_URL;