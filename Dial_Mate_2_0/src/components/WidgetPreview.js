/* __imports_rewritten__ */
import { Code, ShoppingBag } from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { html } from '../jsx.js';
import { useStore } from '../store.js';
import { useToast } from '../toast.js';

export function WidgetPreview() {
  const { state, dispatch } = useStore();
  const { pushToast } = useToast();

  return html`
    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[linear-gradient(135deg,hsla(var(--secondary),1),hsla(var(--primary),0.9))] p-6 text-white shadow-medium">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <${ShoppingBag} size=${20} />
          </div>
          <div>
            <div className="text-lg font-semibold">AI Order Confirmation Widget</div>
            <div className="text-sm text-white/75">Shown on thank-you page and order status page</div>
          </div>
        </div>
        <div className="mt-6 rounded-3xl bg-white/10 p-5 backdrop-blur">
          <div className="text-sm text-white/75">Checkout confirmation card</div>
          <div className="mt-3 text-2xl font-semibold">Aap ke order ki tasdeeq AI call se ki jayegi</div>
          <div className="mt-2 text-sm text-white/80">Urdu mein order details, delivery ETA, aur changes confirm karein. Need help? Human support transfer bhi available hai.</div>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-medium">Urdu-first</span>
            <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-medium">Roman Urdu detection</span>
            <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-medium">Live Shopify sync</span>
          </div>
        </div>
      </div>
      <div className="soft-card rounded-[var(--radius-lg)] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]"><${Code} size=${18} /></div>
          <div>
            <div className="font-semibold">Install snippet</div>
            <div className="text-sm text-[hsl(var(--foreground)/0.66)]">Enable one-click storefront embed</div>
          </div>
        </div>
        <pre className="mt-4 overflow-auto rounded-2xl bg-[hsl(var(--secondary))] p-4 text-xs text-white scrollbar-thin">&lt;div data-dial-mate-widget="confirm" data-store="mehrmart"&gt;&lt;/div&gt;
&lt;script src="https://your-widget-url-here/widget.js"&gt;&lt;/script&gt;</pre>
        <button
          onClick=${() => {
            dispatch({ type: 'INSTALL_WIDGET' });
            pushToast('Widget marked as installed for storefront onboarding', 'success');
          }}
          className="mt-4 w-full rounded-2xl bg-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-white"
        >
          ${state.onboarding.widgetInstalled ? 'Widget Installed' : 'Mark Widget as Installed'}
        </button>
      </div>
    </div>
  `;
}
