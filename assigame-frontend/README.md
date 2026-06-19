# MarketHub — Frontend

A complete marketplace frontend built with React + Vite + Tailwind CSS.

## Stack
- React 18 + Vite
- Tailwind CSS 3
- React Router v6
- Axios
- Framer Motion
- React Icons

## Quick Start

```bash
npm install
cp .env.example .env        # set your API URL
npm run dev
```

## Folder Structure

```
src/
├── api/               # Axios service layer
│   ├── client.js      # Base Axios instance with interceptors
│   ├── auth.js
│   ├── products.js
│   ├── categories.js
│   └── admin.js
├── contexts/          # React Contexts
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── ToastContext.jsx
├── components/
│   ├── common/        # Skeleton, Modal, Pagination, SearchBar, EmptyState
│   ├── buyer/         # Navbar, Footer, ProductCard
│   ├── seller/        # SellerLayout
│   └── admin/         # AdminLayout
├── pages/
│   ├── buyer/         # Home, Products, ProductDetail
│   ├── seller/        # Login, Register, Dashboard, Products, Form, Profile, Settings
│   └── admin/         # Login, Dashboard, Users, Sellers, Products, Categories, Reports, Settings
└── utils/
    └── mockData.js    # Dev mock data + helpers
```

## Routes

### Public (Buyer)
| Route | Page |
|---|---|
| `/` | Home |
| `/products` | Browse with filters |
| `/products/:id` | Product detail + WhatsApp order |

### Seller
| Route | Page |
|---|---|
| `/seller/login` | Login |
| `/seller/register` | Register |
| `/seller/dashboard` | Dashboard |
| `/seller/products` | My Products |
| `/seller/products/new` | Add Product |
| `/seller/products/:id/edit` | Edit Product |
| `/seller/profile` | Profile |
| `/seller/settings` | Settings |

### Admin
| Route | Page |
|---|---|
| `/admin/login` | Login |
| `/admin/dashboard` | Dashboard |
| `/admin/users` | User Management |
| `/admin/sellers` | Seller Management |
| `/admin/products` | Product Management |
| `/admin/categories` | Categories |
| `/admin/reports` | Reports & Analytics |
| `/admin/settings` | Platform Settings |

## API Integration

Connect your backend by setting `VITE_API_URL` in `.env`.
All API calls are in `src/api/`. The mock data in `src/utils/mockData.js` can be replaced by real API calls.

## Features
- ✅ Dark mode (system preference + toggle)
- ✅ Fully responsive (mobile-first)
- ✅ Framer Motion animations
- ✅ Loading skeletons
- ✅ Toast notifications
- ✅ Confirm modals
- ✅ WhatsApp order button
- ✅ Product image gallery
- ✅ Filter + sort + paginate products
- ✅ Seller CRUD (add/edit/delete products)
- ✅ Admin full management panels
