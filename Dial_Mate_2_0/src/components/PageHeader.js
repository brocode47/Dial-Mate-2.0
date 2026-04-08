import { html } from '../jsx.js';

export function PageHeader(props) {
  return html`
    <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-[hsl(var(--foreground)/0.55)]">${props.eyebrow}</div>
        <h1 className="mt-2 text-2xl font-semibold md:text-4xl">${props.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[hsl(var(--foreground)/0.72)] md:text-base">${props.description}</p>
      </div>
      ${props.actions ? html`<div className="flex flex-wrap gap-3">${props.actions}</div>` : null}
    </div>
  `;
}