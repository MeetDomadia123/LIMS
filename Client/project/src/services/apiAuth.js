import { API_ENDPOINTS } from '../config/api.js';

class ApiAuth {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` })
    };
  }

  async login(email, password) {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      if (data.token) {
        this.setToken(data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during login');
    }
  }

  async register(userData) {
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Network error during registration');
    }
  }

  getCurrentUser() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (!token || !userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch {
      this.removeToken(); // Clear corrupted data
      return null;
    }
  }

  isAuthenticated() {
    return !!this.token && !!this.getCurrentUser();
  }

  logout() {
    this.removeToken();
  }
}

export const apiAuth = new ApiAuth();
export default apiAuth;