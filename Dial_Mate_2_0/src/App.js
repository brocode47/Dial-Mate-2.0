/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { html } from './jsx.js';
import { AppShell } from './components/AppShell.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { OrdersPage } from './pages/OrdersPage.js';
import { CallsPage } from './pages/CallsPage.js';
import { BillingPage } from './pages/BillingPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { OnboardingPage } from './pages/OnboardingPage.js';
import { hashRoute } from './utils.js';

const routes = {
  '/dashboard': DashboardPage,
  '/orders': OrdersPage,
  '/calls': CallsPage,
  '/billing': BillingPage,
  '/settings': SettingsPage,
  '/onboarding': OnboardingPage
};

export function App() {
  const [route, setRoute] = React.useState(hashRoute());

  React.useEffect(() => {
    const onHashChange = () => setRoute(hashRoute());
    window.addEventListener('hashchange', onHashChange);
    if (!window.location.hash) {
      window.location.hash = '/dashboard';
    }
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const Page = routes[route] || DashboardPage;

  return html`<${AppShell} route=${route}><${Page} /></${AppShell}>`;
}