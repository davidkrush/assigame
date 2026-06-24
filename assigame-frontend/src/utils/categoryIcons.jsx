import {
  Gamepad2, Shirt, Phone, Monitor, Refrigerator, BookOpen, Puzzle,
  Dumbbell, Sparkles, Car, ShoppingBag,
} from 'lucide-react';

const normalize = (str = '') =>
  str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const CATEGORY_RULES = [
  {
    keywords: ['jeux video', 'jeux vidéo', 'console', 'gaming', 'video game'],
    Icon: Gamepad2,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-100 dark:bg-violet-900/30',
  },
  {
    keywords: ['mode', 'chaussure', 'vetement', 'vêtement', 'fashion', 'habillement'],
    Icon: Shirt,
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-100 dark:bg-pink-900/30',
  },
  {
    keywords: ['telephone', 'téléphone', 'tablette', 'mobile', 'smartphone'],
    Icon: Phone,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    keywords: ['informatique', 'ordinateur', 'computer', ' pc', 'pc ', 'laptop'],
    Icon: Monitor,
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
  },
  {
    keywords: ['electromenager', 'électroménager', 'menager', 'appliance'],
    Icon: Refrigerator,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  {
    keywords: ['livre', 'etude', 'étude', 'book', 'scolaire', 'education'],
    Icon: BookOpen,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  {
    keywords: ['jeux de societe', 'jeux de société', 'jouet', 'toy', 'puzzle', 'board game'],
    Icon: Puzzle,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
  },
  {
    keywords: ['sport', 'loisir', 'fitness', 'outdoor'],
    Icon: Dumbbell,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
  },
  {
    keywords: ['beaute', 'beauté', 'sante', 'santé', 'health', 'cosmetique', 'cosmétique'],
    Icon: Sparkles,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-100 dark:bg-rose-900/30',
  },
  {
    keywords: ['auto', 'moto', 'vehicule', 'véhicule', 'automobile', 'accessoire auto'],
    Icon: Car,
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800',
  },
];

const DEFAULT_CONFIG = {
  Icon: ShoppingBag,
  color: 'text-primary-600 dark:text-primary-400',
  bg: 'bg-primary-100 dark:bg-primary-900/30',
};

export function getCategoryIconConfig(name = '') {
  const normalized = normalize(name);
  const rule = CATEGORY_RULES.find(({ keywords }) =>
    keywords.some((kw) => normalized.includes(normalize(kw)))
  );
  return rule ?? DEFAULT_CONFIG;
}

export function CategoryIcon({ name, size = 18, className = '', withBackground = false }) {
  const { Icon, color, bg } = getCategoryIconConfig(name);

  if (withBackground) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-lg ${bg} ${className}`}
        style={{ width: size + 10, height: size + 10 }}
      >
        <Icon size={size} className={color} strokeWidth={2} />
      </span>
    );
  }

  return <Icon size={size} className={`${color} ${className}`.trim()} strokeWidth={2} />;
}
