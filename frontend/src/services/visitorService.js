import { api } from './api';

export const visitorService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response.user;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', {
        ...userData,
        user_type: 'visitor'
      });
      return response.user;
    } catch (error) {
      throw error;
    }
  },

  getSites: async () => {
    try {
      const response = await api.get('/sites');
      // Handle { items: [...] } structure from backend
      const payload = response.data || response;
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.items)) return payload.items;
      return [];
    } catch (error) {
      console.error("Failed to fetch sites", error);
      return [];
    }
  },

  getSiteById: async (id) => {
    try {
      const response = await api.get(`/sites/${id}`);
      return response.data || response;
    } catch (error) {
      console.error("Failed to fetch site", error);
      return null;
    }
  },

  createRequest: async (requestData) => {
    return await api.post('/requests', requestData);
  },

  getMyRequests: async (userId) => {
    try {
      const response = await api.get(`/requests?visitor_id=${userId}`);
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.requests)) return response.requests;
      if (response && Array.isArray(response.data)) return response.data;
      return [];
    } catch (error) {
      console.error("Failed to fetch requests", error);
      return [];
    }
  },

  submitPayment: async (paymentData) => {
    return await api.post('/payments/chapa/create', paymentData);
  },

  getMyPayments: async (userId) => {
    try {
      const requests = await visitorService.getMyRequests(userId);
      if (!requests || requests.length === 0) return [];

      const payments = [];
      for (const req of requests) {
        try {
          const reqPayments = await api.get(`/payments?request_id=${req.request_id}`);
           if (Array.isArray(reqPayments)) {
             payments.push(...reqPayments);
           } else if (reqPayments.data) {
             payments.push(...reqPayments.data);
           } else if (reqPayments.payments) {
             payments.push(...reqPayments.payments);
           }
        } catch (e) {
          // Ignore errors
        }
      }
      return payments;
    } catch (error) {
      console.error("Failed to fetch payments", error);
      return [];
    }
  },
  
  getHistory: async (userId) => {
      return await visitorService.getMyRequests(userId);
  },

  submitFeedback: async (requestId, rating, comment) => {
    return await api.post('/reviews', { request_id: requestId, rating, comment });
  },

  updateProfile: async (user) => {
    return await api.patch('/users/me', user);
  },

  changePassword: async (userId, newPassword) => {
    return await api.patch('/users/me', { password: newPassword });
  }
};
