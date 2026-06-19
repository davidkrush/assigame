import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function SearchBar({ placeholder = 'Search products…', large = false, className = '', onSearch }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    if (onSearch) onSearch(q.trim());
    else navigate(`/products?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form onSubmit={submit} className={`relative flex items-center ${className}`}>
      <FiSearch className={`absolute left-4 text-slate-400 ${large ? 'w-5 h-5' : 'w-4 h-4'}`} />
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600
                    text-slate-700 dark:text-slate-200 placeholder-slate-400 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all
                    ${large ? 'pl-12 pr-28 py-4 text-base' : 'pl-10 pr-20 py-2.5 text-sm'}`}
      />
      {q && (
        <button
          type="button"
          onClick={() => setQ('')}
          className={`absolute ${large ? 'right-24' : 'right-16'} text-slate-400 hover:text-slate-600`}
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className={`absolute right-2 btn-primary ${large ? 'px-6 py-2' : 'px-3 py-1.5 text-sm'}`}
      >
        {large ? 'Search' : 'Go'}
      </motion.button>
    </form>
  );
}
