import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiTrendingUp, FiPlusCircle, FiArrowRight, FiMessageCircle } from 'react-icons/fi';
import { formatPrice, getStatusBadge } from '../../utils/mockData';
import { adaptProduct } from '../../utils/adapters';
import { useAuth } from '../../contexts/AuthContext';
import { productsApi } from '../../api/products';
import { StatCardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    productsApi.getByVendeur(user.id)
      .then(({ data }) => setProducts(data.map(adaptProduct)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const total = products.length;
  const disponibles = products.filter(p => p.status === 'disponible').length;
  const valeurTotale = products.reduce((sum, p) => sum + (p.price || 0), 0);

  const STATS = [
    { label: 'Total produits', value: total, icon: FiPackage, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Annonces disponibles', value: disponibles, icon: FiTrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Valeur totale du stock', value: formatPrice(valeurTotale), icon: FiMessageCircle, color: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-900/20' },
  ];

  const recent = products.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Bonjour, {user?.prenom || 'Vendeur'} 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Voici un aperçu de votre boutique aujourd'hui.</p>
        </div>
        <Link to="/seller/products/new" className="btn-primary">
          <FiPlusCircle className="w-4 h-4" />
          Ajouter un produit
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
          : STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="stat-card"
            >
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </motion.div>
          ))
        }
      </div>

      {/* Recent Products */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold">Produits récents</h2>
          <Link to="/seller/products" className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
            Voir tout <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="p-6 animate-pulse h-32" />
        ) : recent.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon="products"
              title="Aucun produit pour le moment"
              description="Ajoutez votre premier produit pour commencer à vendre."
              action={<Link to="/seller/products/new" className="btn-primary">Ajouter un produit</Link>}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                  <th className="px-6 py-3 font-medium">Produit</th>
                  <th className="px-6 py-3 font-medium">Prix</th>
                  <th className="px-6 py-3 font-medium">Catégorie</th>
                  <th className="px-6 py-3 font-medium">Statut</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {recent.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                        <span className="font-medium text-sm line-clamp-1 max-w-xs">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary-600 dark:text-primary-400 whitespace-nowrap">
                      {formatPrice(p.price, p.currency)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{p.category.name}</td>
                    <td className="px-6 py-4">
                      <span className={`${getStatusBadge(p.status)} capitalize`}>{p.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/seller/products/${p.id}/edit`} className="text-xs text-primary-600 hover:underline">Modifier</Link>
                        <span className="text-slate-200 dark:text-slate-700">|</span>
                        <Link to={`/products/${p.id}`} className="text-xs text-slate-500 hover:underline">Voir</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { to: '/seller/products/new', icon: FiPlusCircle, label: 'Ajouter un produit', desc: 'Mettre un nouvel article en vente', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { to: '/seller/products', icon: FiPackage, label: 'Gérer mes produits', desc: 'Modifier ou supprimer des annonces', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { to: '/seller/profile', icon: FiMessageCircle, label: 'Mettre à jour le profil', desc: 'Modifier vos informations de contact', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map(({ to, icon: Icon, label, desc, color, bg }) => (
          <Link key={to} to={to} className="card p-5 flex items-start gap-4 hover:shadow-card-hover transition-shadow group">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="font-semibold text-sm group-hover:text-primary-600 transition-colors">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
