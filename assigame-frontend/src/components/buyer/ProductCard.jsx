import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar } from 'react-icons/fi';
import { formatPrice, getStatusBadge } from '../../utils/mockData';

export default function ProductCard({ product, showStatus = false }) {
  const conditionColors = {
    'New': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Like New': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Used': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Refurbished': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card overflow-hidden group cursor-pointer"
    >
      <Link to={`/products/${product.id}`}>
        <div className="relative overflow-hidden h-48 bg-slate-100 dark:bg-slate-700">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.isFeatured && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-semibold bg-accent-500 text-white">
              En vedette
            </span>
          )}
          {product.isTrending && (
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-xs font-semibold bg-primary-600 text-white">
              🔥 Tendance
            </span>
          )}
          {showStatus && product.status && (
            <span className={`absolute bottom-2 left-2 ${getStatusBadge(product.status)} capitalize`}>
              {product.status}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.title}
          </h3>
          <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            {formatPrice(product.price, product.currency)}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${conditionColors[product.condition] || 'bg-slate-100 text-slate-600'}`}>
              {product.condition}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <FiStar className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {product.rating}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <FiMapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{product.location}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
