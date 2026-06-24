// ============================================================
// Adaptateurs : convertissent les DTOs renvoyés par le backend
// Spring Boot (ProduitResponse, CategorieProduit, Utilisateur)
// vers le format attendu par les composants existants
// (ProductCard, ProductDetailPage, etc.)
// ============================================================
import { getCategoryIconConfig } from './categoryIcons';

export const slugify = (str = '') =>
  str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** Normalise le statut produit renvoyé par l'API (ex. "DISPONIBLE" → "disponible"). */
export const normalizeProductStatus = (statut) => {
  const value = (statut || 'disponible').toString().trim().toLowerCase();
  const aliases = {
    active: 'disponible',
    sold: 'vendu',
    suspended: 'suspendu',
  };
  return aliases[value] || value;
};

/**
 * Convertit une catégorie backend { idcategorie_produit, nom_categorieproduit, description }
 * vers { id, name, slug, icon, count }
 */
export const adaptCategory = (cat) => {
  const { Icon, color, bg } = getCategoryIconConfig(cat.nom_categorieproduit);
  return {
    id: cat.idcategorie_produit,
    name: cat.nom_categorieproduit,
    slug: slugify(cat.nom_categorieproduit),
    description: cat.description,
    Icon,
    iconColor: color,
    iconBg: bg,
    count: cat.count ?? 0,
    color: `${bg} ${color}`,
  };
};

/**
 * Convertit un produit backend (ProduitResponse) vers le format
 * utilisé par ProductCard / ProductDetailPage / etc.
 */
export const adaptProduct = (p) => {
  const image = p.image || PLACEHOLDER_IMAGE;
  const sellerName = [p.nom_vendeur, p.prenom_vendeur].filter(Boolean).join(' ').trim() || 'Vendeur';

  return {
    id: p.id_produit,
    title: p.nom_produit,
    description: p.description,
    price: p.prix,
    currency: 'FCFA',
    condition: 'Bon état',
    image,
    images: [image],
    category: {
      id: p.idcategorie_produit,
      name: p.nom_categorieproduit || 'Autre',
      slug: slugify(p.nom_categorieproduit || 'autre'),
    },
    location: 'Togo',
    seller: {
      id: p.id_utilisateur,
      name: sellerName,
      phone: p.telephone_vendeur || '',
      rating: '5.0',
      reviews: 0,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sellerName)}`,
    },
    rating: '5.0',
    reviews: 0,
    isFeatured: false,
    isTrending: false,
    status: normalizeProductStatus(p.statut),
    createdAt: p.date_ajout,
  };
};

/**
 * Convertit la réponse de connexion/inscription du backend (LoginResponse)
 * vers l'objet "user" stocké dans le AuthContext / localStorage.
 */
export const adaptUser = (data) => ({
  id: data.id_utilisateur,
  nom: data.nom,
  prenom: data.prenom,
  name: [data.nom, data.prenom].filter(Boolean).join(' ').trim(),
  email: data.email,
  login: data.login,
  telephone: data.telephone,
  statut: data.statut,
  type: data.typeUtilisateur,
  token: data.token,
});
