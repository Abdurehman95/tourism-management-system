import * as mock from './adminService.mock';
import * as api from './adminApi';

// Default to live API to ensure DB-backed flows; allow opt-in mock via env
const USE_MOCK = (process.env.REACT_APP_USE_MOCK_ADMIN || 'false') === 'true';

export const authenticate = (...args) => (USE_MOCK ? mock.authenticate(...args) : api.authenticate(...args));
export const signout = (...args) => (USE_MOCK ? mock.signout(...args) : api.signout(...args));
export const getSummary = (...args) => (USE_MOCK ? mock.getSummary(...args) : api.getSummary(...args));
export const getUsers = (...args) => (USE_MOCK ? mock.getUsers(...args) : api.getUsers(...args));
export const getSites = (...args) => (USE_MOCK ? mock.getSites(...args) : api.getSites(...args));
export const getRequests = (...args) => (USE_MOCK ? mock.getRequests(...args) : api.getRequests(...args));
export const getPayments = (...args) => (USE_MOCK ? mock.getPayments(...args) : api.getPayments(...args));
export const createSite = (...args) => (USE_MOCK ? mock.createSite(...args) : api.createSite(...args));
export const createUser = (...args) => (USE_MOCK ? mock.createUser(...args) : api.createUser(...args));
export const toggleUserStatus = (...args) => (USE_MOCK ? mock.toggleUserStatus(...args) : api.toggleUserStatus(...args));
export const deleteUser = (...args) => (USE_MOCK ? mock.deleteUser(...args) : api.deleteUser(...args));
export const deleteSite = (...args) => (USE_MOCK ? mock.deleteSite(...args) : api.deleteSite(...args));
export const updateSite = (...args) => (USE_MOCK ? mock.updateSite(...args) : api.updateSite(...args));
export const updateSiteStatus = (...args) => (USE_MOCK ? mock.updateSiteStatus(...args) : api.updateSiteStatus(...args));
export const approveRequest = (...args) => (USE_MOCK ? mock.approveRequest(...args) : api.approveRequest(...args));
export const rejectRequest = (...args) => (USE_MOCK ? mock.rejectRequest(...args) : api.rejectRequest(...args));
export const assignGuide = (...args) => (USE_MOCK ? mock.assignGuide(...args) : api.assignGuide(...args));
export const verifyPayment = (...args) => (USE_MOCK ? mock.verifyPayment(...args) : api.verifyPayment(...args));
export const changePassword = (...args) => (USE_MOCK ? mock.changePassword(...args) : api.changePassword(...args));
export const updateProfile = (...args) => (USE_MOCK ? mock.updateProfile(...args) : api.updateProfile(...args));
export const getNotifications = (...args) => (USE_MOCK ? mock.getNotifications(...args) : api.getNotifications(...args));
export const markNotificationRead = (...args) => (USE_MOCK ? mock.markNotificationRead(...args) : api.markNotificationRead(...args));

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
