import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiTrendingUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const TRENDING = ['iPhone 15', 'Moto G84', 'Sneakers Nike', 'MacBook Pro', 'Samsung Galaxy', 'Robe Ankara', 'Frigo Samsung', 'Climatiseur'];

const PLACEHOLDER_WORDS = [
  'Rechercher des chaussures…',
  'Rechercher un ordinateur…',
  'Rechercher un téléphone…',
  'Rechercher des vêtements…',
  'Rechercher un véhicule…',
];

export default function SearchBar({
  placeholder,
  large = false,
  className = '',
  onSearch,
  showSuggestions = false,
}) {
  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [isTypingPlaceholder, setIsTypingPlaceholder] = useState(true);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const placeholderTimeout = useRef(null);

  // Animated placeholder (only when showSuggestions=true and field is empty+unfocused)
  useEffect(() => {
    if (!showSuggestions || q || focused) return;

    const current = PLACEHOLDER_WORDS[placeholderIndex];

    if (isTypingPlaceholder && displayedPlaceholder === current) {
      placeholderTimeout.current = setTimeout(() => setIsTypingPlaceholder(false), 1600);
      return;
    }
    if (!isTypingPlaceholder && displayedPlaceholder === '') {
      setIsTypingPlaceholder(true);
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_WORDS.length);
      return;
    }

    const speed = isTypingPlaceholder ? 55 : 35;
    placeholderTimeout.current = setTimeout(() => {
      setDisplayedPlaceholder(
        isTypingPlaceholder
          ? current.slice(0, displayedPlaceholder.length + 1)
          : current.slice(0, displayedPlaceholder.length - 1)
      );
    }, speed);

    return () => clearTimeout(placeholderTimeout.current);
  }, [displayedPlaceholder, isTypingPlaceholder, placeholderIndex, focused, q, showSuggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const submit = (e) => {
    e?.preventDefault?.();
    if (!q.trim()) return;
    setFocused(false);
    if (onSearch) onSearch(q.trim());
    else navigate(`/products?q=${encodeURIComponent(q.trim())}`);
  };

  const selectSuggestion = (term) => {
    setQ(term);
    setFocused(false);
    if (onSearch) onSearch(term);
    else navigate(`/products?q=${encodeURIComponent(term)}`);
  };

  const activePlaceholder = showSuggestions && !q && !focused ? displayedPlaceholder : (placeholder || 'Rechercher…');
  const showDropdown = showSuggestions && focused && !q;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={submit} className="relative flex items-center">
        <FiSearch className={`absolute left-4 text-slate-400 z-10 ${large ? 'w-5 h-5' : 'w-4 h-4'}`} />

        <input
          ref={inputRef}
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={activePlaceholder}
          className={`w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600
                      text-slate-700 dark:text-slate-200 placeholder-slate-400 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200
                      ${large ? 'pl-12 pr-28 py-4 text-base' : 'pl-10 pr-20 py-2.5 text-sm'}
                      ${showDropdown ? 'rounded-b-none border-b-transparent' : ''}`}
        />

        {q && (
          <button
            type="button"
            onClick={() => { setQ(''); inputRef.current?.focus(); }}
            className={`absolute ${large ? 'right-24' : 'right-16'} text-slate-400 hover:text-slate-600 transition-colors z-10`}
          >
            <FiX className="w-4 h-4" />
          </button>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className={`absolute right-2 btn-primary ${large ? 'px-6 py-2' : 'px-3 py-1.5 text-sm'}`}
        >
          {large ? 'Rechercher' : 'Go'}
        </motion.button>
      </form>

      {/* Trending suggestions dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 border-t-0
                       rounded-b-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FiTrendingUp className="w-3.5 h-3.5" /> Recherches tendances
              </p>
            </div>
            <ul className="py-1">
              {TRENDING.map((term, i) => (
                <motion.li
                  key={term}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); selectSuggestion(term); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300
                               hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400
                               flex items-center gap-3 transition-colors"
                  >
                    <FiSearch className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    {term}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
