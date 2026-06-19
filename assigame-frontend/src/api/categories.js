import client from './client';

export const categoriesApi = {
  // GET /api/categorieproduit/list -> CategorieProduit[]
  getAll: () => client.get('/categorieproduit/list'),
};
