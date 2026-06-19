import { Link } from 'react-router-dom';
import { FiShoppingBag, FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-display font-bold text-xl mb-4">
              <FiShoppingBag className="w-6 h-6 text-primary-400" />
              MarketHub
            </div>
            <p className="text-sm leading-relaxed mb-4">
              West Africa's fastest-growing marketplace. Buy and sell anything, anywhere.
            </p>
            <div className="flex gap-3">
              {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-white font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-sm">
              {['Browse Products','Categories','Featured','Deals','New Arrivals'].map(item => (
                <li key={item}>
                  <Link to="/products" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sellers */}
          <div>
            <h4 className="text-white font-semibold mb-4">Sellers</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Start Selling', to: '/seller/register' },
                { label: 'Seller Login', to: '/seller/login' },
                { label: 'Seller Guide', to: '#' },
                { label: 'Pricing', to: '#' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm">
              {['Help Center','Contact Us','Privacy Policy','Terms of Service','Cookie Policy'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} MarketHub. All rights reserved.</p>
          <p>Made with ❤️ in West Africa</p>
        </div>
      </div>
    </footer>
  );
}
