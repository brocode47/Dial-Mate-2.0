/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { AudioWaveform, Bot, PhoneMissed, UserRoundCog } from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { html } from '../jsx.js';
import { useStore } from '../store.js';
import { PageHeader } from '../components/PageHeader.js';
import { SectionCard } from '../components/SectionCard.js';
import { CallList } from '../components/CallList.js';

export function CallsPage() {
  const { state } = useStore();
  const [selectedOrderId, setSelectedOrderId] = React.useState(state.orders[0] ? state.orders[0].id : '');

  const selectedOrder = React.useMemo(() => state.orders.find((order) => order.id === selectedOrderId) || state.orders[0], [state.orders, selectedOrderId]);

  return html`
    <div className="fade-up space-y-6">
      <${PageHeader}
        eyebrow="Conversation center"
        title="Recordings, transcripts, and intent detection"
        description="Inspect customer conversations in natural Urdu, review interruptions and fallback handling, and transfer edge cases to human support when needed."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <${SectionCard} title="Recent AI calls" subtitle="Playback metadata, outcome labels, and sentiment summaries">
          <${CallList} calls=${state.calls} />
        </${SectionCard}>

        <div className="space-y-6">
          <${SectionCard}
            title="Transcript viewer"
            subtitle="Open a specific order to inspect the latest conversation"
            action=${html`
              <select
                value=${selectedOrderId}
                onChange=${(event) => setSelectedOrderId(event.target.value)}
                className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm"
              >
                ${state.orders.map((order) => html`<option key=${order.id} value=${order.id}>${order.id}</option>`)}
              </select>
            `}
          >
            ${selectedOrder ? html`
              <div className="rounded-[var(--radius-md)] bg-[hsl(var(--secondary))] p-5 text-white">
                <div className="flex items-center gap-2 text-sm text-white/75"><${AudioWaveform} size=${16} /> ${selectedOrder.recording}</div>
                <div className="mt-4 text-sm leading-7 text-white/90">${selectedOrder.transcript}</div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-[hsl(var(--primary)/0.10)] p-4">
                  <div className="flex items-center gap-2 text-sm font-medium"><${Bot} size=${16} /> Agent summary</div>
                  <div className="mt-2 text-sm text-[hsl(var(--foreground)/0.7)]">Asked for order confirmation, addressed ETA, and used Urdu-first polite greeting.</div>
                </div>
                <div className="rounded-xl bg-[hsl(var(--muted))] p-4">
                  <div className="flex items-center gap-2 text-sm font-medium"><${PhoneMissed} size=${16} /> Fallback logic</div>
                  <div className="mt-2 text-sm text-[hsl(var(--foreground)/0.7)]">Voicemail, no-answer retry, and reschedule flows stay active automatically.</div>
                </div>
                <div className="rounded-xl bg-[hsl(var(--secondary)/0.08)] p-4">
                  <div className="flex items-center gap-2 text-sm font-medium"><${UserRoundCog} size=${16} /> Human transfer</div>
                  <div className="mt-2 text-sm text-[hsl(var(--foreground)/0.7)]">Escalates when sentiment turns negative or policy requests exceed confidence threshold.</div>
                </div>
              </div>
            ` : html`<div className="rounded-xl bg-[hsl(var(--muted))] p-4 text-sm">No transcript selected.</div>`}
          </${SectionCard}>

          <${SectionCard} title="Order status timeline" subtitle="Every meaningful event from checkout to confirmation">
            ${selectedOrder ? html`
              <ol className="space-y-3">
                ${selectedOrder.timeline.map((step, index) => html`
                  <li key=${step + index} className="flex gap-3">
                    <span className="mt-1 status-dot bg-[hsl(var(--primary))]"></span>
                    <span className="text-sm text-[hsl(var(--foreground)/0.75)]">${step}</span>
                  </li>
                `)}
              </ol>
            ` : null}
          </${SectionCard}>
        </div>
      </div>
    </div>
  `;
}