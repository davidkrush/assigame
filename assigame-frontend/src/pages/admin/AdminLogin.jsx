import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { authApi } from '../../api/auth';
import { getErrorMessage } from '../../api/client';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await authApi.login({
        login: form.email,
        motdepasse: form.password,
      });

      // Vérifier que c'est bien un admin (type contenant "admin")
      const type = (data.typeUtilisateur || '').toLowerCase();
      if (!type.includes('admin')) {
        setError("Ce compte n'a pas les droits administrateur. Contactez le super-administrateur.");
        setLoading(false);
        return;
      }

      // Stocker la session admin séparément du compte vendeur
      localStorage.setItem('admin_token', data.token || '');
      localStorage.setItem('admin_user', JSON.stringify({
        id: data.id_utilisateur,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        type: data.typeUtilisateur,
      }));

      navigate('/admin/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'Identifiants incorrects. Vérifiez votre email et mot de passe.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 mb-4">
            <FiShield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Accès Administrateur</h1>
          <p className="text-slate-400 mt-1 text-sm">Réservé au personnel autorisé</p>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
          <form onSubmit={submit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-900/30 border border-red-800 text-red-400 text-sm">
                <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Adresse email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="email" required
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@exemple.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Mot de passe</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type={show ? 'text' : 'password'} required
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  {show ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading
                ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                : <><FiShield className="w-4 h-4" /> Se connecter à l'administration</>
              }
            </button>
          </form>

          <div className="mt-6 p-3 rounded-xl bg-slate-700/50 border border-slate-600">
            <p className="text-xs text-slate-400 text-center">
              🔒 Accès surveillé. Les tentatives non autorisées sont enregistrées.
            </p>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-blue-900/20 border border-blue-800/50">
            <p className="text-xs text-blue-400 text-center">
              💡 Le compte doit avoir le type "Admin" dans la base de données pour accéder à ce panneau.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
