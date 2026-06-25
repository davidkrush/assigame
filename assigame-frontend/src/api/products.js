import client from './client';

export const productsApi = {
  getAll: () => client.get('/produit/responses'),
  getById: (id) => client.get(`/produit/${id}`),
  getByVendeur: (idUtilisateur) => client.get(`/produit/vendeur/${idUtilisateur}`),
  getByCategorie: (idCategorie) => client.get(`/produit/categorie/${idCategorie}`),
  search: (q) => client.get('/produit/search', { params: { q } }),
  create: (data) => client.post('/produit/create', data),
  update: (id, data) => client.put(`/produit/update-dto/${id}`, data),
  remove: (id) => client.delete(`/produit/delete/${id}`),

  // Upload d'une image vers le backend
  // Envoie le fichier en multipart/form-data
  // Renvoie { url: "http://localhost:8081/uploads/xxx.jpg" }
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return client.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};