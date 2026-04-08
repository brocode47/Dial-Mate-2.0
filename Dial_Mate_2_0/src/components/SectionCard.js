import { html } from '../jsx.js';

export function SectionCard(props) {
  return html`
    <section className="soft-card rounded-[var(--radius-lg)] p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">${props.title}</h2>
          ${props.subtitle ? html`<p className="mt-1 text-sm text-[hsl(var(--foreground)/0.68)]">${props.subtitle}</p>` : null}
        </div>
        ${props.action || null}
      </div>
      ${props.children}
    </section>
  `;
}