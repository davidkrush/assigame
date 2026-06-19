import client from './client';

export const authApi = {
  login: (data) => client.post('/auth/login', data),
  register: (data) => client.post('/auth/register', data),
  getProfile: (id) => client.get(`/utilisateur/${id}`),
  updateProfile: (id, data) => client.put(`/utilisateur/update/${id}`, data),
};

export const adminApi = {
  // Utilisateurs
  getAllUsers: () => client.get('/utilisateur/list'),
  deleteUser: (id) => client.delete(`/utilisateur/delete/${id}`),
  updateUser: (id, data) => client.put(`/utilisateur/update/${id}`, data),
  // Types
  getAllTypes: () => client.get('/typeutilisateur/list'),
  addType: (data) => client.post('/typeutilisateur/add', data),
  deleteType: (id) => client.delete(`/typeutilisateur/delete/${id}`),
  // Catégories
  getAllCategories: () => client.get('/categorieproduit/list'),
  addCategory: (data) => client.post('/categorieproduit/add', data),
  updateCategory: (id, data) => client.put(`/categorieproduit/update/${id}`, data),
  deleteCategory: (id) => client.delete(`/categorieproduit/delete/${id}`),
  // Produits (admin)
  getAllProducts: () => client.get('/produit/responses'),
  deleteProduct: (id) => client.delete(`/produit/delete/${id}`),
  updateProductStatus: (id, data) => client.put(`/produit/update-dto/${id}`, data),
};

