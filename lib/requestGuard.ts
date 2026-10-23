// Small guards for public API routes: is the request from our own site,
// and has this visitor called too often. The rate limit lives in memory, so
// it is per server instance; it stops scripted floods, not a determined
// attacker (a Vercel Firewall rule is the stronger layer on top).

const OWN_HOSTS = ["potenthygiene.com", "www.potenthygiene.com", "localhost"];

export function isOwnSite(req: Request): boolean {
  const source = req.headers.get("origin") || req.headers.get("referer");
  if (!source) return false;
  try {
    const host = new URL(source).hostname;
    return (
      OWN_HOSTS.includes(host) ||
      // Vercel test versions of this project only.
      (host.endsWith(".vercel.app") && host.includes("potent-hygiene"))
    );
  } catch {
    return false;
  }
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

const hits = new Map<string, number[]>();

/** True when `key` has made fewer than `limit` calls in the last `windowMs`. */
export function allowRequest(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (!times.some((t) => now - t < windowMs)) hits.delete(k);
    }
  }
  return true;
}

/** Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is set. */
export function isCronRequest(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    return (
      req.headers.get("authorization") === `Bearer ${secret}` ||
      req.headers.get("x-cron-secret") === secret
    );
  }
  return (req.headers.get("user-agent") || "").startsWith("vercel-cron");
}

export const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "image/heif",
];
