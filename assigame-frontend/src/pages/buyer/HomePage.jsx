import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiTruck, FiMessageCircle, FiStar } from 'react-icons/fi';
import ProductCard from '../../components/buyer/ProductCard';
import SearchBar from '../../components/common/SearchBar';
import { ProductCardSkeleton } from '../../components/common/Skeleton';
import { productsApi } from '../../api/products';
import { categoriesApi } from '../../api/categories';
import { adaptProduct, adaptCategory } from '../../utils/adapters';

const HERO_STATS = [
  { label: 'Annonces actives', value: '45K+' },
  { label: 'Vendeurs satisfaits', value: '1.2K+' },
  { label: 'Acheteurs par mois', value: '120K+' },
];

const TRUST_ITEMS = [
  { icon: FiShield, title: 'Vendeurs vérifiés', desc: 'Chaque vendeur est vérifié avant de publier une annonce.' },
  { icon: FiTruck, title: 'Livraison locale', desc: 'Échangez avec des vendeurs proches de vous pour un retrait rapide.' },
  { icon: FiMessageCircle, title: 'WhatsApp direct', desc: 'Contactez les vendeurs directement en un clic.' },
  { icon: FiStar, title: 'Avis acheteurs', desc: 'Des évaluations honnêtes de vrais acheteurs de votre communauté.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      productsApi.getAll().then(({ data }) => setProducts(data.map(adaptProduct))).catch(() => setProducts([])),
      categoriesApi.getAll().then(({ data }) => setCategories(data.map(adaptCategory))).catch(() => setCategories([])),
    ]).finally(() => setLoading(false));
  }, []);

  // En attendant un vrai système de mise en avant côté backend, on
  // affiche simplement les produits les plus récents dans les deux sections.
  const sorted = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const featured = sorted.slice(0, 8);
  const trending = sorted.slice(8, 16).length ? sorted.slice(8, 16) : sorted.slice(0, 8);

  return (
    <div className="pt-16">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden gradient-primary">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center text-white">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6 border border-white/20">
                🌍 La marketplace n°1 d'Afrique de l'Ouest
              </span>
            </motion.div>
            <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
              className="text-4xl md:text-6xl font-display font-extrabold mb-6 leading-tight"
            >
              Achetez & Vendez<br />
              <span className="text-yellow-300">tout,</span> partout
            </motion.h1>
            <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl mx-auto"
            >
              Connectez-vous avec des milliers de vendeurs locaux. Trouvez les meilleures offres en électronique, mode, véhicules et plus encore.
            </motion.p>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="max-w-xl mx-auto">
              <SearchBar
                large
                className="w-full"
                placeholder="Rechercher des produits, marques, catégories…"
                onSearch={(q) => navigate(`/products?q=${encodeURIComponent(q)}`)}
              />
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}
              className="flex items-center justify-center gap-8 mt-10 flex-wrap"
            >
              {HERO_STATS.map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-sm text-blue-200">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold">Parcourir par catégorie</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Trouvez ce que vous cherchez, rapidement.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700
                             hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-card-hover transition-all group text-center"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ── */}
      <section className="bg-slate-100 dark:bg-slate-800/50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold">Produits en vedette</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Des offres triées pour vous.</p>
            </div>
            <Link to="/products" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
              Voir tout <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.length
                ? featured.map(p => <ProductCard key={p.id} product={p} />)
                : <p className="text-slate-500 col-span-full text-center py-8">Aucun produit pour l'instant.</p>
            }
          </div>
        </div>
      </section>

      {/* ── TRENDING ── */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold">🔥 Tendances du moment</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Ce que tout le monde achète cette semaine.</p>
            </div>
            <Link to="/products" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
              Voir tout <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : trending.map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>
        </section>
      )}

      {/* ── TRUST SECTION ── */}
      <section className="bg-slate-900 dark:bg-black py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-bold text-white">Pourquoi MarketHub ?</h2>
            <p className="text-slate-400 mt-2">Conçu pour la confiance, la rapidité et la simplicité.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-xl bg-slate-800 border border-slate-700">
                <div className="w-12 h-12 rounded-xl bg-primary-900/50 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELLER CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="gradient-accent rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Prêt à vendre ?</h2>
          <p className="text-orange-100 mb-8 max-w-lg mx-auto">
            Rejoignez plus de 1 200 vendeurs qui gagnent déjà de l'argent sur MarketHub. Publiez votre première annonce en moins de 5 minutes.
          </p>
          <Link to="/seller/register" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-accent-600 font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-lg">
            Créer un compte vendeur <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
