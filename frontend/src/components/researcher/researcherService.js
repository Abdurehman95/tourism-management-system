import { api } from '../../services/api';

// Researcher flows now hit the real backend so data persists to MySQL.

export const getResearcherSummary = async () => {
  const sites = await getResearcherSites();
  return {
    totalSites: sites.length,
    pending: sites.filter(s => !s.is_approved && s.is_approved !== true).length,
    approved: sites.filter(s => s.is_approved === true || s.status === 'approved').length,
    recentActivity: sites.sort((a, b) => (b.site_id || 0) - (a.site_id || 0)).slice(0, 5)
  };
};

export const getResearcherSites = async () => {
  const res = await api.get('/sites');
  const payload = res?.data ?? res;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export const addSite = async (site) => {
  return await api.post('/sites', site);
};

export const updateSite = async (site) => {
  return await api.patch(`/sites/${site.site_id}`, site);
};

export const deleteSite = async (id) => {
  return await api.delete(`/sites/${id}`);
};

export const updateUser = async (data) => {
  return await api.patch('/users/me', data);
};

export const changePassword = async (newPassword) => {
  return await api.patch('/users/me', { password: newPassword });
};
