import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import appLogo from '../../assets/A(1).png';

function AuthWrapper({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 flex-shrink-0 mb-4">
            <img src={appLogo} alt="logo" className="h-[120px] w-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className="card p-8">{children}</div>
      </motion.div>
    </div>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
      <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function SellerLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login({ login: form.email, motdepasse: form.password });

    setLoading(false);
    if (result.success) {
      toast.success('Connexion réussie. Bienvenue !');
      navigate('/seller/dashboard');
    } else {
      setError(result.error);
    }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <AuthWrapper title="Connexion vendeur" subtitle="Connectez-vous pour gérer vos annonces">
      <form onSubmit={submit} className="space-y-5">
        <ErrorBanner message={error} />
        <div>
          <label className="label">Adresse email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="email" value={form.email} onChange={set('email')} required placeholder="vous@exemple.com" className="input pl-10" />
          </div>
        </div>
        <div>
          <label className="label">Mot de passe</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type={show ? 'text' : 'password'} value={form.password} onChange={set('password')} required placeholder="••••••••" className="input pl-10 pr-10" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {show ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
          {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : 'Se connecter'}
        </button>
        <p className="text-center text-sm text-slate-500">
          Pas encore de compte ?{' '}
          <Link to="/seller/register" className="text-primary-600 font-medium hover:underline">S'inscrire comme vendeur</Link>
        </p>
      </form>
    </AuthWrapper>
  );
}

export function SellerRegisterPage() {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', phone: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);

    const result = await register({
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      motdepasse: form.password,
      telephone: form.phone,
    });

    setLoading(false);
    if (result.success) {
      toast.success('Compte créé avec succès ! Bienvenue.');
      navigate('/seller/dashboard');
    } else {
      setError(result.error);
    }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <AuthWrapper title="Créer un compte vendeur" subtitle="Commencez à vendre en quelques minutes — c'est gratuit">
      <form onSubmit={submit} className="space-y-4">
        <ErrorBanner message={error} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Prénom</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" value={form.prenom} onChange={set('prenom')} required placeholder="Jean" className="input pl-10" />
            </div>
          </div>
          <div>
            <label className="label">Nom</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" value={form.nom} onChange={set('nom')} required placeholder="Dupont" className="input pl-10" />
            </div>
          </div>
        </div>
        <div>
          <label className="label">Téléphone (WhatsApp)</label>
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="tel" value={form.phone} onChange={set('phone')} required placeholder="+228 90 00 00 00" className="input pl-10" />
          </div>
        </div>
        <div>
          <label className="label">Adresse email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="email" value={form.email} onChange={set('email')} required placeholder="vous@exemple.com" className="input pl-10" />
          </div>
        </div>
        <div>
          <label className="label">Mot de passe</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type={show ? 'text' : 'password'} value={form.password} onChange={set('password')} required placeholder="8 caractères minimum" minLength={8} className="input pl-10 pr-10" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {show ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="label">Confirmer le mot de passe</label>
          <input type="password" value={form.confirm} onChange={set('confirm')} required placeholder="Répétez le mot de passe" className="input" />
        </div>
        <label className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
          <input type="checkbox" required className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600" />
          J'accepte les <Link to="/terms" className="text-primary-600 hover:underline">conditions d'utilisation</Link> et la <Link to="/privacy" className="text-primary-600 hover:underline">politique de confidentialité</Link>
        </label>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
          {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : 'Créer mon compte'}
        </button>
        <p className="text-center text-sm text-slate-500">
          Déjà un compte ?{' '}
          <Link to="/seller/login" className="text-primary-600 font-medium hover:underline">Se connecter</Link>
        </p>
      </form>
    </AuthWrapper>
  );
}
