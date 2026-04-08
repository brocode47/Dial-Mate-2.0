export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount);
}

export function getStatusTone(status) {
  if (status === 'Confirmed') return 'bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]';
  if (status === 'No Answer') return 'bg-[hsl(var(--secondary)/0.10)] text-[hsl(var(--secondary))]';
  if (status === 'Cancelled') return 'bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive))]';
  if (status === 'Reschedule Requested') return 'bg-[hsl(var(--secondary)/0.10)] text-[hsl(var(--secondary))]';
  return 'bg-[hsl(var(--secondary)/0.10)] text-[hsl(var(--secondary))]';
}

export function getRiskTone(risk) {
  if (risk >= 70) return 'text-[hsl(var(--destructive))]';
  if (risk >= 40) return 'text-[hsl(var(--secondary))]';
  return 'text-[hsl(var(--primary))]';
}

export function hashRoute() {
  const raw = window.location.hash || '#/dashboard';
  return raw.replace('#', '') || '/dashboard';
}