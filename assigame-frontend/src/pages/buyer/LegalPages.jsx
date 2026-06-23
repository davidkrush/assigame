import { Link } from 'react-router-dom';

export function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Link to="/seller/register" className="text-primary-600 hover:underline text-sm font-medium">← Retour à l'inscription vendeur</Link>
          <h1 className="text-4xl font-bold mt-6 mb-4">Conditions d'utilisation</h1>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            Merci de lire attentivement ces conditions d'utilisation avant de créer votre compte vendeur. En utilisant ce site, vous acceptez les règles définies ci-dessous.
          </p>
        </div>

        <section className="space-y-6 text-slate-700 dark:text-slate-200">
          <div>
            <h2 className="text-2xl font-semibold mb-2">1. Accès au service</h2>
            <p>Le service est offert aux vendeurs qui respectent les lois en vigueur et fournissent des informations exactes lors de l'inscription.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">2. Inscription</h2>
            <p>La création d'un compte vendeur implique l'acceptation des présentes conditions. Vous devez conserver la confidentialité de vos identifiants et informer immédiatement le service en cas d'utilisation non autorisée.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">3. Utilisation de la plateforme</h2>
            <p>Vous vous engagez à ne publier que des annonces conformes, justes et légales. Les contenus illicites, trompeurs ou violant les droits de tiers sont interdits.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">4. Suspension et retrait</h2>
            <p>Le site se réserve le droit de suspendre ou supprimer un compte en cas de non-respect de ces conditions.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">5. Modifications</h2>
            <p>Ces conditions peuvent être mises à jour à tout moment. Les utilisateurs sont invités à consulter cette page régulièrement.</p>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-6 text-sm text-slate-500 dark:text-slate-400">
          <p>Ces conditions d'utilisation sont proposées par le fondateur du site.</p>
          <p className="mt-2">Fondé par GUIDI DAVID.</p>
        </footer>
      </div>
    </main>
  );
}

export function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Link to="/seller/register" className="text-primary-600 hover:underline text-sm font-medium">← Retour à l'inscription vendeur</Link>
          <h1 className="text-4xl font-bold mt-6 mb-4">Politique de confidentialité</h1>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            Cette politique explique comment les données des vendeurs sont collectées, utilisées et protégées sur la plateforme.
          </p>
        </div>

        <section className="space-y-6 text-slate-700 dark:text-slate-200">
          <div>
            <h2 className="text-2xl font-semibold mb-2">1. Données collectées</h2>
            <p>Nous collectons les informations nécessaires à la création et la gestion du compte vendeur, notamment nom, prénom, email, téléphone et détails de contact.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">2. Finalités</h2>
            <p>Ces données sont utilisées pour authentifier le vendeur, gérer les commandes et améliorer l'expérience sur la marketplace.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">3. Partage des données</h2>
            <p>Les informations personnelles ne sont pas vendues à des tiers. Elles peuvent être partagées avec des prestataires de service uniquement pour l'exécution du site.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">4. Sécurité</h2>
            <p>Nous mettons en œuvre des mesures raisonnables pour protéger vos données contre l'accès non autorisé et la divulgation.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">5. Droits des utilisateurs</h2>
            <p>Vous pouvez demander la modification ou la suppression de vos informations personnelles en contactant l'équipe du site.</p>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-6 text-sm text-slate-500 dark:text-slate-400">
          <p>Politique de confidentialité publiée par le fondateur du site.</p>
          <p className="mt-2">Fondé par GUIDI DAVID.</p>
        </footer>
      </div>
    </main>
  );
}
