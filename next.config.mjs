/**
 * Content Security Policy for a self-contained marketing site: no third-party
 * scripts, frames, or API calls. The quote form posts to this site's own
 * /api/pelican-quote route, so 'self' covers it.
 *
 * `'unsafe-inline'` in script-src is required by Next's inline hydration
 * bootstrap. To remove it, generate a per-request nonce in middleware and emit
 * the CSP from there instead. Note that `'unsafe-inline'` is ignored by
 * browsers whenever a nonce or hash is present, so the two cannot simply be
 * combined.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
