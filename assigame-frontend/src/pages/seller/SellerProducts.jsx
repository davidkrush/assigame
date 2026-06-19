import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiEdit2, FiTrash2, FiEye, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { formatPrice, getStatusBadge } from '../../utils/mockData';
import { adaptProduct } from '../../utils/adapters';
import { ConfirmModal } from '../../components/common/Modal';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { productsApi } from '../../api/products';
import { getErrorMessage } from '../../api/client';
import { EmptyState } from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';

const PER_PAGE = 10;

export default function SellerProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();

  const load = () => {
    if (!user?.id) return;
    setLoading(true);
    productsApi.getByVendeur(user.id)
      .then(({ data }) => setProducts(data.map(adaptProduct)))
      .catch((err) => setError(getErrorMessage(err, 'Impossible de charger vos produits.')))
      .finally(() => setLoading(false));
  };

  useEffect(load, [user?.id]);

  const filtered = products.filter(p => {
    const matchQ = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchS = !status || p.status === status;
    return matchQ && matchS;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const handleDelete = async (id) => {
    try {
      await productsApi.remove(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Produit supprimé avec succès');
    } catch (err) {
      toast.error(getErrorMessage(err, 'La suppression a échoué.'));
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Mes produits</h1>
          <p className="text-slate-500 text-sm mt-1">{products.length} annonce(s) au total</p>
        </div>
        <Link to="/seller/products/new" className="btn-primary">
          <FiPlusCircle className="w-4 h-4" />
          Ajouter un produit
        </Link>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher un produit…"
            className="input pl-10 text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="input text-sm w-40"
        >
          <option value="">Tous les statuts</option>
          <option value="disponible">Disponible</option>
          <option value="vendu">Vendu</option>
          <option value="suspendu">Suspendu</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="card p-6 animate-pulse h-64" />
      ) : paginated.length === 0 ? (
        <EmptyState
          icon="products"
          title="Aucun produit trouvé"
          description="Modifiez votre recherche ou ajoutez une nouvelle annonce."
          action={<Link to="/seller/products/new" className="btn-primary">Ajouter votre premier produit</Link>}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                  <th className="px-6 py-3 font-medium">Produit</th>
                  <th className="px-6 py-3 font-medium">Prix</th>
                  <th className="px-6 py-3 font-medium">Catégorie</th>
                  <th className="px-6 py-3 font-medium">Statut</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {paginated.map(p => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm line-clamp-1 max-w-xs">{p.title}</p>
                          <p className="text-xs text-slate-400">{p.category.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary-600 dark:text-primary-400 whitespace-nowrap">
                      {formatPrice(p.price, p.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{p.category.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${getStatusBadge(p.status)} capitalize`}>{p.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/products/${p.id}`} title="Voir" className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <Link to={`/seller/products/${p.id}/edit`} title="Modifier" className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setDeleteId(p.id)} title="Supprimer" className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-700">
              <Pagination page={page} totalPages={totalPages} onPage={setPage} />
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        title="Supprimer le produit"
        message="Cette annonce sera supprimée définitivement. Cette action est irréversible."
        confirmText="Supprimer"
        danger
      />
    </div>
  );
}
