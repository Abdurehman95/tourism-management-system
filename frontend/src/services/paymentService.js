// Client-side helper to initiate Chapa payments via your backend.
// IMPORTANT: Do NOT call Chapa with the secret key from the frontend. Your backend must proxy/initialize.

// Normalize base to include /api exactly once
const RAW_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/$/, '');
const API_BASE = RAW_BASE.endsWith('/api') ? RAW_BASE : `${RAW_BASE}/api`;

export const paymentService = {
  async createChapaPayment(payload) {
    const res = await fetch(`${API_BASE}/payments/chapa/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Payment init failed');
    }
    return data; // { checkout_url, tx_ref }
  },

  async verifyChapaPayment(txRef) {
    const res = await fetch(`${API_BASE}/payments/chapa/verify/${txRef}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Payment verification failed');
    }
    return data;
  }
};
