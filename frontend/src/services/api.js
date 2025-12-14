// Normalize API base: if env ends with /api use as-is, else append /api
// Default to XAMPP path if not specified, or localhost:8000 if running php -S
const rawBase = 'http://localhost:8000';
const API_BASE_URL = `${rawBase}/api`;

const parseResponse = async (response) => {
  const text = await response.text();
  try {
    return { data: JSON.parse(text), raw: text };
  } catch (_) {
    return { data: null, raw: text };
  }
};

const withAuthHeaders = () => {
  // Prefer explicit tokens if stored under role-specific keys
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('researcher_token') ||
    localStorage.getItem('admin_token') ||
    localStorage.getItem('visitor_token');

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handle = async (response) => {
  const { data, raw } = await parseResponse(response);
  if (!response.ok) {
    const message = (data && data.error) ? data.error : (raw || response.statusText);
    throw new Error(message || 'Request failed');
  }
  return data ?? raw;
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: withAuthHeaders(),
    });
    return handle(response);
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: withAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handle(response);
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: withAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handle(response);
  },

  patch: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: withAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handle(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: withAuthHeaders(),
    });
    return handle(response);
  }
};
