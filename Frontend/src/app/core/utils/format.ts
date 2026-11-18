export function asNumber(v: string | number | null | undefined): number { const n = Number(v ?? 0); return Number.isFinite(n) ? n : 0; }
export function money(v: string | number | null | undefined): string { return String(asNumber(v).toFixed(0)); }
export function displayName(u: any): string { return u?.full_name || u?.name || u?.email || 'User'; }
