import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';
import appLogo from '../../assets/A(1).png';

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 text-white font-display font-bold text-xl mb-4">
              <img src={appLogo} alt="logo" className="h-10 w-auto" />
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Le marché à la croissance la plus rapide en Afrique de l'Ouest. Achetez et vendez tout, partout.
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
              {['Parcourir les produits','Catégories','En vedette','Offres','Nouveautés'].map(item => (
                <li key={item}>
                  <Link to="/products" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sellers */}
          <div>
            <h4 className="text-white font-semibold mb-4">Vendeurs</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Commencer à vendre', to: '/seller/register' },
                { label: 'Connexion vendeur', to: '/seller/login' },
                { label: 'Guide vendeur', to: '#' },
                { label: 'Tarifs', to: '#' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Assistance</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-400">Contactez-nous</span>
              </li>
              <li>
                <a
                  href="https://wa.me/22898467588"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +228 98467588
                </a>
              </li>
              <li>
                <a
                  href="mailto:davidkrus2@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  davidkrus2@gmail.com
                </a>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Politique de cookies</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()}. Tous droits réservés.</p>
          <p>Développé par GUIGI DAVID</p>
        </div>
      </div>
    </footer>
  );
}
