/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { Download, LockKeyhole, Shield, Store, Users } from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { html } from '../jsx.js';
import { useStore } from '../store.js';
import { useToast } from '../toast.js';
import { PageHeader } from '../components/PageHeader.js';
import { SectionCard } from '../components/SectionCard.js';

export function SettingsPage() {
  const { state, dispatch } = useStore();
  const { pushToast } = useToast();

  const [name, setName] = React.useState(state.session.user.name);
  const [email, setEmail] = React.useState(state.session.user.email);

  React.useEffect(() => {
    setName(state.session.user.name);
    setEmail(state.session.user.email);
  }, [state.session.user.name, state.session.user.email]);

  const voices = [
    { id: 'urdu_female_v3', label: 'Urdu Female (v3) — Warm & polite' },
    { id: 'urdu_male_v3', label: 'Urdu Male (v3) — Confident & calm' },
    { id: 'urdu_female_v2', label: 'Urdu Female (v2) — Fast & energetic' }
  ];

  const onPickLogo = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      pushToast('Please select an image file (PNG/JPG/SVG).', 'default');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      dispatch({ type: 'UPDATE_LOGO', logoDataUrl: String(reader.result || '') });
      pushToast('Logo updated.', 'success');
    };
    reader.onerror = () => pushToast('Could not read that file. Please try again.', 'default');
    reader.readAsDataURL(file);
  };

  const downloadSummary = () => {
    const summary = {
      generatedAt: new Date().toISOString(),
      shop: state.session.shop,
      account: state.session.user,
      voice: state.voice,
      scripts: state.scripts
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `dial-mate-settings-summary-${state.session.shop.domain}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return html`
    <div className="fade-up space-y-6">
      <${PageHeader}
        eyebrow="Configuration"
        title="Store controls, voice settings, and scripts"
        description="Manage account settings, upload your logo, configure the Urdu voice persona, and update confirmation/cancellation scripts used by the calling agent."
        actions=${html`
          <button
            className="inline-flex items-center gap-2 rounded-2xl bg-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-white shadow-medium"
            onClick=${downloadSummary}
          >
            <${Download} size=${16} /> Download summary
          </button>
        `}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <${SectionCard} title="Account settings" subtitle="Update the operator profile used across the dashboard">
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium">Name</span>
              <input
                value=${name}
                onChange=${(e) => setName(e.target.value)}
                className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm"
                placeholder="Full name"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Email</span>
              <input
                value=${email}
                onChange=${(e) => setEmail(e.target.value)}
                className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm"
                placeholder="Email address"
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-2xl bg-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-white"
                onClick=${() => {
                  dispatch({ type: 'UPDATE_ACCOUNT', user: { name: String(name || '').trim() || state.session.user.name, email: String(email || '').trim() || state.session.user.email } });
                  pushToast('Account settings saved.', 'success');
                }}
              >
                Save
              </button>
            </div>
          </div>
        </${SectionCard}>

        <${SectionCard} title="Branding" subtitle="Upload your logo for the sidebar and exports">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
                ${state.branding.logoDataUrl
                  ? html`<img src=${state.branding.logoDataUrl} alt="Logo preview" className="h-full w-full object-cover" />`
                  : html`<div className="flex h-full w-full items-center justify-center text-xs text-[hsl(var(--foreground)/0.6)]">No logo</div>`}
              </div>
              <div>
                <div className="font-medium">Company logo</div>
                <div className="text-sm text-[hsl(var(--foreground)/0.65)]">PNG/JPG/SVG recommended</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm font-semibold">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange=${(e) => onPickLogo(e.target.files && e.target.files[0])}
                />
                Change logo
              </label>
              ${state.branding.logoDataUrl
                ? html`<button
                    className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm font-semibold"
                    onClick=${() => {
                      dispatch({ type: 'UPDATE_LOGO', logoDataUrl: null });
                      pushToast('Logo removed.', 'success');
                    }}
                  >
                    Remove
                  </button>`
                : null}
            </div>
          </div>
        </${SectionCard}>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <${SectionCard} title="Voice calling" subtitle="Choose the Urdu voice persona used for outbound confirmations">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Voice</span>
            <select
              value=${state.voice.voiceId}
              onChange=${(e) => {
                dispatch({ type: 'UPDATE_VOICE', voiceId: e.target.value });
                pushToast('Voice updated.', 'success');
              }}
              className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm"
            >
              ${voices.map((v) => html`<option key=${v.id} value=${v.id}>${v.label}</option>`)}
            </select>
          </label>
          <div className="mt-3 rounded-xl bg-[hsl(var(--muted))] p-4 text-sm text-[hsl(var(--foreground)/0.72)]">
            Selected: <span className="font-semibold">${state.voice.voiceId}</span>
          </div>
        </${SectionCard}>

        <${SectionCard} title="Agent scripts (Urdu)" subtitle="Edit the exact words used for confirmations and cancellations">
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium">Call confirmation script (Urdu)</span>
              <textarea
                rows=${6}
                value=${state.scripts.confirmationUrdu}
                onChange=${(e) => dispatch({ type: 'UPDATE_SCRIPT', key: 'confirmationUrdu', value: e.target.value })}
                className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm"
              ></textarea>
              <span className="text-xs text-[hsl(var(--foreground)/0.6)]">Tip: you can use placeholders like ${'${SHOP_NAME}'} and ${'${ORDER_ID}'}.</span>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">Cancellation script (Urdu)</span>
              <textarea
                rows=${6}
                value=${state.scripts.cancellationUrdu}
                onChange=${(e) => dispatch({ type: 'UPDATE_SCRIPT', key: 'cancellationUrdu', value: e.target.value })}
                className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm"
              ></textarea>
            </label>
          </div>
        </${SectionCard}>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <${SectionCard} title="Shopify sync status" subtitle="Products, zones, policies, and discounts pulled from live store data">
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-[hsl(var(--muted))] p-4"><${Store} size=${18} /><div><div className="font-medium">${state.session.shop.domain}</div><div className="text-sm text-[hsl(var(--foreground)/0.65)]">${String(state.products.length)} priority products mapped for voice answers</div></div></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[hsl(var(--border))] p-4"><div className="text-sm text-[hsl(var(--foreground)/0.6)]">FAQs synced</div><div className="mt-2 text-2xl font-semibold">${String(state.faqs.length)}</div></div>
              <div className="rounded-xl border border-[hsl(var(--border))] p-4"><div className="text-sm text-[hsl(var(--foreground)/0.6)]">Shipping zones</div><div className="mt-2 text-2xl font-semibold">7</div></div>
              <div className="rounded-xl border border-[hsl(var(--border))] p-4"><div className="text-sm text-[hsl(var(--foreground)/0.6)]">Discount rules</div><div className="mt-2 text-2xl font-semibold">14</div></div>
              <div className="rounded-xl border border-[hsl(var(--border))] p-4"><div className="text-sm text-[hsl(var(--foreground)/0.6)]">Order edit support</div><div className="mt-2 text-2xl font-semibold">Live</div></div>
            </div>
          </div>
        </${SectionCard}>

        <${SectionCard} title="Team and access" subtitle="Role-based access for billing, support, and operations">
          <div className="space-y-3">
            ${state.team.map((member) => html`
              <div key=${member.id} className="flex items-center justify-between rounded-xl border border-[hsl(var(--border))] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.12)] font-semibold text-[hsl(var(--primary))]">${member.name.split(' ').map((part) => part[0]).join('')}</div>
                  <div>
                    <div className="font-medium">${member.name}</div>
                    <div className="text-sm text-[hsl(var(--foreground)/0.64)]">${member.role}</div>
                  </div>
                </div>
                <span className=${`rounded-full px-3 py-1 text-xs font-semibold ${member.status === 'Active' ? 'bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]' : 'bg-[hsl(var(--secondary)/0.10)] text-[hsl(var(--secondary))]'}`}>${member.status}</span>
              </div>
            `)}
          </div>
        </${SectionCard}>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <${SectionCard} title="Security posture" subtitle="Built for secure cloud hosting and audit readiness">
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-xl bg-[hsl(var(--muted))] p-4"><${Shield} size=${18} /><div><div className="font-medium">Webhook verification enabled</div><div className="text-sm text-[hsl(var(--foreground)/0.65)]">Incoming Shopify events should always be signed before processing.</div></div></div>
            <div className="flex items-start gap-3 rounded-xl bg-[hsl(var(--muted))] p-4"><${LockKeyhole} size=${18} /><div><div className="font-medium">Compliance logging retained</div><div className="text-sm text-[hsl(var(--foreground)/0.65)]">Voice actions, transcript storage, and admin events are visible for audit reviews.</div></div></div>
          </div>
        </${SectionCard}>
        <${SectionCard} title="FAQ knowledge base" subtitle="AI answers these from synced Shopify content">
          <div className="space-y-3">
            ${state.faqs.map((faq) => html`
              <div key=${faq.id} className="rounded-xl border border-[hsl(var(--border))] p-4">
                <div className="font-medium">${faq.question}</div>
                <div className="mt-1 text-sm text-[hsl(var(--foreground)/0.66)]">${faq.answer}</div>
              </div>
            `)}
          </div>
        </${SectionCard}>
      </div>
    </div>
  `;
}
