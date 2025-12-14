const STORAGE_KEY = 'tourism_app_data';

const initialData = {
  users: [
    { user_id: 1, username: 'admin', password: 'admin123', first_name: 'Admin', last_name: 'User', email: 'admin@example.com', user_type: 'admin', is_active: true }
  ],
  sites: [
    { site_id: 1, site_name: 'Lalibela', location: 'Lalibela, Amhara', description: 'Rock-hewn churches.', price: 500, guide_fee: 200, image: 'https://whc.unesco.org/uploads/thumbs/site_0018_0016-1000-667-20151104173458.jpg', is_approved: true },
    { site_id: 2, site_name: 'Simien Mountains', location: 'Gondar, Amhara', description: 'Spectacular landscapes.', price: 300, guide_fee: 150, image: 'https://simienpark.org/wp-content/uploads/2017/10/simien-landscape-small.jpg', is_approved: true },
    { site_id: 3, site_name: 'Axum Obelisk', location: 'Axum, Tigray', description: 'Ancient obelisks.', price: 400, guide_fee: 180, image: 'https://media.istockphoto.com/id/186914973/photo/obelisk-in-the-aksum-kingdom-ethiopia.jpg?s=612x612&w=0&k=20&c=xcINJxnz71uvfROg0uby9QrRlyNeQesLkWr5JLnXmGE=', is_approved: true }
  ],
  requests: [],
  payments: [],
  visits: []
};

const loadData = () => {
  const dataStr = localStorage.getItem(STORAGE_KEY);
  let data = dataStr ? JSON.parse(dataStr) : initialData;

  return data;
};

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const dataService = {
  getUsers: () => loadData().users,
  addUser: (user) => {
    const data = loadData();
    const exists = data.users.some(u => 
      (user.email && u.email === user.email) || 
      (user.username && u.username === user.username)
    );
    if (exists) {
      throw new Error('User with this email or username already exists');
    }

    let type = user.user_type || 'visitor';
    if (type === 'admin') type = 'visitor';

    const username = user.username || user.email || `user${data.users.length + 1}`;
    const password = user.password || 'password123';

    const newUser = { 
      ...user, 
      username,
      password,
      user_id: data.users.reduce((max, u) => Math.max(max, u.user_id || 0), 0) + 1, 
      user_type: type, 
      is_active: true 
    };
    data.users.push(newUser);
    saveData(data);
    return newUser;
  },
  findUser: (username, password) => {
    const users = loadData().users;
    return users.find(u => {
      const uName = u.username ? u.username.toLowerCase() : '';
      const uEmail = u.email ? u.email.toLowerCase() : '';
      const input = username ? username.toLowerCase() : '';
      
      return (uName === input || uEmail === input) && u.password === password;
    });
  },
  updateUserStatus: (userId, isActive) => {
    const data = loadData();
    const user = data.users.find(u => u.user_id === userId);
    if (user) {
      user.is_active = isActive;
      saveData(data);
    }
    return user;
  },
  deleteUser: (userId) => {
    const data = loadData();
    const index = data.users.findIndex(u => u.user_id === userId);
    if (index !== -1) {
      data.users.splice(index, 1);
      saveData(data);
      return true;
    }
    return false;
  },
  
  getSites: () => loadData().sites,
  addSite: (site) => {
    const data = loadData();
    const isApproved = site.hasOwnProperty('is_approved') ? site.is_approved : false;
    const maxId = data.sites.reduce((max, s) => Math.max(max, s.site_id || 0), 0);
    const newSite = { ...site, site_id: maxId + 1, is_approved: isApproved };
    data.sites.push(newSite);
    saveData(data);
    return newSite;
  },
  updateSite: (site) => {
    const data = loadData();
    const index = data.sites.findIndex(s => s.site_id === site.site_id);
    if (index !== -1) {
      data.sites[index] = { ...data.sites[index], ...site };
      saveData(data);
      return data.sites[index];
    }
    throw new Error('Site not found');
  },
  deleteSite: (id) => {
    const data = loadData();
    data.sites = data.sites.filter(s => s.site_id !== id);
    saveData(data);
    return true;
  },
  updateUser: (id, updates) => {
    const data = loadData();
    const user = data.users.find(u => u.user_id === id);
    if (user) {
      Object.assign(user, updates);
      saveData(data);
      return user;
    }
    throw new Error('User not found');
  },
  changePassword: (id, newPassword) => {
    const data = loadData();
    const user = data.users.find(u => u.user_id === id);
    if (user) {
      if (user.password === newPassword) {
        throw new Error('New password cannot be the same as the old password');
      }
      user.password = newPassword;
      saveData(data);
      return true;
    }
    throw new Error('User not found');
  },

  getRequests: () => loadData().requests,
  addRequest: (request) => {
    const data = loadData();
    const newRequest = { 
      ...request, 
      request_id: data.requests.length + 1, 
      request_status: 'pending',
      created_at: new Date().toISOString()
    };
    data.requests.push(newRequest);
    saveData(data);
    return newRequest;
  },
  updateRequestStatus: (id, status) => {
    const data = loadData();
    const req = data.requests.find(r => r.request_id === id);
    if (req) {
      req.request_status = status;
      saveData(data);
    }
    return req;
  },

  getPayments: () => loadData().payments,
  addPayment: (payment) => {
    const data = loadData();
    const newPayment = {
      ...payment,
      payment_id: data.payments.length + 1,
      payment_status: 'waiting',
      created_at: new Date().toISOString()
    };
    data.payments.push(newPayment);
    saveData(data);
    return newPayment;
  },
  updatePaymentStatus: (id, status) => {
    const data = loadData();
    const pay = data.payments.find(p => p.payment_id === id);
    if (pay) {
      pay.payment_status = status;
      saveData(data);
    }
    return pay;
  },

  addFeedback: (requestId, rating, comment) => {
    const data = loadData();
    const req = data.requests.find(r => r.request_id === requestId);
    if (req) {
      req.rating = rating;
      req.feedback = comment;
      saveData(data);
    }
    return req;
  },

  updateUser: (updatedUser) => {
    const data = loadData();
    const index = data.users.findIndex(u => u.user_id === updatedUser.user_id);
    if (index !== -1) {
      data.users[index] = { ...data.users[index], ...updatedUser };
      saveData(data);
      return data.users[index];
    }
    return null;
  },

  getSummary: () => {
    const data = loadData();
    return {
      totalUsers: data.users.length,
      totalSites: data.sites.length,
      totalVisits: data.visits ? data.visits.length : 0,
      totalPayments: data.payments.length,
      pendingRequests: data.requests.filter(r => r.request_status === 'pending').length,
      pendingPayments: data.payments.filter(p => p.payment_status === 'waiting').length
    };
  },

  // Fetch real statistics from API
  getStatsFromAPI: async () => {
    try {
      const response = await fetch('http://localhost:8000/api/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      return {
        sites: data.sites || 0,
        guides: data.guides || 0,
        visitors: data.visitors || 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Return fallback data
      return {
        sites: 50,
        guides: 100,
        visitors: 1000
      };
    }
  }
};
