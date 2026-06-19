import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch, FiTrash2, FiUserX, FiPlus, FiX, FiCheck,
  FiBarChart2, FiTrendingUp, FiSave, FiEdit2, FiAlertCircle, FiRefreshCw, FiUserCheck
} from 'react-icons/fi';
import { adminApi } from '../../api/auth';
import { productsApi } from '../../api/products';
import { adaptProduct, adaptCategory } from '../../utils/adapters';
import { formatPrice, getStatusBadge } from '../../utils/mockData';
import { ConfirmModal } from '../../components/common/Modal';
import { useToast } from '../../contexts/ToastContext';
import Pagination from '../../components/common/Pagination';
import { getErrorMessage } from '../../api/client';

// ─── Helpers ──────────────────────────────────────────────────
function Th({ children }) {
  return <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">{children}</th>;
}
function Td({ children, className = '' }) {
  return <td className={`px-6 py-4 text-sm ${className}`}>{children}</td>;
}
function ErrorMsg({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
      <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>{msg}</span>
    </div>
  );
}
const PER = 10;

// ─── USERS ─────────────────────────────────────────────────────
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null);
  const toast = useToast();

  const load = useCallback(() => {
    setLoading(true);
    adminApi.getAllUsers()
      .then(({ data }) => setUsers(data))
      .catch((err) => setError(getErrorMessage(err, 'Impossible de charger les utilisateurs.')))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id_utilisateur !== id));
      toast.success('Utilisateur supprimé');
    } catch (err) {
      toast.error(getErrorMessage(err, 'La suppression a échoué.'));
    } finally {
      setConfirmId(null);
    }
  };

  const handleSuspend = async (user) => {
    const newStatut = user.Statut === 'suspendu' ? 'actif' : 'suspendu';
    try {
      await adminApi.updateUser(user.id_utilisateur, { statut: newStatut });
      setUsers(prev => prev.map(u => u.id_utilisateur === user.id_utilisateur ? { ...u, Statut: newStatut } : u));
      toast.success(newStatut === 'suspendu' ? 'Utilisateur suspendu' : 'Utilisateur réactivé');
    } catch (err) {
      toast.error(getErrorMessage(err, "La modification a échoué."));
    }
  };

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.Nom || '').toLowerCase().includes(q) ||
           (u.Email || '').toLowerCase().includes(q) ||
           (u.Login || '').toLowerCase().includes(q);
  });
  const paged = filtered.slice((page - 1) * PER, page * PER);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Gestion des utilisateurs</h1>
          <p className="text-slate-500 text-sm mt-1">{users.length} utilisateur(s) inscrit(s)</p>
        </div>
        <button onClick={load} className="btn-secondary text-sm flex items-center gap-2">
          <FiRefreshCw className="w-4 h-4" /> Actualiser
        </button>
      </div>
      <ErrorMsg msg={error} />

      <div className="card p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher par nom, email ou login…" className="input pl-10 text-sm" />
        </div>
      </div>

      {loading ? (
        <div className="card p-6 animate-pulse h-48" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                <tr><Th>Utilisateur</Th><Th>Login</Th><Th>Téléphone</Th><Th>Type</Th><Th>Statut</Th><Th>Actions</Th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {paged.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">Aucun utilisateur trouvé.</td></tr>
                ) : paged.map(u => (
                  <motion.tr key={u.id_utilisateur} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">
                          {(u.Nom || u.nom || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{u.Prenom || u.prenom} {u.Nom || u.nom}</p>
                          <p className="text-xs text-slate-400">{u.Email || u.email}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-slate-500 font-mono text-xs">{u.Login || u.login}</Td>
                    <Td className="text-slate-600 dark:text-slate-400">{u.telephone || '—'}</Td>
                    <Td className="text-slate-600 dark:text-slate-400 text-xs">{u.typeutilisateur?.nom_typeutilisateur || '—'}</Td>
                    <Td>
                      <span className={(u.Statut || u.statut) === 'actif' ? 'badge-green' : 'badge-red'}>
                        {u.Statut || u.statut || '—'}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex gap-2">
                        <button title={(u.Statut || u.statut) === 'suspendu' ? 'Réactiver' : 'Suspendre'}
                          onClick={() => handleSuspend(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors">
                          <FiUserX className="w-4 h-4" />
                        </button>
                        <button onClick={() => setConfirmId(u.id_utilisateur)} title="Supprimer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {Math.ceil(filtered.length / PER) > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-700">
              <Pagination page={page} totalPages={Math.ceil(filtered.length / PER)} onPage={setPage} />
            </div>
          )}
        </div>
      )}
      <ConfirmModal
        isOpen={!!confirmId} onClose={() => setConfirmId(null)}
        onConfirm={() => handleDelete(confirmId)}
        title="Supprimer l'utilisateur"
        message="Cette action supprimera définitivement le compte et toutes ses données. Irréversible."
        confirmText="Supprimer" danger
      />
    </div>
  );
}

// ─── SELLERS ───────────────────────────────────────────────────
export function AdminSellers() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const toast = useToast();

  useEffect(() => {
    Promise.all([
      adminApi.getAllUsers().catch(() => ({ data: [] })),
      adminApi.getAllProducts().catch(() => ({ data: [] })),
    ]).then(([uRes, pRes]) => {
      setUsers(uRes.data || []);
      setProducts(pRes.data || []);
    }).finally(() => setLoading(false));
  }, []);

  // Les "vendeurs" sont les utilisateurs qui ont au moins 1 produit
  const sellersMap = {};
  (products || []).forEach(p => {
    if (p.id_utilisateur) {
      if (!sellersMap[p.id_utilisateur]) sellersMap[p.id_utilisateur] = 0;
      sellersMap[p.id_utilisateur]++;
    }
  });

  const sellers = users.filter(u => sellersMap[u.id_utilisateur] !== undefined);

  const filtered = sellers.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (s.Nom || '').toLowerCase().includes(q) || (s.Email || '').toLowerCase().includes(q);
  });
  const paged = filtered.slice((page - 1) * PER, page * PER);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Gestion des vendeurs</h1>
        <p className="text-slate-500 text-sm mt-1">{sellers.length} vendeur(s) avec des produits</p>
      </div>

      <div className="card p-4 flex gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher un vendeur…" className="input pl-10 text-sm" />
        </div>
      </div>

      {loading ? (
        <div className="card p-6 animate-pulse h-48" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                <tr><Th>Vendeur</Th><Th>Téléphone</Th><Th>Produits</Th><Th>Type</Th><Th>Statut</Th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {paged.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">Aucun vendeur trouvé.</td></tr>
                ) : paged.map(s => (
                  <tr key={s.id_utilisateur} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-sm font-bold text-emerald-600">
                          {(s.Nom || s.nom || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{s.Prenom || s.prenom} {s.Nom || s.nom}</p>
                          <p className="text-xs text-slate-400">{s.Email || s.email}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-slate-600 dark:text-slate-400">{s.telephone || '—'}</Td>
                    <Td className="font-semibold text-primary-600 dark:text-primary-400">
                      {sellersMap[s.id_utilisateur] || 0} annonce(s)
                    </Td>
                    <Td className="text-xs text-slate-500">{s.typeutilisateur?.nom_typeutilisateur || '—'}</Td>
                    <Td>
                      <span className={(s.Statut || s.statut) === 'actif' ? 'badge-green' : 'badge-red'}>
                        {s.Statut || s.statut || '—'}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {Math.ceil(filtered.length / PER) > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-700">
              <Pagination page={page} totalPages={Math.ceil(filtered.length / PER)} onPage={setPage} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PRODUCTS ──────────────────────────────────────────────────
export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null);
  const toast = useToast();

  const load = useCallback(() => {
    setLoading(true);
    adminApi.getAllProducts()
      .then(({ data }) => setProducts(data.map(adaptProduct)))
      .catch((err) => setError(getErrorMessage(err, 'Impossible de charger les produits.')))
      .finally(() => setLoading(false));
  }, []);
  useEffect(load, [load]);

  const handleDelete = async (id) => {
    try {
      await productsApi.remove(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Produit supprimé');
    } catch (err) {
      toast.error(getErrorMessage(err, 'La suppression a échoué.'));
    } finally {
      setConfirmId(null);
    }
  };

  const filtered = products.filter(p => {
    const q = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const s = !statusFilter || p.status === statusFilter;
    return q && s;
  });
  const paged = filtered.slice((page - 1) * PER, page * PER);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Gestion des produits</h1>
          <p className="text-slate-500 text-sm mt-1">{products.length} produit(s) au total</p>
        </div>
        <button onClick={load} className="btn-secondary text-sm flex items-center gap-2">
          <FiRefreshCw className="w-4 h-4" /> Actualiser
        </button>
      </div>
      <ErrorMsg msg={error} />

      <div className="card p-4 flex gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher un produit…" className="input pl-10 text-sm" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input text-sm w-40">
          <option value="">Tous les statuts</option>
          <option value="disponible">Disponible</option>
          <option value="vendu">Vendu</option>
          <option value="suspendu">Suspendu</option>
        </select>
      </div>

      {loading ? (
        <div className="card p-6 animate-pulse h-48" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                <tr><Th>Produit</Th><Th>Vendeur</Th><Th>Prix</Th><Th>Catégorie</Th><Th>Statut</Th><Th>Actions</Th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {paged.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">Aucun produit trouvé.</td></tr>
                ) : paged.map(p => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <Td>
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                        <p className="font-medium text-sm line-clamp-1 max-w-xs">{p.title}</p>
                      </div>
                    </Td>
                    <Td className="text-slate-500 text-xs">{p.seller.name}</Td>
                    <Td className="font-semibold text-primary-600 dark:text-primary-400 whitespace-nowrap">
                      {formatPrice(p.price, p.currency)}
                    </Td>
                    <Td className="text-slate-500 text-xs">{p.category.name}</Td>
                    <Td><span className={`${getStatusBadge(p.status)} capitalize`}>{p.status || 'disponible'}</span></Td>
                    <Td>
                      <button onClick={() => setConfirmId(p.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </Td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {Math.ceil(filtered.length / PER) > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-700">
              <Pagination page={page} totalPages={Math.ceil(filtered.length / PER)} onPage={setPage} />
            </div>
          )}
        </div>
      )}
      <ConfirmModal
        isOpen={!!confirmId} onClose={() => setConfirmId(null)}
        onConfirm={() => handleDelete(confirmId)}
        title="Supprimer le produit"
        message="Ce produit sera supprimé définitivement. Cette action est irréversible."
        confirmText="Supprimer" danger
      />
    </div>
  );
}

// ─── CATEGORIES ────────────────────────────────────────────────
export function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    adminApi.getAllCategories()
      .then(({ data }) => setCats(data))
      .catch((err) => setError(getErrorMessage(err, 'Impossible de charger les catégories.')))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const add = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await adminApi.addCategory({ nom_categorieproduit: newName.trim(), description: newDesc.trim() });
      toast.success('Catégorie ajoutée');
      setNewName(''); setNewDesc('');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "L'ajout a échoué."));
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      await adminApi.updateCategory(id, { nom_categorieproduit: editName.trim() });
      toast.success('Catégorie modifiée');
      setEditId(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, 'La modification a échoué.'));
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteCategory(id);
      setCats(prev => prev.filter(c => c.idcategorie_produit !== id));
      toast.success('Catégorie supprimée');
    } catch (err) {
      toast.error(getErrorMessage(err, 'La suppression a échoué.'));
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Gestion des catégories</h1>
      <ErrorMsg msg={error} />

      <form onSubmit={add} className="card p-5 flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-48">
          <label className="label">Nom de la catégorie *</label>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="ex. Mobilier" className="input" required />
        </div>
        <div className="flex-1 min-w-48">
          <label className="label">Description (optionnel)</label>
          <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description courte…" className="input" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <><FiPlus className="w-4 h-4" /> Ajouter</>}
        </button>
      </form>

      {loading ? (
        <div className="card p-6 animate-pulse h-32" />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
              <tr><Th>Nom</Th><Th>Description</Th><Th>Actions</Th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {cats.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500 text-sm">Aucune catégorie. Ajoutez-en une ci-dessus.</td></tr>
              ) : cats.map(c => (
                <tr key={c.idcategorie_produit} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <Td>
                    {editId === c.idcategorie_produit ? (
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="input text-sm py-1"
                        autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(c.idcategorie_produit); if (e.key === 'Escape') setEditId(null); }}
                      />
                    ) : (
                      <span className="font-medium">📦 {c.nom_categorieproduit}</span>
                    )}
                  </Td>
                  <Td className="text-slate-500 text-xs">{c.description || '—'}</Td>
                  <Td>
                    <div className="flex gap-2">
                      {editId === c.idcategorie_produit ? (
                        <>
                          <button onClick={() => saveEdit(c.idcategorie_produit)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditId(null)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <FiX className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => { setEditId(c.idcategorie_produit); setEditName(c.nom_categorieproduit); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => setConfirmId(c.idcategorie_produit)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal
        isOpen={!!confirmId} onClose={() => setConfirmId(null)}
        onConfirm={() => handleDelete(confirmId)}
        title="Supprimer la catégorie"
        message="Les produits associés à cette catégorie n'auront plus de catégorie. Confirmer ?"
        confirmText="Supprimer" danger
      />
    </div>
  );
}

// ─── REPORTS ───────────────────────────────────────────────────
export function AdminReports() {
  const [data, setData] = useState({ users: [], products: [], categories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.getAllUsers().catch(() => ({ data: [] })),
      adminApi.getAllProducts().catch(() => ({ data: [] })),
      adminApi.getAllCategories().catch(() => ({ data: [] })),
    ]).then(([u, p, c]) => {
      setData({ users: u.data || [], products: p.data || [], categories: c.data || [] });
    }).finally(() => setLoading(false));
  }, []);

  const products = data.products.map(adaptProduct);
  const totalValue = products.reduce((s, p) => s + p.price, 0);
  const disponibles = products.filter(p => p.status === 'disponible').length;
  const sellersCount = new Set(data.products.map(p => p.id_utilisateur).filter(Boolean)).size;

  // Répartition par catégorie
  const catCount = {};
  products.forEach(p => {
    const name = p.category.name || 'Autre';
    catCount[name] = (catCount[name] || 0) + 1;
  });
  const topCats = Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCat = topCats[0]?.[1] || 1;

  const metrics = [
    { label: 'Utilisateurs inscrits', value: data.users.length.toLocaleString('fr-FR'), icon: FiUserCheck, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Vendeurs avec produits', value: sellersCount.toLocaleString('fr-FR'), icon: FiTrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Produits disponibles', value: disponibles.toLocaleString('fr-FR'), icon: FiBarChart2, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Valeur totale du stock', value: formatPrice(totalValue), icon: FiBarChart2, color: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-900/20' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-display font-bold">Rapports & Analytiques</h1>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-6 animate-pulse h-24" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {metrics.map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
                <div className={`w-12 h-12 rounded-xl ${m.bg} flex items-center justify-center flex-shrink-0`}>
                  <m.icon className={`w-6 h-6 ${m.color}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">{m.label}</p>
                  <p className="text-xl font-bold">{m.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Top catégories */}
            <div className="card p-6">
              <h2 className="font-semibold mb-5">Produits par catégorie</h2>
              {topCats.length === 0 ? (
                <p className="text-slate-500 text-sm">Aucun produit disponible.</p>
              ) : (
                <div className="space-y-3">
                  {topCats.map(([name, count]) => (
                    <div key={name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>📦 {name}</span>
                        <span className="text-slate-500">{count}</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${(count / maxCat) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Résumé global */}
            <div className="card p-6">
              <h2 className="font-semibold mb-5">Résumé de la plateforme</h2>
              <div className="space-y-3">
                {[
                  ['Total utilisateurs', data.users.length],
                  ['Total produits', products.length],
                  ['Total catégories', data.categories.length],
                  ['Produits disponibles', disponibles],
                  ['Produits vendus', products.filter(p => p.status === 'vendu').length],
                  ['Produits suspendus', products.filter(p => p.status === 'suspendu').length],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700 last:border-0 text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{label}</span>
                    <span className="font-semibold">{Number(val).toLocaleString('fr-FR')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── SETTINGS ──────────────────────────────────────────────────
export function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'MarketHub',
    tagline: "La marketplace n°1 d'Afrique de l'Ouest",
    contactEmail: 'support@markethub.com',
    supportPhone: '+228 90 00 00 00',
    currency: 'FCFA',
    timezone: 'Africa/Lome',
    maintenanceMode: false,
    allowRegistrations: true,
  });
  const toast = useToast();

  const save = () => {
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    toast.success('Paramètres enregistrés (localement)');
  };
  const set = (k) => (e) => setSettings(s => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold">Paramètres de la plateforme</h1>

      <div className="card p-6 space-y-5">
        <h2 className="font-semibold text-sm">Informations générales</h2>
        <div><label className="label">Nom du site</label><input value={settings.siteName} onChange={set('siteName')} className="input" /></div>
        <div><label className="label">Slogan</label><input value={settings.tagline} onChange={set('tagline')} className="input" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Email de contact</label><input type="email" value={settings.contactEmail} onChange={set('contactEmail')} className="input" /></div>
          <div><label className="label">Téléphone support</label><input value={settings.supportPhone} onChange={set('supportPhone')} className="input" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Devise par défaut</label>
            <select value={settings.currency} onChange={set('currency')} className="input">
              {['FCFA','USD','EUR','GHS','NGN'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Fuseau horaire</label>
            <select value={settings.timezone} onChange={set('timezone')} className="input">
              {['Africa/Lome','Africa/Accra','Africa/Lagos','Africa/Abidjan'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-sm">Contrôles de la plateforme</h2>
        <p className="text-xs text-slate-400">Ces paramètres sont enregistrés localement pour l'instant (fonctionnalité à connecter au backend).</p>
        {[
          ['maintenanceMode', 'Mode maintenance', 'Désactive temporairement le site public pour les mises à jour'],
          ['allowRegistrations', 'Autoriser les nouvelles inscriptions', 'Permettre aux nouveaux utilisateurs de créer un compte vendeur'],
        ].map(([k, label, desc]) => (
          <label key={k} className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-slate-400">{desc}</p>
            </div>
            <div onClick={() => setSettings(s => ({...s, [k]: !s[k]}))}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${settings[k] ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings[k] ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={save} className="btn-primary">
          <FiSave className="w-4 h-4" /> Enregistrer les paramètres
        </button>
      </div>
    </div>
  );
}
