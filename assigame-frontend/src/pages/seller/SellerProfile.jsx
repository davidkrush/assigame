import { useState, useEffect } from 'react';
import { FiUser, FiPhone, FiMail, FiSave, FiLock, FiBell, FiAlertCircle } from 'react-icons/fi';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth';
import { getErrorMessage } from '../../api/client';

export function SellerProfile() {
  const toast = useToast();
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    authApi.getProfile(user.id)
      .then(({ data }) => {
        setForm({
          nom: data.nom || data.Nom || '',
          prenom: data.prenom || data.Prenom || '',
          email: data.email || data.Email || '',
          telephone: data.telephone || '',
        });
      })
      .catch((err) => setError(getErrorMessage(err, 'Impossible de charger le profil.')))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await authApi.updateProfile(user.id, {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        telephone: form.telephone,
      });
      updateUser({
        nom: form.nom,
        prenom: form.prenom,
        name: [form.nom, form.prenom].filter(Boolean).join(' ').trim(),
        email: form.email,
        telephone: form.telephone,
      });
      toast.success('Profil mis à jour avec succès');
    } catch (err) {
      setError(getErrorMessage(err, "La sauvegarde du profil a échoué."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-6 animate-pulse h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold">Profil vendeur</h1>

      {/* Avatar */}
      <div className="card p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-3xl font-bold text-primary-600 dark:text-primary-400">
            {(form.prenom || form.nom || '?')[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold">{form.prenom} {form.nom}</h3>
            <p className="text-sm text-slate-500">{form.email}</p>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="card p-6 space-y-5">
        <h2 className="font-semibold text-sm">Informations personnelles</h2>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label"><FiUser className="inline w-3.5 h-3.5 mr-1" />Prénom</label>
            <input value={form.prenom} onChange={set('prenom')} required className="input" />
          </div>
          <div>
            <label className="label"><FiUser className="inline w-3.5 h-3.5 mr-1" />Nom</label>
            <input value={form.nom} onChange={set('nom')} required className="input" />
          </div>
        </div>
        <div>
          <label className="label"><FiMail className="inline w-3.5 h-3.5 mr-1" />Email</label>
          <input type="email" value={form.email} onChange={set('email')} required className="input" />
        </div>
        <div>
          <label className="label"><FiPhone className="inline w-3.5 h-3.5 mr-1" />Téléphone WhatsApp</label>
          <input value={form.telephone} onChange={set('telephone')} placeholder="+228 90 00 00 00" className="input" />
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <><FiSave className="w-4 h-4" /> Enregistrer le profil</>}
          </button>
        </div>
      </form>
    </div>
  );
}

export function SellerSettings() {
  const toast = useToast();
  const { user } = useAuth();
  const [pwd, setPwd] = useState({ next: '', confirm: '' });
  const [notifs, setNotifs] = useState({ email: true, whatsapp: true, sms: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submitPwd = async (e) => {
    e.preventDefault();
    setError('');
    if (!pwd.next || pwd.next.length < 6) { setError('Le nouveau mot de passe doit contenir au moins 6 caractères.'); return; }
    if (pwd.next !== pwd.confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    setSaving(true);
    try {
      await authApi.updateProfile(user.id, { motdepasse: pwd.next });
      toast.success('Mot de passe modifié avec succès');
      setPwd({ next: '', confirm: '' });
    } catch (err) {
      setError(getErrorMessage(err, 'La modification du mot de passe a échoué.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold">Paramètres</h1>

      {/* Password */}
      <form onSubmit={submitPwd} className="card p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><FiLock className="w-4 h-4" /> Changer le mot de passe</h2>
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {[['next','Nouveau mot de passe'],['confirm','Confirmer le nouveau mot de passe']].map(([k,label]) => (
          <div key={k}>
            <label className="label">{label}</label>
            <input type="password" value={pwd[k]} onChange={e => setPwd(p => ({...p,[k]:e.target.value}))} required className="input" />
          </div>
        ))}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : 'Mettre à jour le mot de passe'}
          </button>
        </div>
      </form>

      {/* Notifications */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><FiBell className="w-4 h-4" /> Notifications</h2>
        <p className="text-xs text-slate-400">Ces préférences sont enregistrées localement (fonctionnalité à venir).</p>
        {[
          ['email','Notifications par email','Recevoir les mises à jour et alertes par email'],
          ['whatsapp','Alertes WhatsApp','Être notifié des nouvelles demandes sur WhatsApp'],
          ['sms','Notifications SMS','Recevoir un SMS pour les événements importants du compte'],
        ].map(([k,label,desc]) => (
          <label key={k} className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-slate-400">{desc}</p>
            </div>
            <div
              onClick={() => setNotifs(n => ({...n,[k]:!n[k]}))}
              className={`relative w-11 h-6 rounded-full transition-colors ${notifs[k] ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifs[k] ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </label>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-red-200 dark:border-red-900">
        <h2 className="font-semibold text-red-600 mb-3">Zone de danger</h2>
        <p className="text-sm text-slate-500 mb-4">Désactiver définitivement votre compte vendeur. Toutes vos annonces seront supprimées.</p>
        <button className="px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors">
          Désactiver le compte
        </button>
      </div>
    </div>
  );
}
