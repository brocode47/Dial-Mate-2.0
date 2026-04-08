/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { CheckCircle2, Rocket, ShieldCheck, Webhook, ExternalLink, Server, RefreshCw, Loader2 } from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { html } from '../jsx.js';
import { useStore } from '../store.js';
import { useToast } from '../toast.js';
import { PageHeader } from '../components/PageHeader.js';
import { SectionCard } from '../components/SectionCard.js';
import { WidgetPreview } from '../components/WidgetPreview.js';

export function OnboardingPage() {
  const { state, dispatch } = useStore();
  const { pushToast } = useToast();
  const [shopDomain, setShopDomain] = React.useState(state.session.shop.domain || '');
  const [backendUrl, setBackendUrl] = React.useState(state.backendUrl || '');
  const [syncing, setSyncing] = React.useState(false);

  const steps = [
    { label: 'Connect Shopify store', done: state.onboarding.connectedShopify, icon: ShieldCheck, detail: 'Store authenticated and ready for product + order sync.' },
    { label: 'Sync products and policies', done: state.onboarding.syncedPolicies, icon: CheckCircle2, detail: String(state.onboarding.syncedProducts) + ' products and support policies indexed.' },
    { label: 'Enable voice agent', done: state.onboarding.voiceConfigured, icon: Rocket, detail: 'Urdu-first voice persona with fallback rules is configured.' },
    { label: 'Activate webhooks', done: state.onboarding.webhooksActive, icon: Webhook, detail: 'orders/create, orders/updated, and refunds/create are active.' },
    { label: 'Install storefront widget', done: state.onboarding.widgetInstalled, icon: CheckCircle2, detail: 'Show AI confirmation expectations on thank-you and status pages.' }
  ];

  const handleConnect = () => {
    if (!shopDomain) {
      pushToast('Please enter your Shopify shop domain (e.g. your-store.myshopify.com)', 'default');
      return;
    }
    if (!backendUrl) {
      pushToast('Please enter your Backend API URL', 'default');
      return;
    }

    dispatch({ type: 'SET_BACKEND_URL', url: backendUrl });
    dispatch({ type: 'SET_SHOP_DOMAIN', domain: shopDomain });

    // Redirect to Shopify OAuth flow
    const base = backendUrl.replace(/\/$/, '');
    const authUrl = `${base}/auth/shopify?shop=${encodeURIComponent(shopDomain)}`;
    window.location.href = authUrl;
  };

  const handleSync = async () => {
    if (!state.backendUrl || !state.session.shop.domain) {
      pushToast('Please enter your store details first.', 'default');
      return;
    }

    setSyncing(true);
    const shop = state.session.shop.domain;
    const base = state.backendUrl.replace(/\/$/, '');

    try {
      const [ordersRes, callsRes, logsRes] = await Promise.all([
        fetch(`${base}/api/shops/${shop}/orders`),
        fetch(`${base}/api/shops/${shop}/calls`),
        fetch(`${base}/api/shops/${shop}/compliance`)
      ]);

      if (ordersRes.ok && callsRes.ok && logsRes.ok) {
        const [ordersData, callsData, logsData] = await Promise.all([
          ordersRes.json(),
          callsRes.json(),
          logsRes.json()
        ]);

        dispatch({
          type: 'SYNC_DATA',
          orders: ordersData.orders.map(o => ({
            ...o,
            timeline: o.timeline || ['Order synced from Shopify'],
            transcript: o.transcript || 'No transcript available yet.',
            recording: o.recording || 'Pending call...'
          })),
          calls: callsData.calls,
          complianceLogs: logsData.logs.map(l => ({
            ...l,
            time: new Date(l.createdAt).toLocaleTimeString()
          }))
        });
        pushToast('Data synced successfully.', 'success');
      } else {
        pushToast('Could not find data for this shop. Ensure you have completed the Shopify OAuth flow.', 'default');
      }
    } catch (err) {
      pushToast('Error connecting to backend.', 'default');
    } finally {
      setSyncing(false);
    }
  };

  return html`
    <div className="fade-up space-y-6">
      <${PageHeader}
        eyebrow="Launch setup"
        title="Guided onboarding for live deployment"
        description="Take your Shopify store from install to production with voice setup, webhook automation, storefront widget support, and mobile-ready admin access."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <${SectionCard} title="1. Connect your store" subtitle="Enter your Shopify domain and backend URL to start the integration">
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Shopify Domain</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value=${shopDomain}
                    onChange=${(e) => setShopDomain(e.target.value)}
                    placeholder="your-store.myshopify.com"
                    className="flex-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Backend API URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value=${backendUrl}
                    onChange=${(e) => setBackendUrl(e.target.value)}
                    placeholder="https://your-backend-domain.com"
                    className="flex-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm"
                  />
                </div>
                <p className="text-xs text-[hsl(var(--foreground)/0.6)] flex items-center gap-1">
                  <${Server} size=${12} /> This is the URL where your Node.js server is hosted.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick=${handleConnect}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-white shadow-medium transition-all hover:-translate-y-0.5"
                >
                  <${ExternalLink} size=${16} /> Connect Shopify Store
                </button>
                <button
                  onClick=${handleSync}
                  disabled=${syncing}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm font-semibold shadow-soft disabled:opacity-50"
                >
                  ${syncing ? html`<${Loader2} size=${16} className="animate-spin" />` : html`<${RefreshCw} size=${16} />`}
                  Verify Connection & Sync Data
                </button>
              </div>
              ${state.onboarding.connectedShopify && html`
                <div className="mt-2 flex items-center gap-2 text-sm text-[hsl(var(--primary))] font-medium">
                  <${CheckCircle2} size=${16} /> Store connected and synced!
                </div>
              `}
            </div>
          </${SectionCard}>

          <${SectionCard} title="Launch checklist" subtitle="Track production readiness in one place">
            <div className="space-y-4">
              ${steps.map((step, index) => html`
                <div key=${step.label} className="flex gap-4 rounded-[var(--radius-md)] border border-[hsl(var(--border))] p-4">
                  <div className=${`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${step.done ? 'bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground)/0.62)]'}`}>
                    <${step.icon} size=${18} />
                  </div>
                  <div>
                    <div className="font-semibold">${String(index + 1)}. ${step.label}</div>
                    <div className="mt-1 text-sm text-[hsl(var(--foreground)/0.66)]">${step.detail}</div>
                  </div>
                </div>
              `)}
            </div>
          </${SectionCard}>
        </div>

        <${WidgetPreview} />
      </div>
    </div>
  `;
}
