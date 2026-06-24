import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
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

// Typewriter words that replace "tout"
const TYPEWRITER_WORDS = [
  'des téléphones',
  'des vêtements',
  'des ordinateurs',
  'des véhicules',
  'des sneakers',
  'de l\'électro',
  'des meubles',
  'tout',
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Typewriter component ──────────────────────────────────────────────
function TypewriterWord() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const current = TYPEWRITER_WORDS[wordIndex];

    if (!isDeleting && displayed === current) {
      // Pause then start deleting
      timeoutRef.current = setTimeout(() => setIsDeleting(true), 1800);
      return;
    }
    if (isDeleting && displayed === '') {
      // Move to next word
      setIsDeleting(false);
      setWordIndex((i) => (i + 1) % TYPEWRITER_WORDS.length);
      return;
    }

    const speed = isDeleting ? 45 : 75;
    timeoutRef.current = setTimeout(() => {
      setDisplayed(isDeleting ? current.slice(0, displayed.length - 1) : current.slice(0, displayed.length + 1));
    }, speed);

    return () => clearTimeout(timeoutRef.current);
  }, [displayed, isDeleting, wordIndex]);

  return (
    <span className="text-yellow-300 relative">
      {displayed}
      <span className="inline-block w-0.5 h-[0.85em] bg-yellow-300 ml-0.5 align-middle animate-blink" />
    </span>
  );
}

// ── Animated gradient background orbs ────────────────────────────────
function HeroOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Large orb top-right */}
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(147,197,253,0.25) 0%, transparent 70%)' }}
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Medium orb bottom-left */}
      <motion.div
        className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(253,224,71,0.15) 0%, transparent 70%)' }}
        animate={{ y: [0, -25, 0], x: [0, 18, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      {/* Small accent orb center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
    </div>
  );
}

// ── Animated stat counter ─────────────────────────────────────────────
function AnimatedStat({ value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        className="text-2xl font-bold"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.1, type: 'spring', stiffness: 200 }}
      >
        {value}
      </motion.div>
      <div className="text-sm text-blue-200">{label}</div>
    </motion.div>
  );
}

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

  const sorted = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const featured = sorted.slice(0, 8);
  const trending = sorted.slice(8, 16).length ? sorted.slice(8, 16) : sorted.slice(0, 8);

  return (
    <div className="pt-16">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden gradient-primary">
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 animated-gradient"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8, #2563eb, #0ea5e9, #1d4ed8)',
            backgroundSize: '300% 300%',
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating orbs */}
        <HeroOrbs />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center text-white">
            {/* Badge */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <motion.span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6 border border-white/20 cursor-default"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.18)' }}
              >
                 La marketplace n°1 d'Afrique de l'Ouest
              </motion.span>
            </motion.div>

            {/* Main title with typewriter */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-6xl font-display font-extrabold mb-6 leading-tight"
            >
              Achetez & Vendez<br />
              <TypewriterWord />
              <span className="text-white">, partout</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl mx-auto"
            >
              Connectez-vous avec des milliers de vendeurs locaux. Trouvez les meilleures offres en électronique, mode, véhicules et plus encore.
            </motion.p>

            {/* Enhanced search bar */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="max-w-xl mx-auto">
              <SearchBar
                large
                className="w-full"
                placeholder="Rechercher des produits, marques, catégories…"
                onSearch={(q) => navigate(`/products?q=${encodeURIComponent(q)}`)}
                showSuggestions
              />
            </motion.div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
              {HERO_STATS.map(({ label, value }, i) => (
                <AnimatedStat key={label} value={value} label={label} delay={0.5 + i * 0.1} />
              ))}
            </div>
          </div>
        </div>

        {/* Wave bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" className="w-full h-10 fill-slate-50 dark:fill-slate-900" preserveAspectRatio="none">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" />
          </svg>
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
                initial={{ opacity: 0, scale: 0.85, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 20 }}
              >
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700
                             hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-card-hover transition-all group text-center"
                >
                  <motion.span
                    className={`w-11 h-11 rounded-xl ${cat.iconBg} flex items-center justify-center`}
                    whileHover={{ scale: 1.12, rotate: [0, -6, 6, 0] }}
                    transition={{ duration: 0.35 }}
                  >
                    <cat.Icon className={`w-5 h-5 ${cat.iconColor}`} strokeWidth={2} />
                  </motion.span>
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
              ? featured.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))
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
              : trending.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))
            }
          </div>
        </section>
      )}

      {/* ── TRUST SECTION ── */}
      <section className="bg-slate-900 dark:bg-black py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-bold text-white">Pourquoi nous ?</h2>
            <p className="text-slate-400 mt-2">Conçu pour la confiance, la rapidité et la simplicité.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                className="text-center p-6 rounded-xl bg-slate-800 border border-slate-700 hover:border-primary-700 transition-colors"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-primary-900/50 flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Icon className="w-6 h-6 text-primary-400" />
                </motion.div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELLER CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.div
          className="gradient-accent rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden"
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.97 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Shimmer orb */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <h2 className="text-3xl font-display font-bold mb-4">Prêt à vendre ?</h2>
          <p className="text-orange-100 mb-8 max-w-lg mx-auto">
            Rejoignez plus de 1 200 vendeurs qui gagnent déjà de l'argent sur MarketHub. Publiez votre première annonce en moins de 5 minutes.
          </p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/seller/register"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-accent-600 font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
            >
              Créer un compte vendeur <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
