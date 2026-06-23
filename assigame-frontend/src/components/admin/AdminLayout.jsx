import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShield, FiGrid, FiUsers, FiPackage, FiBarChart2, FiTag,
  FiSettings, FiLogOut, FiMenu, FiSun, FiMoon, FiUserCheck
} from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import appLogo from '../../assets/A(1).png';

const NAV = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Tableau de bord' },
  { to: '/admin/users', icon: FiUsers, label: 'Utilisateurs' },
  { to: '/admin/sellers', icon: FiUserCheck, label: 'Vendeurs' },
  { to: '/admin/products', icon: FiPackage, label: 'Produits' },
  { to: '/admin/categories', icon: FiTag, label: 'Catégories' },
  { to: '/admin/reports', icon: FiBarChart2, label: 'Rapports' },
  { to: '/admin/settings', icon: FiSettings, label: 'Paramètres' },
];

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const toast = useToast();

  const adminUser = (() => {
    try { return JSON.parse(localStorage.getItem('admin_user')); } catch { return null; }
  })();

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    toast.info('Déconnexion réussie');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3 flex-shrink-0">
          <img src={appLogo} alt="logo" className="h-[96px] w-auto" />
        </div>
        <p className="text-xs text-slate-500 mt-1 ml-2">Panneau Admin</p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {NAV.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${active
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <div className="px-4 py-3 mb-2 rounded-xl bg-slate-800">
          <p className="text-xs text-slate-400">Connecté en tant que</p>
          <p className="text-sm text-white font-medium mt-0.5 truncate">
            {adminUser ? `${adminUser.prenom || ''} ${adminUser.nom || ''}`.trim() || 'Administrateur' : 'Administrateur'}
          </p>
          <p className="text-xs text-slate-500 truncate">{adminUser?.email || ''}</p>
        </div>
        <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all">
          <FiLogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  const currentLabel = NAV.find(n => location.pathname.startsWith(n.to))?.label || 'Admin';

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-slate-900 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 h-full w-60 bg-slate-900 z-50">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-4 h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <FiMenu className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-slate-800 dark:text-white">{currentLabel}</h1>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              {dark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
