import client from './client';

export const productsApi = {
  // GET /api/produit/responses -> ProduitResponse[]
  getAll: () => client.get('/produit/responses'),

  // GET /api/produit/{id} -> ProduitResponse
  getById: (id) => client.get(`/produit/${id}`),

  // GET /api/produit/vendeur/{id} -> ProduitResponse[]
  getByVendeur: (idUtilisateur) => client.get(`/produit/vendeur/${idUtilisateur}`),

  // GET /api/produit/categorie/{id} -> ProduitResponse[]
  getByCategorie: (idCategorie) => client.get(`/produit/categorie/${idCategorie}`),

  // GET /api/produit/search?q=... -> ProduitResponse[]
  search: (q) => client.get('/produit/search', { params: { q } }),

  // POST /api/produit/create body: ProduitRequest -> ProduitResponse
  create: (data) => client.post('/produit/create', data),

  // PUT /api/produit/update-dto/{id} body: ProduitRequest -> ProduitResponse
  update: (id, data) => client.put(`/produit/update-dto/${id}`, data),

  // DELETE /api/produit/delete/{id}
  remove: (id) => client.delete(`/produit/delete/${id}`),
};
