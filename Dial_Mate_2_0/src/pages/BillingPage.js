/* __imports_rewritten__ */
import { CreditCard, Gem, Globe, Users } from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { html } from '../jsx.js';
import { useStore } from '../store.js';
import { PageHeader } from '../components/PageHeader.js';
import { SectionCard } from '../components/SectionCard.js';
import { PricingCards } from '../components/PricingCards.js';
import { formatCurrency } from '../utils.js';

export function BillingPage() {
  const { state } = useStore();

  return html`
    <div className="fade-up space-y-6">
      <${PageHeader}
        eyebrow="Monetization"
        title="Usage-based billing, seats, and premium add-ons"
        description="Offer free trials, multilingual expansion, white-label deployments, and scalable seat-based access for growing Shopify teams."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="soft-card rounded-[var(--radius-lg)] p-5">
          <div className="flex items-center gap-3 text-[hsl(var(--primary))]"><${CreditCard} size=${18} /><span className="text-sm font-medium text-[hsl(var(--foreground))]">Current spend</span></div>
          <div className="mt-3 text-3xl font-semibold">${formatCurrency(state.billing.monthlySpend)}</div>
          <div className="mt-1 text-sm text-[hsl(var(--foreground)/0.64)]">This month across AI minutes and add-ons</div>
        </div>
        <div className="soft-card rounded-[var(--radius-lg)] p-5">
          <div className="flex items-center gap-3 text-[hsl(var(--primary))]"><${Gem} size=${18} /><span className="text-sm font-medium text-[hsl(var(--foreground))]">Trial remaining</span></div>
          <div className="mt-3 text-3xl font-semibold">${String(state.billing.freeTrialDaysLeft)} days</div>
          <div className="mt-1 text-sm text-[hsl(var(--foreground)/0.64)]">Upgrade before trial minute cap is reached</div>
        </div>
        <div className="soft-card rounded-[var(--radius-lg)] p-5">
          <div className="flex items-center gap-3 text-[hsl(var(--primary))]"><${Users} size=${18} /><span className="text-sm font-medium text-[hsl(var(--foreground))]">Team seats</span></div>
          <div className="mt-3 text-3xl font-semibold">${String(state.billing.teamSeats)}</div>
          <div className="mt-1 text-sm text-[hsl(var(--foreground)/0.64)]">Operations, support, and billing users</div>
        </div>
        <div className="soft-card rounded-[var(--radius-lg)] p-5">
          <div className="flex items-center gap-3 text-[hsl(var(--primary))]"><${Globe} size=${18} /><span className="text-sm font-medium text-[hsl(var(--foreground))]">Voice minutes</span></div>
          <div className="mt-3 text-3xl font-semibold">${String(state.billing.voiceMinutes)}</div>
          <div className="mt-1 text-sm text-[hsl(var(--foreground)/0.64)]">Urdu confirmations and multilingual expansion</div>
        </div>
      </div>

      <${SectionCard} title="Plans" subtitle="Tiered pricing for stores from launch to scale">
        <${PricingCards} />
      </${SectionCard}>

      <div className="grid gap-6 lg:grid-cols-2">
        <${SectionCard} title="Enabled add-ons" subtitle="Expand revenue with feature unlocks">
          <div className="flex flex-wrap gap-3">
            ${['Multilingual add-on', 'White-label option', 'Advanced fraud scoring', 'Embeddable storefront widget'].map((item) => html`
              <span key=${item} className="rounded-full bg-[hsl(var(--primary)/0.12)] px-4 py-2 text-sm font-semibold text-[hsl(var(--primary))]">${item}</span>
            `)}
          </div>
        </${SectionCard}>
        <${SectionCard} title="Billing note" subtitle="Current plan overview">
          <div className="rounded-[var(--radius-md)] bg-[hsl(var(--secondary))] p-5 text-white">
            <div className="text-sm text-white/70">Active subscription</div>
            <div className="mt-2 text-3xl font-semibold">${state.billing.currentPlan}</div>
            <div className="mt-3 text-sm text-white/85">Includes policy sync, order edits, Urdu-first calling flows, and compliance logging with sandbox-safe webhooks.</div>
          </div>
        </${SectionCard}>
      </div>
    </div>
  `;
}