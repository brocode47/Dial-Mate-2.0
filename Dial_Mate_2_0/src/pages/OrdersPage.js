/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { ListFilter, WandSparkles, RefreshCw, Loader2 } from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { html } from '../jsx.js';
import { useStore } from '../store.js';
import { useToast } from '../toast.js';
import { PageHeader } from '../components/PageHeader.js';
import { SectionCard } from '../components/SectionCard.js';
import { OrderTable } from '../components/OrderTable.js';

export function OrdersPage() {
  const { state, dispatch } = useStore();
  const { pushToast } = useToast();
  const [syncing, setSyncing] = React.useState(false);

  const handleSync = async () => {
    if (!state.backendUrl || !state.onboarding.connectedShopify) {
      pushToast('Please connect your Shopify store in Onboarding first.', 'default');
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
        pushToast('Data synced from Shopify successfully.', 'success');
      } else {
        pushToast('Failed to sync data from backend.', 'default');
      }
    } catch (err) {
      pushToast('Error connecting to backend.', 'default');
    } finally {
      setSyncing(false);
    }
  };

  const handleAutoConfirm = () => {
    const lowRiskOrders = state.orders.filter(o => o.risk < 20 && o.status === 'Pending Confirmation');
    if (lowRiskOrders.length === 0) {
      pushToast('No low-risk orders found for auto-confirmation.', 'default');
      return;
    }

    lowRiskOrders.forEach(o => {
      dispatch({ type: 'CALL_ORDER', orderId: o.id, outcome: 'Confirmed' });
    });
    pushToast(`Auto-confirmed ${lowRiskOrders.length} low-risk orders.`, 'success');
  };

  return html`
    <div className="fade-up space-y-6">
      <${PageHeader}
        eyebrow="Order management"
        title="Real-time Shopify confirmation workflow"
        description="The AI agent contacts customers immediately after checkout, addresses common questions using synchronized product and policy data, and updates Shopify tags such as Confirmed, No Answer, Cancelled, and Reschedule in real time."
        actions=${html`
          <button
            onClick=${handleSync}
            disabled=${syncing}
            className="inline-flex items-center gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm font-semibold shadow-soft disabled:opacity-50"
          >
            ${syncing ? html`<${Loader2} size=${16} className="animate-spin" />` : html`<${RefreshCw} size=${16} />`}
            Sync Now
          </button>
          <button className="inline-flex items-center gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm font-semibold shadow-soft">
            <${ListFilter} size=${16} /> Smart Filters
          </button>
          <button
            onClick=${handleAutoConfirm}
            className="inline-flex items-center gap-2 rounded-2xl bg-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-white shadow-medium transition-all hover:-translate-y-0.5"
          >
            <${WandSparkles} size=${16} /> Auto-confirm Eligible Orders
          </button>
        `}
      />

      <${SectionCard} title="Order table" subtitle="Use one-click calling actions and review fraud signals before dispatch">
        <${OrderTable} orders=${state.orders} />
      </${SectionCard}>
    </div>
  `;
}
