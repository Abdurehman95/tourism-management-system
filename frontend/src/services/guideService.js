import { api } from './api';

export const guideService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      // Accept both 'guide' and 'site_agent' user types
      if (response.user.user_type !== 'guide' && response.user.user_type !== 'site_agent') {
        throw new Error('Not a guide/site agent account');
      }
      return response.user;
    } catch (error) {
      throw error;
    }
  },

  getAssignedRequests: async (guideId) => {
    try {
      const response = await api.get('/requests');
      // Backend returns { requests: [...] }
      const requests = Array.isArray(response)
        ? response
        : (response.requests || response.data || []);
      // Show requests:
      // 1. Assigned to this guide (any status)
      // 2. Or approved/assigned requests without a guide yet
      return requests.filter(r =>
        r.assigned_guide_id === guideId ||
        r.assigned_guide_id == guideId ||  // loose comparison for string/int
        ((r.request_status === 'approved' || r.request_status === 'assigned') && !r.assigned_guide_id)
      );
    } catch (error) {
      console.error("Failed to fetch requests", error);
      return [];
    }
  },

  updateRequestStatus: async (requestId, status, notes, guideId) => {
    // If guide is accepting, assign them to the request first
    if (status === 'accepted_by_guide' && guideId) {
      try {
        await api.patch(`/requests/${requestId}/assign-guide`, { assigned_guide_id: guideId });
      } catch (e) {
        console.error('Failed to assign guide', e);
      }
    }
    // Then update the status
    return await api.patch(`/requests/${requestId}/status`, { status, notes });
  },

  updateProfile: async (data) => {
    return await api.patch('/users/me', data);
  },

  changePassword: async (newPassword) => {
    return await api.patch('/users/me', { password: newPassword });
  }
};
