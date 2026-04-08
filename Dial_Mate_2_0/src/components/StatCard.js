import { html } from '../jsx.js';

export function StatCard(props) {
  return html`
    <div className="soft-card rounded-[var(--radius-lg)] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-medium">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-[hsl(var(--foreground)/0.6)]">${props.label}</div>
          <div className="mt-3 text-2xl font-semibold md:text-3xl">${props.value}</div>
          <div className="mt-2 text-sm text-[hsl(var(--foreground)/0.62)]">${props.help}</div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]">
          <${props.icon} size=${20} />
        </div>
      </div>
    </div>
  `;
}