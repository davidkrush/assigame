import client from './client';

export const adminApi = {
  getDashboardStats: () => client.get('/admin/dashboard/stats'),
  getUsers: (params) => client.get('/admin/users', { params }),
  updateUser: (id, data) => client.put(`/admin/users/${id}`, data),
  deleteUser: (id) => client.delete(`/admin/users/${id}`),
  getSellers: (params) => client.get('/admin/sellers', { params }),
  approveSeller: (id) => client.patch(`/admin/sellers/${id}/approve`),
  suspendSeller: (id, reason) => client.patch(`/admin/sellers/${id}/suspend`, { reason }),
  getReports: (params) => client.get('/admin/reports', { params }),
  getActivity: () => client.get('/admin/activity'),
  getSettings: () => client.get('/admin/settings'),
  updateSettings: (data) => client.put('/admin/settings', data),
};
