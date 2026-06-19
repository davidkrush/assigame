import { FiPackage, FiSearch, FiAlertCircle, FiWifi } from 'react-icons/fi';

export function EmptyState({ icon, title, description, action }) {
  const icons = {
    products: <FiPackage className="w-12 h-12 text-slate-300 dark:text-slate-600" />,
    search: <FiSearch className="w-12 h-12 text-slate-300 dark:text-slate-600" />,
    default: <FiPackage className="w-12 h-12 text-slate-300 dark:text-slate-600" />,
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="mb-4">{icons[icon] || icons.default}</div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 dark:text-slate-500 mb-6 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <FiAlertCircle className="w-12 h-12 text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Something went wrong</h3>
      <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">{message || 'Failed to load data.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">Try again</button>
      )}
    </div>
  );
}

export function NetworkError() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <FiWifi className="w-12 h-12 text-slate-400 mb-4" />
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No connection</h3>
      <p className="text-sm text-slate-500 mb-6">Check your internet connection and try again.</p>
      <button onClick={() => window.location.reload()} className="btn-primary">Reload</button>
    </div>
  );
}
