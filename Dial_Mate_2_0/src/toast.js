/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { html } from './jsx.js';

const ToastContext = React.createContext(null);

export function ToastProvider(props) {
  const [toasts, setToasts] = React.useState([]);

  const pushToast = React.useCallback((message, tone = 'default') => {
    const id = String(Date.now()) + Math.random().toString(16).slice(2);
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 2800);
  }, []);

  const value = React.useMemo(() => ({ pushToast }), [pushToast]);

  return html`
    <${ToastContext.Provider} value=${value}>
      ${props.children}
      <div className="fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        ${toasts.map((toast) => html`
          <div
            key=${toast.id}
            className=${`fade-up rounded-lg border px-4 py-3 shadow-medium ${toast.tone === 'success' ? 'border-[hsl(var(--primary)/0.25)] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--foreground))]' : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))]'}`}
          >
            <div className="text-sm font-medium">${toast.message}</div>
          </div>
        `)}
      </div>
    </${ToastContext.Provider}>
  `;
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}