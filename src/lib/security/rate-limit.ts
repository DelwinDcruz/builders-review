/** In-memory sliding window. For serverless, back with Redis/Upstash (see docs). */
const store = new Map<string, number[]>();
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (store.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    store.set(key, hits);
    return { ok: false, remaining: 0, retryAfterMs: windowMs - (now - (hits[0] ?? now)) };
  }
  hits.push(now); store.set(key, hits);
  return { ok: true, remaining: limit - hits.length, retryAfterMs: 0 };
}
export function clientKey(headers: Headers, route: string) {
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "local";
  return `${route}:${ip}`;
}
