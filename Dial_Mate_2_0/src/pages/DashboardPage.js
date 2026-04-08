/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { Activity, BadgeCheck, CircleDollarSign, PhoneForwarded, ShieldAlert, TimerReset, PhoneCall, RotateCcw, Loader2 } from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { html } from '../jsx.js';
import { useStore } from '../store.js';
import { useToast } from '../toast.js';
import { PageHeader } from '../components/PageHeader.js';
import { SectionCard } from '../components/SectionCard.js';
import { StatCard } from '../components/StatCard.js';
import { formatCurrency } from '../utils.js';

export function DashboardPage() {
  const { state, dispatch } = useStore();
  const { pushToast } = useToast();
  const [loadingOrderId, setLoadingOrderId] = React.useState(null);

  const pendingOrders = state.orders.filter((order) => order.status !== 'Confirmed' && order.status !== 'Cancelled');

  const handleCall = async (orderId, outcome) => {
    setLoadingOrderId(orderId);
    try {
      dispatch({ type: 'CALL_ORDER', orderId, outcome });

      if (state.backendUrl && state.onboarding.connectedShopify) {
        const shop = state.session.shop.domain;
        const base = state.backendUrl.replace(/\/$/, '');

        await fetch(`${base}/api/shops/${shop}/orders/${orderId}/tag`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: outcome, tag: outcome })
        });

        if (outcome === 'Confirmed' || outcome === 'No Answer') {
          await fetch(`${base}/api/shops/${shop}/orders/${orderId}/call`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'dry_run' })
          });
        }
        pushToast('Order ' + orderId + ' synced with Shopify.', 'success');
      } else {
        pushToast('Order ' + orderId + ' updated (Demo Mode).', 'success');
      }
    } catch (err) {
      pushToast('Error updating order ' + orderId, 'default');
    } finally {
      setLoadingOrderId(null);
    }
  };

  return html`
    <div className="fade-up space-y-6">
      <${PageHeader}
        eyebrow="Executive overview"
        title="Professional order confirmation intelligence for Urdu-first commerce"
        description="Review operational performance, identify high-risk COD orders, and enable the AI agent to answer delivery, stock, returns, and order-edit queries from live Shopify data with confidence."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <${StatCard} icon=${PhoneForwarded} label="Calls today" value=${String(state.analytics.callsToday)} help="Outbound confirmations and retries across all channels" />
        <${StatCard} icon=${BadgeCheck} label="Confirmed orders" value=${String(state.analytics.confirmations)} help="Orders verified by live Urdu conversation" />
        <${StatCard} icon=${Activity} label="Connection rate" value=${state.analytics.connectionRate + '%'} help="Connected calls against total attempts" />
        <${StatCard} icon=${CircleDollarSign} label="Recovered revenue" value=${formatCurrency(state.analytics.recoveredRevenue)} help="Prevented cancellations and COD leakage" />
        <${StatCard} icon=${ShieldAlert} label="Fraud prevented" value=${String(state.analytics.fraudPrevented)} help="Duplicate and risky orders blocked before dispatch" />
        <${StatCard} icon=${TimerReset} label="Avg handle time" value=${state.analytics.avgHandleTime} help="Fast, interruption-safe Urdu calls" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <${SectionCard} title="Live queue" subtitle="Orders awaiting AI action, scheduled callback, or manual review">
          <div className="space-y-4">
            ${pendingOrders.length === 0 ? html`<div className="py-8 text-center text-[hsl(var(--foreground)/0.5)]">No pending orders in queue.</div>` : pendingOrders.map((order) => html`
              <div key=${order.id} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.32)] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-lg font-semibold">${order.id} · ${order.customer}</div>
                    <div className="mt-1 text-sm text-[hsl(var(--foreground)/0.66)]">${order.items?.[0]?.title || 'No items'} · ${order.items?.[0]?.variant || ''} · ${order.city}</div>
                    <div className="mt-2 text-sm text-[hsl(var(--foreground)/0.7)]">${order.notes || 'No notes'}</div>
                  </div>
                  <div className="rounded-2xl bg-[hsl(var(--card))] px-4 py-3 text-right shadow-soft">
                    <div className="text-xs uppercase tracking-[0.12em] text-[hsl(var(--foreground)/0.58)]">Risk score</div>
                    <div className="mt-1 text-2xl font-semibold">${String(order.risk)}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[hsl(var(--primary)/0.12)] px-3 py-1 text-xs font-semibold text-[hsl(var(--primary))]">${order.tag}</span>
                    <span className="rounded-full bg-[hsl(var(--secondary)/0.10)] px-3 py-1 text-xs font-semibold text-[hsl(var(--secondary))]">${order.payment}</span>
                    <span className="rounded-full bg-[hsl(var(--secondary)/0.10)] px-3 py-1 text-xs font-semibold text-[hsl(var(--secondary))]">${formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled=${loadingOrderId === order.id}
                      onClick=${() => handleCall(order.id, 'Confirmed')}
                      className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-3 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      ${loadingOrderId === order.id ? html`<${Loader2} size=${14} className="animate-spin" />` : html`<${PhoneCall} size=${14} />`}
                      Call Now
                    </button>
                    <button
                      disabled=${loadingOrderId === order.id}
                      onClick=${() => handleCall(order.id, 'No Answer')}
                      className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm font-semibold text-[hsl(var(--foreground))] transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      <${RotateCcw} size=${14} /> Retry
                    </button>
                  </div>
                </div>
              </div>
            `)}
          </div>
        </${SectionCard}>

        <div className="space-y-6">
          <${SectionCard} title="Voice intelligence" subtitle="Daily quality indicators for the Urdu voice agent">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[var(--radius-md)] bg-[hsl(var(--primary)/0.08)] p-4">
                <div className="text-sm text-[hsl(var(--foreground)/0.6)]">Roman Urdu understanding</div>
                <div className="mt-2 text-3xl font-semibold">96.8%</div>
              </div>
              <div className="rounded-[var(--radius-md)] bg-[hsl(var(--secondary)/0.08)] p-4">
                <div className="text-sm text-[hsl(var(--foreground)/0.6)]">Sentiment detection accuracy</div>
                <div className="mt-2 text-3xl font-semibold">91.2%</div>
              </div>
              <div className="rounded-[var(--radius-md)] bg-[hsl(var(--muted))] p-4">
                <div className="text-sm text-[hsl(var(--foreground)/0.6)]">Human transfer fallback</div>
                <div className="mt-2 text-3xl font-semibold">12 calls</div>
              </div>
            </div>
          </${SectionCard}>

          <${SectionCard} title="Recent compliance events" subtitle="Verified webhook and transcript retention activity">
            <div className="space-y-3">
              ${state.complianceLogs.map((log) => html`
                <div key=${log.id} className="rounded-xl border border-[hsl(var(--border))] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">${log.event}</div>
                    <div className="text-xs text-[hsl(var(--foreground)/0.56)]">${log.time}</div>
                  </div>
                  <div className="mt-1 text-sm text-[hsl(var(--foreground)/0.65)]">${log.detail}</div>
                </div>
              `)}
            </div>
          </${SectionCard}>
        </div>
      </div>
    </div>
  `;
}
