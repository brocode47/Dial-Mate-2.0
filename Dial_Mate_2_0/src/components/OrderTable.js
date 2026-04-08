/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { AlertTriangle, CalendarClock, PhoneCall, RotateCcw, Loader2 } from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { html } from '../jsx.js';
import { useStore } from '../store.js';
import { useToast } from '../toast.js';
import { formatCurrency, getRiskTone, getStatusTone } from '../utils.js';

export function OrderTable(props) {
  const { state, dispatch } = useStore();
  const { pushToast } = useToast();
  const [filter, setFilter] = React.useState('All');
  const [loadingOrderId, setLoadingOrderId] = React.useState(null);

  const orders = React.useMemo(() => {
    if (filter === 'All') return props.orders;
    return props.orders.filter((order) => order.tag === filter || order.status === filter);
  }, [props.orders, filter]);

  const handleCall = async (orderId, outcome) => {
    setLoadingOrderId(orderId);
    try {
      // Local update for immediate feedback
      dispatch({ type: 'CALL_ORDER', orderId, outcome });

      // Backend update if connected
      if (state.backendUrl && state.onboarding.connectedShopify) {
        const shop = state.session.shop.domain;
        const base = state.backendUrl.replace(/\/$/, '');

        // 1. Update tag in Shopify via backend
        const tagRes = await fetch(`${base}/api/shops/${shop}/orders/${orderId}/tag`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: outcome, tag: outcome })
        });

        // 2. Trigger call if "Call Now" or "Retry"
        if (outcome === 'Confirmed' || outcome === 'No Answer') {
          await fetch(`${base}/api/shops/${shop}/orders/${orderId}/call`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'dry_run' }) // Use 'twilio' for real calls
          });
        }

        if (tagRes.ok) {
          pushToast('Order ' + orderId + ' synced with Shopify as ' + outcome, 'success');
        } else {
          pushToast('Order ' + orderId + ' updated locally, but Shopify sync failed.', 'default');
        }
      } else {
        pushToast('Order ' + orderId + ' updated locally (Demo Mode).', 'success');
      }
    } catch (err) {
      console.error('Failed to update order:', err);
      pushToast('Error updating order ' + orderId, 'default');
    } finally {
      setLoadingOrderId(null);
    }
  };

  return html`
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        ${['All', 'Confirmed', 'No Answer', 'Cancelled', 'Reschedule'].map((item) => html`
          <button
            key=${item}
            onClick=${() => setFilter(item)}
            className=${`rounded-full px-3 py-2 text-sm transition-all ${filter === item ? 'bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground)/0.72)] hover:bg-[hsl(var(--primary)/0.08)]'}`}
          >
            ${item}
          </button>
        `)}
      </div>

      <div className="hidden overflow-hidden rounded-[var(--radius-lg)] border border-[hsl(var(--border))] md:block">
        <table className="min-w-full divide-y divide-[hsl(var(--border))]">
          <thead className="bg-[hsl(var(--muted)/0.65)]">
            <tr>
              ${['Order', 'Customer', 'Payment', 'Total', 'Risk', 'Status', 'Actions'].map((head) => html`<th key=${head} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[hsl(var(--foreground)/0.58)]">${head}</th>`)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border))] bg-[hsl(var(--card))]">
            ${orders.map((order) => html`
              <tr key=${order.id} className="transition-all hover:bg-[hsl(var(--muted)/0.35)]">
                <td className="px-4 py-4">
                  <div className="font-semibold">${order.id}</div>
                  <div className="text-sm text-[hsl(var(--foreground)/0.6)]">${order.items?.[0]?.title || 'No items'}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium">${order.customer}</div>
                  <div className="text-sm text-[hsl(var(--foreground)/0.6)]">${order.city} · ${order.phone}</div>
                </td>
                <td className="px-4 py-4 text-sm">${order.payment}</td>
                <td className="px-4 py-4 font-medium">${formatCurrency(order.total)}</td>
                <td className="px-4 py-4">
                  <div className=${`flex items-center gap-2 font-semibold ${getRiskTone(order.risk)}`}>
                    <${AlertTriangle} size=${16} /> ${order.risk}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className=${`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusTone(order.status)}`}>${order.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      disabled=${loadingOrderId === order.id}
                      onClick=${() => handleCall(order.id, 'Confirmed')}
                      className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-3 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      ${loadingOrderId === order.id ? html`<${Loader2} size=${16} className="animate-spin" />` : html`<${PhoneCall} size=${16} />`}
                      Call Now
                    </button>
                    <button
                      disabled=${loadingOrderId === order.id}
                      onClick=${() => handleCall(order.id, 'No Answer')}
                      className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm font-semibold text-[hsl(var(--foreground))] transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      <${RotateCcw} size=${16} /> Retry
                    </button>
                    <button
                      disabled=${loadingOrderId === order.id}
                      onClick=${() => handleCall(order.id, 'Reschedule')}
                      className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm font-semibold text-[hsl(var(--foreground))] transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      <${CalendarClock} size=${16} /> Reschedule
                    </button>
                  </div>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        ${orders.map((order) => html`
          <div key=${order.id} className="soft-card rounded-[var(--radius-lg)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">${order.id}</div>
                <div className="text-sm text-[hsl(var(--foreground)/0.65)]">${order.customer} · ${order.city}</div>
              </div>
              <span className=${`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusTone(order.status)}`}>${order.tag}</span>
            </div>
            <div className="mt-3 text-sm">${order.items?.[0]?.title || 'No items'} · ${order.items?.[0]?.variant || ''}</div>
            <div className="mt-2 text-sm text-[hsl(var(--foreground)/0.62)]">${order.payment} · ${formatCurrency(order.total)}</div>
            <div className=${`mt-2 text-sm font-semibold ${getRiskTone(order.risk)}`}>Risk score ${order.risk}</div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                disabled=${loadingOrderId === order.id}
                onClick=${() => handleCall(order.id, 'Confirmed')}
                className="rounded-xl bg-[hsl(var(--primary))] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Call Now
              </button>
              <button
                disabled=${loadingOrderId === order.id}
                onClick=${() => handleCall(order.id, 'No Answer')}
                className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm font-semibold disabled:opacity-50"
              >
                Retry
              </button>
            </div>
          </div>
        `)}
      </div>
    </div>
  `;
}
