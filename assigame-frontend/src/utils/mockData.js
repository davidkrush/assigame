
export const MOCK_CATEGORIES = [
  { id: 1, name: 'Electronics', slug: 'electronics', icon: '📱', count: 1240, color: 'bg-blue-100 text-blue-700' },
  { id: 2, name: 'Fashion', slug: 'fashion', icon: '👗', count: 3580, color: 'bg-pink-100 text-pink-700' },
  { id: 3, name: 'Home & Garden', slug: 'home-garden', icon: '🏠', count: 920, color: 'bg-green-100 text-green-700' },
  { id: 4, name: 'Vehicles', slug: 'vehicles', icon: '🚗', count: 450, color: 'bg-yellow-100 text-yellow-700' },
  { id: 5, name: 'Sports', slug: 'sports', icon: '⚽', count: 680, color: 'bg-orange-100 text-orange-700' },
  { id: 6, name: 'Books & Media', slug: 'books-media', icon: '📚', count: 1100, color: 'bg-purple-100 text-purple-700' },
  { id: 7, name: 'Health & Beauty', slug: 'health-beauty', icon: '💄', count: 760, color: 'bg-rose-100 text-rose-700' },
  { id: 8, name: 'Baby & Kids', slug: 'baby-kids', icon: '🧸', count: 390, color: 'bg-cyan-100 text-cyan-700' },
];

export const MOCK_PRODUCTS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: [
    'iPhone 13 Pro Max 256GB', 'Samsung 4K Smart TV 55"', 'Nike Air Max 270',
    'MacBook Pro M2 13"', 'Sony WH-1000XM5 Headphones', 'Adidas Ultraboost 22',
    'iPad Air 5th Gen', 'Canon EOS R50 Camera', 'LG Refrigerator 450L',
    'Gaming Chair RGB', 'Vintage Leather Sofa', 'Mountain Bike 21-Speed',
    'Air Fryer XL 5.5L', 'Standing Desk Electric', 'Drone DJI Mini 3',
    'PS5 Console Bundle', 'Espresso Machine Pro', 'Robot Vacuum Cleaner',
    'Electric Scooter 500W', 'Mechanical Keyboard RGB', 'Monitor 27" 144Hz',
    'Blender Professional', 'Yoga Mat Premium', 'Smart Watch Series 8',
  ][i],
  price: [150000, 320000, 45000, 780000, 180000, 55000, 420000, 350000, 290000,
          85000, 450000, 120000, 65000, 280000, 520000, 640000, 95000, 180000,
          220000, 78000, 145000, 42000, 18000, 95000][i],
  currency: 'FCFA',
  condition: ['New','Used','Like New','Refurbished'][i % 4],
  image: `https://picsum.photos/seed/product${i+1}/400/300`,
  images: [
    `https://picsum.photos/seed/product${i+1}/800/600`,
    `https://picsum.photos/seed/product${i+1}a/800/600`,
    `https://picsum.photos/seed/product${i+1}b/800/600`,
  ],
  category: MOCK_CATEGORIES[i % 8],
  location: ['Lomé, Togo','Cotonou, Bénin','Accra, Ghana','Abidjan, CI','Lagos, Nigeria'][i % 5],
  seller: {
    id: (i % 5) + 1,
    name: ['Tech Store Lomé','Fashion Hub','HomeDeco GH','VehiclePro','SportZone'][i % 5],
    phone: '+228 90 00 00 ' + String(i).padStart(2,'0'),
    rating: (3.5 + (i % 5) * 0.3).toFixed(1),
    reviews: 12 + i * 7,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${['Tech Store Lomé','Fashion Hub','HomeDeco GH','VehiclePro','SportZone'][i % 5]}`,
  },
  rating: (3.8 + (i % 4) * 0.2).toFixed(1),
  reviews: 5 + i * 3,
  description: `High-quality ${['iPhone 13 Pro Max 256GB', 'Samsung 4K Smart TV 55"', 'Nike Air Max 270',
    'MacBook Pro M2 13"', 'Sony WH-1000XM5 Headphones', 'Adidas Ultraboost 22',
    'iPad Air 5th Gen', 'Canon EOS R50 Camera', 'LG Refrigerator 450L',
    'Gaming Chair RGB', 'Vintage Leather Sofa', 'Mountain Bike 21-Speed',
    'Air Fryer XL 5.5L', 'Standing Desk Electric', 'Drone DJI Mini 3',
    'PS5 Console Bundle', 'Espresso Machine Pro', 'Robot Vacuum Cleaner',
    'Electric Scooter 500W', 'Mechanical Keyboard RGB', 'Monitor 27" 144Hz',
    'Blender Professional', 'Yoga Mat Premium', 'Smart Watch Series 8'][i]} in excellent condition. This item has been carefully used and is ready for a new owner. All original accessories included. Contact seller for more information or to arrange viewing.`,
  isFeatured: i % 6 === 0,
  isTrending: i % 4 === 0,
  status: ['active','active','active','pending','active','sold'][i % 6],
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

export const MOCK_SELLER_STATS = {
  totalProducts: 24,
  activeProducts: 18,
  totalViews: 1842,
  totalMessages: 47,
};

export const MOCK_ADMIN_STATS = {
  totalUsers: 12480,
  totalSellers: 1240,
  totalProducts: 45620,
  revenue: '24,500,000',
  newUsersToday: 48,
  ordersToday: 127,
  activeListings: 38940,
  pendingReview: 83,
};

export const CONDITION_OPTIONS = ['New','Like New','Used','Refurbished','For Parts'];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'oldest', label: 'Plus anciens' },
  { value: 'price_asc', label: 'Prix : croissant' },
  { value: 'price_desc', label: 'Prix : décroissant' },
];

export const formatPrice = (price, currency = 'FCFA') => {
  return `${Number(price).toLocaleString('fr-FR')} ${currency}`;
};

export const getStatusBadge = (status) => {
  const key = (status || '').toString().trim().toLowerCase();
  const map = {
    active: 'badge-green',
    pending: 'badge-yellow',
    sold: 'badge-gray',
    rejected: 'badge-red',
    suspended: 'badge-red',
    disponible: 'badge-green',
    vendu: 'badge-gray',
    suspendu: 'badge-red',
  };
  return map[key] || 'badge-gray';
};
