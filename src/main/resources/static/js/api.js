/**
 * Blood Donor Finder System - Centralized API Service
 */

const API = {
  BASE_URL: '/api',

  getToken() {
    return localStorage.getItem('blood_finder_token');
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('blood_finder_token', token);
    } else {
      localStorage.removeItem('blood_finder_token');
    }
  },

  getUser() {
    const userJson = localStorage.getItem('blood_finder_user');
    return userJson ? JSON.parse(userJson) : null;
  },

  setUser(user) {
    if (user) {
      localStorage.setItem('blood_finder_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('blood_finder_user');
    }
  },

  clearAuth() {
    localStorage.removeItem('blood_finder_token');
    localStorage.removeItem('blood_finder_user');
  },

  async request(endpoint, options = {}) {
    const url = `${this.BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          if (token) {
            this.clearAuth();
            window.dispatchEvent(new CustomEvent('auth:expired'));
          }
        }
        const errorMsg = data?.message || data?.error || `HTTP Error ${response.status}`;
        const error = new Error(errorMsg);
        error.details = data?.details || null;
        error.status = response.status;
        throw error;
      }

      return data;
    } catch (err) {
      console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, err);
      throw err;
    }
  },

  // HTTP Helper methods
  get(endpoint, params = {}) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    }
    const queryString = query.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  patch(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};
