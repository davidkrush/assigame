import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiX, FiSliders, FiGrid, FiList } from 'react-icons/fi';
import { SORT_OPTIONS } from '../../utils/mockData';
import ProductCard from '../../components/buyer/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Skeleton';
import Pagination from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { productsApi } from '../../api/products';
import { categoriesApi } from '../../api/categories';
import { adaptProduct, adaptCategory } from '../../utils/adapters';

const PER_PAGE = 12;

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState('grid');

  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'newest';
  const page = parseInt(params.get('page') || '1');
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';

  const set = (key, val) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val); else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  // Charge les catégories une fois
  useEffect(() => {
    categoriesApi.getAll().then(({ data }) => setCategories(data.map(adaptCategory))).catch(() => setCategories([]));
  }, []);

  // Charge les produits selon la recherche / catégorie active
  useEffect(() => {
    setLoading(true);
    let request;
    if (q) {
      request = productsApi.search(q);
    } else if (category) {
      const cat = categories.find(c => c.slug === category);
      request = cat ? productsApi.getByCategorie(cat.id) : productsApi.getAll();
    } else {
      request = productsApi.getAll();
    }

    request
      .then(({ data }) => setAllProducts(data.map(adaptProduct)))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, [q, category, categories]);

  // Filtres et tri côté client
  let filtered = [...allProducts];
  if (minPrice) filtered = filtered.filter(p => p.price >= +minPrice);
  if (maxPrice) filtered = filtered.filter(p => p.price <= +maxPrice);
  if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'oldest') filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  else filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = filtered.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const products = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">Catégorie</h4>
        <div className="space-y-1">
          <button
            onClick={() => set('category', '')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Toutes les catégories
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => set('category', cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${category === cat.slug ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <span className="flex items-center gap-2">
                <cat.Icon className={`w-4 h-4 flex-shrink-0 ${cat.iconColor}`} strokeWidth={2} />
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">Fourchette de prix (FCFA)</h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={e => set('minPrice', e.target.value)}
            placeholder="Min"
            className="input text-sm"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={e => set('maxPrice', e.target.value)}
            placeholder="Max"
            className="input text-sm"
          />
        </div>
      </div>

      {/* Reset */}
      {(q || category || minPrice || maxPrice) && (
        <button
          onClick={() => setParams({})}
          className="w-full btn-secondary text-sm text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <FiX className="w-4 h-4" /> Effacer les filtres
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold">
              {q ? `Résultats pour "${q}"` : category ? categories.find(c => c.slug === category)?.name || 'Produits' : 'Tous les produits'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{total.toLocaleString('fr-FR')} annonce(s) trouvée(s)</p>
          </div>
          <div className="sm:ml-auto flex items-center gap-3">
            <select
              value={sort}
              onChange={e => set('sort', e.target.value)}
              className="input text-sm w-44"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2.5 ${view === 'grid' ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2.5 ${view === 'list' ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 btn-secondary text-sm lg:hidden"
            >
              <FiSliders className="w-4 h-4" />
              Filtres
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="card p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <FiFilter className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-sm">Filtres</span>
              </div>
              <FilterSidebar />
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-40 flex">
              <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="relative w-72 bg-white dark:bg-slate-900 h-full overflow-y-auto p-5 shadow-xl"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="font-semibold">Filtres</span>
                  <button onClick={() => setSidebarOpen(false)}>
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar />
              </motion.div>
            </div>
          )}

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon="search"
                title="Aucun produit trouvé"
                description="Essayez d'ajuster vos filtres ou votre recherche."
                action={<button onClick={() => setParams({})} className="btn-primary">Effacer les filtres</button>}
              />
            ) : (
              <>
                <div className={`grid gap-5 mb-8 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
                <Pagination page={page} totalPages={totalPages} onPage={n => set('page', String(n))} />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
