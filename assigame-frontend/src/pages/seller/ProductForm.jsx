import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiX, FiImage, FiAlertCircle } from 'react-icons/fi';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { productsApi } from '../../api/products';
import { categoriesApi } from '../../api/categories';
import { getErrorMessage } from '../../api/client';
import { adaptCategory } from '../../utils/adapters';

const INITIAL = {
  nom_produit: '', description: '', prix: '', image: '', idcategorie_produit: '',
};

// IMPORTANT : ce composant doit être défini EN DEHORS de ProductForm.
// Sinon React le considère comme un nouveau composant à chaque rendu
// et démonte/remonte le champ de saisie à chaque frappe (le clavier
// "se bloque" après chaque lettre).
function Field({ label, required, children }) {
  return (
    <div>
      <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const [form, setForm] = useState(INITIAL);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: cats } = await categoriesApi.getAll();
        if (cancelled) return;
        setCategories(cats.map(adaptCategory));

        if (isEdit) {
          const { data: p } = await productsApi.getById(id);
          if (cancelled) return;
          setForm({
            nom_produit: p.nom_produit || '',
            description: p.description || '',
            prix: String(p.prix ?? ''),
            image: p.image || '',
            idcategorie_produit: p.idcategorie_produit ?? '',
          });
          setPreview(p.image || '');
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, 'Impossible de charger les données du formulaire.'));
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id, isEdit]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImage = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Aperçu local immédiat
  setPreview(URL.createObjectURL(file));

  try {
    const { data } = await productsApi.uploadImage(file);
    setForm(f => ({ ...f, image: data.url }));
  } catch (err) {
    setError("Échec de l'upload de l'image.");
    setPreview('');
    setForm(f => ({ ...f, image: '' }));
  }
};

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user?.id) {
      setError('Vous devez être connecté pour publier un produit.');
      return;
    }

    setLoading(true);
    const payload = {
      nom_produit: form.nom_produit,
      description: form.description,
      prix: Number(form.prix) || 0,
      image: form.image,
      idcategorie_produit: Number(form.idcategorie_produit),
      id_utilisateur: user.id,
      statut: 'disponible',
    };

    try {
      if (isEdit) {
        await productsApi.update(id, payload);
        toast.success('Produit mis à jour avec succès !');
      } else {
        await productsApi.create(payload);
        toast.success('Produit publié avec succès !');
      }
      navigate('/seller/products');
    } catch (err) {
      setError(getErrorMessage(err, "La publication du produit a échoué."));
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-6 animate-pulse h-96" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">{isEdit ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</h1>
        <p className="text-slate-500 text-sm mt-1">{isEdit ? 'Mettez à jour les détails de votre annonce.' : 'Remplissez les informations pour publier votre annonce.'}</p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Image */}
        <div className="card p-6">
          <h2 className="font-semibold mb-4 text-sm">Photo du produit</h2>
          <div className="flex items-center gap-4">
            {preview ? (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                <img src={preview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setPreview(''); setForm(f => ({ ...f, image: '' })); }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                <FiImage className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs text-slate-400">Ajouter</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            )}
            <p className="text-xs text-slate-400 flex-1">JPG, PNG, WebP acceptés. L'upload de fichiers sera connecté prochainement — pour l'instant, vous pouvez aussi coller une URL d'image ci-dessous.</p>
          </div>
          <div className="mt-3">
            <Field label="URL de l'image">
              <input type="text" value={form.image} onChange={(e) => { set('image')(e); setPreview(e.target.value); }} placeholder="https://..." className="input" />
            </Field>
          </div>
        </div>

        {/* Basic Info */}
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-sm">Détails du produit</h2>

          <Field label="Titre du produit" required>
            <input type="text" value={form.nom_produit} onChange={set('nom_produit')} required maxLength={50} placeholder="ex. iPhone 13 Pro Max 256Go, Gris sidéral" className="input" />
            <p className="text-xs text-slate-400 mt-1">{form.nom_produit.length}/50 caractères</p>
          </Field>

          <Field label="Description" required>
            <textarea
              value={form.description} onChange={set('description')} required
              rows={4} maxLength={200}
              placeholder="Décrivez votre produit : état, boîte d'origine, accessoires inclus, raison de la vente…"
              className="input resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">{form.description.length}/200 caractères</p>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Prix (FCFA)" required>
              <input
                type="number" value={form.prix} onChange={set('prix')}
                required min="0" placeholder="0"
                className="input"
              />
            </Field>

            <Field label="Catégorie" required>
              <select value={form.idcategorie_produit} onChange={set('idcategorie_produit')} required className="input">
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>
          {categories.length === 0 && (
            <p className="text-xs text-amber-600 flex items-center gap-1.5">
              <FiAlertCircle className="w-3.5 h-3.5" />
              Aucune catégorie disponible. Demandez à un administrateur d'en ajouter dans "Catégories".
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Annuler</button>
          <button type="submit" disabled={loading} className="btn-primary min-w-32 justify-center">
            {loading
              ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              : isEdit ? 'Enregistrer les modifications' : "Publier l'annonce"
            }
          </button>
        </div>
      </form>
    </div>
  );
}
