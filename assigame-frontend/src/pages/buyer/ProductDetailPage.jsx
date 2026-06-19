import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiChevronLeft, FiChevronRight, FiShield, FiShare2, FiHeart, FiAlertCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { formatPrice } from '../../utils/mockData';
import { adaptProduct } from '../../utils/adapters';
import ProductCard from '../../components/buyer/ProductCard';
import { Skeleton } from '../../components/common/Skeleton';
import { productsApi } from '../../api/products';
import { getErrorMessage } from '../../api/client';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgIdx, setImgIdx] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    productsApi.getById(id)
      .then(({ data }) => {
        const adapted = adaptProduct(data);
        setProduct(adapted);
        // Charger les produits de la même catégorie pour les "articles similaires"
        if (data.idcategorie_produit) {
          productsApi.getByCategorie(data.idcategorie_produit)
            .then(({ data: cats }) =>
              setRelated(cats.map(adaptProduct).filter(p => p.id !== adapted.id).slice(0, 4))
            )
            .catch(() => setRelated([]));
        }
      })
      .catch((err) => setError(getErrorMessage(err, 'Impossible de charger ce produit.')))
      .finally(() => setLoading(false));
  }, [id]);

  const handleWhatsApp = () => {
    if (!product?.seller?.phone) return;
    const msg = encodeURIComponent(
      `Bonjour ! Je suis intéressé(e) par votre annonce : *${product.title}* au prix de *${formatPrice(product.price, product.currency)}* sur MarketHub. Est-ce encore disponible ?`
    );
    const phone = product.seller.phone.replace(/\s+/g, '').replace(/^\+/, '');
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-10">
            <Skeleton className="h-96 rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-24" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
            <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <Link to="/products" className="btn-secondary mt-4 inline-flex">← Retour aux produits</Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-primary-600">Accueil</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600">Produits</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category.slug}`} className="hover:text-primary-600">{product.category.name}</Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300 line-clamp-1 max-w-xs">{product.title}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 aspect-square">
              <motion.img
                key={imgIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images?.[imgIdx] || product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx(i => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setImgIdx(i => (i + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-2xl font-display font-bold leading-snug">{product.title}</h1>
              <button
                onClick={() => setLiked(!liked)}
                className={`flex-shrink-0 p-2.5 rounded-xl border transition-all ${liked ? 'border-red-300 bg-red-50 text-red-500' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-400'}`}
              >
                <FiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">
              {formatPrice(product.price, product.currency)}
            </p>

            <div className="card p-4 mb-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{product.description}</p>
            </div>

            {/* Catégorie */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
              <span className="font-medium">Catégorie :</span>
              <Link to={`/products?category=${product.category.slug}`} className="text-primary-600 hover:underline">{product.category.name}</Link>
            </div>

            {/* Seller Card */}
            <div className="card p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  className="w-12 h-12 rounded-xl bg-slate-200"
                />
                <div>
                  <p className="font-semibold text-sm">{product.seller.name}</p>
                  {product.seller.phone && (
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <FiMapPin className="w-3 h-3" />
                      {product.seller.phone}
                    </p>
                  )}
                </div>
                <div className="ml-auto flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                  <FiShield className="w-3 h-3" />
                  Vérifié
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {product.seller.phone ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsApp}
                  className="btn-whatsapp flex-1 justify-center text-base py-3.5"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Commander via WhatsApp
                </motion.button>
              ) : (
                <div className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 text-center">
                  Le vendeur n'a pas renseigné de numéro WhatsApp.
                </div>
              )}
              <button className="btn-secondary px-4">
                <FiShare2 className="w-4 h-4" />
              </button>
            </div>

            {product.seller.phone && (
              <p className="text-xs text-slate-400 mt-3 text-center">
                Cliquer sur "Commander via WhatsApp" ouvrira WhatsApp avec un message pré-rempli pour le vendeur.
              </p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-display font-bold mb-6">Articles similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
