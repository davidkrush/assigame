import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiPackage, FiTag, FiTrendingUp, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/auth';
import { adaptProduct } from '../../utils/adapters';
import { formatPrice, getStatusBadge } from '../../utils/mockData';
import { StatCardSkeleton } from '../../components/common/Skeleton';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, sellers: 0, products: 0, categories: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      adminApi.getAllUsers().catch(() => ({ data: [] })),
      adminApi.getAllProducts().catch(() => ({ data: [] })),
      adminApi.getAllCategories().catch(() => ({ data: [] })),
    ]).then(([usersRes, productsRes, catsRes]) => {
      const users = usersRes.data || [];
      const products = productsRes.data || [];
      const cats = catsRes.data || [];

      // Compter les "vendeurs" = utilisateurs ayant des produits ou type Vendeur
      const sellersIds = new Set(products.map(p => p.id_utilisateur).filter(Boolean));

      setStats({
        users: users.length,
        sellers: sellersIds.size,
        products: products.length,
        categories: cats.length,
      });

      // 5 produits les plus récents
      const sorted = [...products].sort((a, b) =>
        new Date(b.date_ajout) - new Date(a.date_ajout)
      );
      setRecentProducts(sorted.slice(0, 5).map(adaptProduct));
    }).catch(() => setError('Impossible de charger les données du tableau de bord.')).finally(() => setLoading(false));
  }, []);

  const STATS = [
    { label: 'Utilisateurs inscrits', value: stats.users, icon: FiUsers, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', to: '/admin/users' },
    { label: 'Vendeurs actifs', value: stats.sellers, icon: FiTrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', to: '/admin/sellers' },
    { label: 'Produits en ligne', value: stats.products, icon: FiPackage, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', to: '/admin/products' },
    { label: 'Catégories', value: stats.categories, icon: FiTag, color: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-900/20', to: '/admin/categories' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">Tableau de bord</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={s.to} className="stat-card block hover:shadow-card-hover transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value.toLocaleString('fr-FR')}</p>
                </div>
              </Link>
            </motion.div>
          ))
        }
      </div>

      {/* Recent Products */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold">Derniers produits ajoutés</h2>
          <Link to="/admin/products" className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
            Voir tout <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="p-6 animate-pulse h-32" />
        ) : recentProducts.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-sm">Aucun produit pour l'instant.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                  <th className="px-5 py-3 font-medium">Produit</th>
                  <th className="px-5 py-3 font-medium">Vendeur</th>
                  <th className="px-5 py-3 font-medium">Prix</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {recentProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                        <p className="text-sm font-medium line-clamp-1 max-w-xs">{p.title}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">{p.seller.name}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-primary-600 dark:text-primary-400 whitespace-nowrap">
                      {formatPrice(p.price, p.currency)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`${getStatusBadge(p.status)} capitalize`}>{p.status || 'disponible'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick access cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: '/admin/users', icon: FiUsers, label: 'Gérer les utilisateurs', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { to: '/admin/products', icon: FiPackage, label: 'Modérer les produits', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { to: '/admin/categories', icon: FiTag, label: 'Gérer les catégories', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { to: '/admin/reports', icon: FiTrendingUp, label: 'Voir les rapports', color: 'text-accent-600', bg: 'bg-accent-50 dark:bg-accent-900/20' },
        ].map(({ to, icon: Icon, label, color, bg }) => (
          <Link key={to} to={to} className="card p-5 flex items-center gap-3 hover:shadow-card-hover transition-shadow group">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="font-semibold text-sm group-hover:text-primary-600 transition-colors">{label}</p>
            <FiArrowRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-primary-500 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
