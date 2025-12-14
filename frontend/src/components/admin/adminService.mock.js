import { dataService } from '../../services/dataService';

const DEFAULT_ADMIN_PASSWORD = 'admin123';
const admin = {
  username: 'admin',
  password: DEFAULT_ADMIN_PASSWORD,
};

export function authenticate(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === admin.username && password === admin.password) {
        resolve({ token: 'mock-admin-token', user: { username: 'admin', name: 'Administrator', user_type: 'admin' } });
        return;
      }

      const user = dataService.findUser(username, password);
      if (user) {
        if (!user.is_active) {
          reject(new Error('Account is deactivated'));
          return;
        }
        const token = user.user_type === 'admin' ? 'mock-admin-token' : 'mock-researcher-token';
        resolve({ token, user });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 400);
  });
}

export function signout() {
  return new Promise((res) => setTimeout(res, 200));
}

export function getSummary() {
  return new Promise(resolve => setTimeout(() => resolve(dataService.getSummary()), 800));
}

export function getUsers() { return new Promise(resolve => setTimeout(() => resolve(dataService.getUsers()), 800)); }
export function getSites() { return new Promise(resolve => setTimeout(() => resolve(dataService.getSites()), 800)); }
export function getRequests() { return new Promise(resolve => setTimeout(() => resolve(dataService.getRequests()), 800)); }
export function getPayments() { return new Promise(resolve => setTimeout(() => resolve(dataService.getPayments()), 800)); }

export function createSite(site) {
  return Promise.resolve(dataService.addSite(site));
}

export function createUser(user) {
  return Promise.resolve(dataService.addUser(user));
}

export function toggleUserStatus(userId, isActive) {
  return Promise.resolve(dataService.updateUserStatus(userId, isActive));
}

export function deleteUser(userId) {
  return Promise.resolve(dataService.deleteUser(userId));
}

export function deleteSite(siteId) {
  return Promise.resolve(dataService.deleteSite(siteId));
}

export function updateSite(site) {
  return Promise.resolve(dataService.updateSite(site));
}

export function updateSiteStatus(siteId, isApproved) {
  const status = isApproved ? 'approved' : 'rejected';
  return Promise.resolve(dataService.updateSite({ site_id: siteId, is_approved: isApproved, status: status }));
}

export function approveRequest(requestId) {
  return Promise.resolve(dataService.updateRequestStatus(requestId, 'approved'));
}

export function rejectRequest(requestId) {
  return Promise.resolve(dataService.updateRequestStatus(requestId, 'rejected'));
}

export function assignGuide(requestId, payload) {
  const data = JSON.parse(localStorage.getItem('tourism_app_data'));
  const reqIndex = data.requests.findIndex(r => r.request_id === requestId);

  if (reqIndex === -1) {
    return Promise.reject(new Error('Request not found'));
  }

  const request = data.requests[reqIndex];
  request.assigned_guide_id = payload?.guide_id;
  // Mark as assigned so the correct site agent sees it in requests/schedule
  request.request_status = 'assigned';

  localStorage.setItem('tourism_app_data', JSON.stringify(data));
  return Promise.resolve(request);
}

export function verifyPayment(paymentId) {
  return Promise.resolve(dataService.updatePaymentStatus(paymentId, 'confirmed'));
}

export function changePassword(username, oldPassword, newPassword) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username !== admin.username) return reject(new Error('User not found'));
      if (oldPassword !== admin.password) return reject(new Error('Old password incorrect'));
      admin.password = newPassword;
      resolve({ ok: true });
    }, 300);
  });
}

export function updateProfile(username, data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username !== admin.username) return reject(new Error('User not found'));
      if (data.name) {
        // admin.name = data.name; 
      }
      resolve({ ok: true, user: { ...admin, ...data } });
    }, 300);
  });
}

export function getNotifications() {
  return Promise.resolve([
    { notification_id: 1, title: 'Mock Notification', message: 'This is a mock notification', type: 'info', is_read: 0, created_at: new Date().toISOString() }
  ]);
}

export function markNotificationRead(id) {
  return Promise.resolve({ success: true });
}

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
  deleteSite,
  approveRequest,
  rejectRequest,
  assignGuide,
  verifyPayment,
  changePassword,
  updateProfile,
  getNotifications,
  markNotificationRead,
};
