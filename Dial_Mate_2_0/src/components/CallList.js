/* __imports_rewritten__ */
import { AudioLines, MessageSquareText, SmilePlus } from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { html } from '../jsx.js';

export function CallList(props) {
  return html`
    <div className="space-y-4">
      ${props.calls.map((call) => html`
        <div key=${call.id} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.35)] p-4 transition-all hover:bg-[hsl(var(--muted)/0.55)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold">${call.orderId}</div>
              <div className="mt-1 text-sm text-[hsl(var(--foreground)/0.65)]">${call.agent} · ${call.time} · ${call.duration}</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full bg-[hsl(var(--primary)/0.12)] px-3 py-1 text-xs font-semibold text-[hsl(var(--primary))]">${call.outcome}</span>
              <span className="inline-flex rounded-full bg-[hsl(var(--secondary)/0.10)] px-3 py-1 text-xs font-semibold text-[hsl(var(--secondary))]">${call.intent}</span>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-[hsl(var(--card))] p-3">
              <div className="flex items-center gap-2 text-sm font-medium"><${AudioLines} size=${16} /> Recording</div>
              <div className="mt-1 text-sm text-[hsl(var(--foreground)/0.66)]">Crystal-clear Urdu voice playback available</div>
            </div>
            <div className="rounded-xl bg-[hsl(var(--card))] p-3">
              <div className="flex items-center gap-2 text-sm font-medium"><${MessageSquareText} size=${16} /> Transcript</div>
              <div className="mt-1 text-sm text-[hsl(var(--foreground)/0.66)]">Intent, objections, and customer edits extracted</div>
            </div>
            <div className="rounded-xl bg-[hsl(var(--card))] p-3">
              <div className="flex items-center gap-2 text-sm font-medium"><${SmilePlus} size=${16} /> Sentiment</div>
              <div className="mt-1 text-sm text-[hsl(var(--foreground)/0.66)]">${call.sentiment} sentiment detected from live response cues</div>
            </div>
          </div>
        </div>
      `)}
    </div>
  `;
}