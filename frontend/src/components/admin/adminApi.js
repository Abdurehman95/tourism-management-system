// adminApi.js — thin wrapper around backend /api endpoints (no mocks)
import { api } from '../../services/api';

// Simple helpers that delegate to the shared api client. Token is read from localStorage.

export const authenticate = async (email, password) => {
  // Reuse the regular auth endpoint; admin user_type is validated server-side
  return await api.post('/auth/login', { email, password });
};

export const signout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getSummary = async () => {
  // No summary endpoint exists; derive a lightweight summary from key lists
  const [users, sites, requests, payments] = await Promise.all([
    getUsers(),
    getSites(),
    getRequests(),
    getPayments(),
  ]);
  return {
    totalUsers: users?.length ?? 0,
    totalSites: sites?.length ?? 0,
    totalVisits: requests?.length ?? 0, // treating requests as visits for summary
    totalPayments: payments?.length ?? 0,
  };
};

export const getUsers = async () => {
  const res = await api.get('/admin/users');
  const payload = res?.data ?? res;

  // backend responds with { users: [...] }; normalize to plain array for callers
  let users = [];
  if (Array.isArray(payload)) users = payload;
  else if (Array.isArray(payload?.users)) users = payload.users;

  // Add display label so guides render as Site Agent in UI
  return users.map(u => ({
    ...u,
    user_type_label: (u?.user_type === 'guide') ? 'Site Agent' : u?.user_type,
  }));
};

export const getSites = async () => {
  const res = await api.get('/sites');
  const payload = res?.data ?? res;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export const getRequests = async () => {
  const res = await api.get('/requests');
  const payload = res?.data ?? res;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.requests)) return payload.requests;
  return [];
};

export const getPayments = async () => {
  const res = await api.get('/payments');
  const payload = res?.data ?? res;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.payments)) return payload.payments;
  return [];
};

export const createSite = async (site) => {
  return await api.post('/sites', site);
};

export const createUser = async (user) => {
  return await api.post('/admin/users', user);
};

export const toggleUserStatus = async (userId, isActive) => {
  return await api.put(`/admin/users/${userId}/status`, { is_active: isActive });
};

export const deleteUser = async (userId) => {
  return await api.delete(`/admin/users/${userId}`);
};

export const deleteSite = async (siteId) => {
  return await api.delete(`/sites/${siteId}`);
};

export const updateSite = async (site) => {
  return await api.patch(`/sites/${site.site_id}`, site);
};

export const updateSiteStatus = async (siteId, isApproved) => {
  if (isApproved) {
    // Approve the site using the dedicated approve endpoint
    return await api.patch(`/sites/${siteId}/approve`, {});
  } else {
    // Reject the site by updating both status and is_approved
    return await api.patch(`/sites/${siteId}`, {
      status: 'rejected',
      is_approved: 0  // Use 0 instead of false for database compatibility
    });
  }
};

export const approveRequest = async (requestId) => {
  return await api.patch(`/requests/${requestId}/approve`, {});
};

export const rejectRequest = async (requestId) => {
  return await api.patch(`/requests/${requestId}/reject`, {});
};

export const assignGuide = async (requestId, payload = {}) => {
  return await api.patch(`/requests/${requestId}/assign-guide`, payload);
};

export const verifyPayment = async (paymentId) => {
  return await api.patch(`/payments/${paymentId}/verify`, {});
};

export const changePassword = async (_username, currentPassword, newPassword) => {
  // Pass both current and new password to allow backend validation if implemented
  return await api.patch('/users/me', { password: newPassword, current_password: currentPassword });
};

export const updateProfile = async (_username, data) => {
  return await api.patch('/users/me', data);
};

export const getNotifications = async () => {
  const res = await api.get('/notifications');
  const payload = res?.data ?? res;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export const markNotificationRead = async (id) => {
  return await api.patch(`/notifications/${id}/read`, {});
};

export default {
  authenticate,
  signout,
  getSummary,
  getUsers,
  getSites,
  getRequests,
  getPayments,
  createSite,
  createUser,
  toggleUserStatus,
  deleteUser,
  deleteSite,
  updateSite,
  updateSiteStatus,
  approveRequest,
  rejectRequest,
  assignGuide,
  verifyPayment,
  changePassword,
  updateProfile,
  getNotifications,
  markNotificationRead,
};
