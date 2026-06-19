import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiGrid, FiPackage, FiPlusCircle, FiUser, FiSettings, FiLogOut, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';

const NAV = [
  { to: '/seller/dashboard', icon: FiGrid, label: 'Tableau de bord' },
  { to: '/seller/products', icon: FiPackage, label: 'Mes produits' },
  { to: '/seller/products/new', icon: FiPlusCircle, label: 'Ajouter un produit' },
  { to: '/seller/profile', icon: FiUser, label: 'Profil' },
  { to: '/seller/settings', icon: FiSettings, label: 'Paramètres' },
];

export default function SellerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const toast = useToast();

  const handleLogout = async () => {
    await logout();
    toast.info('Déconnexion réussie');
    navigate('/seller/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800">
        <Link to="/" className="flex items-center gap-2 text-primary-600 font-display font-bold text-lg">
          <FiShoppingBag className="w-6 h-6" />
          MarketHub
        </Link>
        <p className="text-xs text-slate-400 mt-1 ml-8">Espace vendeur</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">
              {(user?.prenom || user?.name || 'V')[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user?.prenom ? `${user.prenom} ${user.nom || ''}`.trim() : user?.name || 'Vendeur'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={`sidebar-link ${location.pathname === to ? 'active' : ''}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
          <FiLogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 h-full w-60 bg-white dark:bg-slate-900 z-50 border-r border-slate-100 dark:border-slate-800"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center gap-4 h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <FiMenu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-semibold">{NAV.find(n => n.to === location.pathname)?.label || 'Espace vendeur'}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              {dark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
