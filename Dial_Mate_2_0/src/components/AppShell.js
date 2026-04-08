/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { Bell, Bot, CreditCard, LayoutDashboard, Menu, Moon, Phone, Settings, Sparkles, SunMedium, Package, Info } from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { html } from '../jsx.js';
import { useStore } from '../store.js';

const navItems = [
  { href: '#/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '#/orders', label: 'Orders', icon: Package },
  { href: '#/calls', label: 'Calls', icon: Phone },
  { href: '#/billing', label: 'Billing', icon: CreditCard },
  { href: '#/settings', label: 'Settings', icon: Settings },
  { href: '#/onboarding', label: 'Onboarding', icon: Sparkles }
];

export function AppShell(props) {
  const { state, dispatch } = useStore();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return html`
    <div className="min-h-full">
      <div className="mx-auto flex min-h-full max-w-[1600px]">
        <aside className=${`fixed inset-y-0 left-0 z-40 w-72 border-r border-[hsl(var(--border))] bg-[hsl(var(--card)/0.92)] p-5 shadow-medium transition-transform duration-300 md:sticky md:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:block`}>
          <div className="flex items-center justify-between md:block">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,hsla(var(--primary),1),hsla(var(--secondary),1))] text-white shadow-medium">
                  ${state.branding?.logoDataUrl
                    ? html`<img src=${state.branding.logoDataUrl} alt="Company logo" className="h-full w-full object-cover" />`
                    : html`<${Bot} size=${24} />`}
                </div>
                <div>
                  <div className="text-lg font-semibold">Dial Mate 2.0</div>
                  <div className="text-xs text-[hsl(var(--foreground)/0.65)]">Professional AI order confirmation operations</div>
                </div>
              </div>
            </div>
            <button className="rounded-lg border border-[hsl(var(--border))] p-2 md:hidden" onClick=${() => setMenuOpen(false)}>
              <${Menu} size=${18} />
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] p-4 text-[hsl(var(--secondary-foreground,0 0% 100%))] shadow-medium text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-white/70">Connected Store</div>
            <div className="mt-2 text-lg font-semibold">${state.session.shop.name}</div>
            <div className="text-sm text-white/70">${state.session.shop.domain}</div>
            <div className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium">${state.session.shop.plan} plan</div>
          </div>

          ${!state.onboarding.connectedShopify && html`
            <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-amber-600 dark:text-amber-400">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <${Info} size=${14} /> Demo Mode
              </div>
              <div className="mt-1 text-xs">Connect your Shopify store in Onboarding to see real data.</div>
            </div>
          `}

          <nav className="mt-6 space-y-2">
            ${navItems.map((item) => html`
              <a
                key=${item.href}
                href=${item.href}
                onClick=${() => setMenuOpen(false)}
                className=${`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-300 ${props.route === item.href.replace('#', '') ? 'bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))] shadow-soft' : 'text-[hsl(var(--foreground)/0.72)] hover:bg-[hsl(var(--muted))]'}`}
              >
                <${item.icon} size=${18} />
                <span className="font-medium">${item.label}</span>
              </a>
            `)}
          </nav>

          <div className="mt-8 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--primary)/0.08)] p-4">
            <div className="text-sm font-semibold">Voice agent health</div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-[hsl(var(--foreground)/0.7)]">Urdu understanding</span>
              <span className="text-[hsl(var(--primary))]">98.4%</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-[hsl(var(--foreground)/0.7)]">Interruptions handled</span>
              <span className="text-[hsl(var(--primary))]">94%</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-[hsl(var(--foreground)/0.7)]">Human transfer fallback</span>
              <span className="text-[hsl(var(--primary))]">Active</span>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.88)] px-4 py-4 backdrop-blur md:px-8">
            <div className="flex items-center gap-3">
              <button className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 shadow-soft md:hidden" onClick=${() => setMenuOpen((v) => !v)}>
                <${Menu} size=${18} />
              </button>
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-[0.16em] text-[hsl(var(--foreground)/0.55)]">Shopify AI Calling Platform</div>
                <div className="truncate text-lg font-semibold md:text-2xl">Professional Urdu order confirmation with live commerce intelligence</div>
              </div>
              <button className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 shadow-soft transition-all hover:-translate-y-0.5" onClick=${() => dispatch({ type: 'TOGGLE_THEME' })}>
                ${state.theme === 'light' ? html`<${Moon} size=${18} />` : html`<${SunMedium} size=${18} />`}
              </button>
              <div className="hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 shadow-soft sm:block">
                <${Bell} size=${18} />
              </div>
              <div className="hidden items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 shadow-soft sm:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.12)] font-semibold text-[hsl(var(--primary))]">AK</div>
                <div>
                  <div className="text-sm font-semibold">${state.session.user.name}</div>
                  <div className="text-xs text-[hsl(var(--foreground)/0.6)]">${state.session.user.role}</div>
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 py-5 md:px-8 md:py-8">
            ${props.children}
          </main>
        </div>
      </div>
    </div>
  `;
}
