/* __imports_rewritten__ */
import { Check, Crown, Languages, ShieldCheck } from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { html } from '../jsx.js';
import { useStore } from '../store.js';
import { useToast } from '../toast.js';

const plans = [
  {
    name: 'Starter',
    price: '$49',
    blurb: 'For emerging COD stores starting AI confirmations.',
    features: ['500 AI minutes included', 'Shopify webhook automation', 'Urdu + Roman Urdu understanding', 'Basic fraud scoring']
  },
  {
    name: 'Growth',
    price: '$149',
    blurb: 'Best for scaling stores with daily order volume.',
    features: ['2,500 AI minutes included', 'Live order edits and tag sync', 'Returns and FAQ knowledge sync', 'Team seats for operations and support']
  },
  {
    name: 'Scale',
    price: '$399',
    blurb: 'For high-volume brands needing white-label and control.',
    features: ['10,000 AI minutes included', 'White-label dashboard', 'Advanced duplicate and fraud scoring', 'Priority human transfer workflows']
  }
];

export function PricingCards() {
  const { state, dispatch } = useStore();
  const { pushToast } = useToast();

  return html`
    <div className="grid gap-4 lg:grid-cols-3">
      ${plans.map((plan, index) => html`
        <div key=${plan.name} className=${`soft-card relative rounded-[var(--radius-lg)] p-6 ${index === 1 ? 'ring-2 ring-[hsl(var(--primary)/0.32)]' : ''}`}>
          ${index === 1 ? html`<div className="absolute right-5 top-5 inline-flex rounded-full bg-[hsl(var(--primary)/0.12)] px-3 py-1 text-xs font-semibold text-[hsl(var(--primary))]">Most Popular</div>` : null}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]">
              ${index === 0 ? html`<${ShieldCheck} size=${20} />` : index === 1 ? html`<${Languages} size=${20} />` : html`<${Crown} size=${20} />`}
            </div>
            <div>
              <h3 className="text-xl font-semibold">${plan.name}</h3>
              <div className="text-sm text-[hsl(var(--foreground)/0.62)]">${plan.blurb}</div>
            </div>
          </div>
          <div className="mt-6 text-4xl font-semibold">${plan.price}<span className="ml-2 text-base font-medium text-[hsl(var(--foreground)/0.58)]">/ month</span></div>
          <ul className="mt-6 space-y-3">
            ${plan.features.map((feature) => html`
              <li key=${feature} className="flex items-start gap-3 text-sm text-[hsl(var(--foreground)/0.78)]">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]"><${Check} size=${14} /></span>
                <span>${feature}</span>
              </li>
            `)}
          </ul>
          <button
            onClick=${() => {
              dispatch({ type: 'UPDATE_PLAN', plan: plan.name });
              pushToast('Plan changed to ' + plan.name, 'success');
            }}
            className=${`mt-6 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${state.billing.currentPlan === plan.name ? 'bg-[hsl(var(--secondary))] text-white' : 'bg-[hsl(var(--primary))] text-white'}`}
          >
            ${state.billing.currentPlan === plan.name ? 'Current Plan' : 'Switch to ' + plan.name}
          </button>
        </div>
      `)}
    </div>
  `;
}