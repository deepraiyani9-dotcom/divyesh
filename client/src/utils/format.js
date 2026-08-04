export const formatCurrency = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (date, options = {}) => {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      ...options,
    }).format(new Date(date));
  } catch {
    return '';
  }
};

export const formatDateTime = (date) => {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  } catch {
    return '';
  }
};

export const truncate = (text = '', length = 120) => {
  if (!text) return '';
  const plain = stripHtml(text);
  return plain.length > length ? `${plain.slice(0, length).trim()}…` : plain;
};

export const stripHtml = (html = '') => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
};

export const slugify = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
};

export const fromArray = (value) => (Array.isArray(value) ? value.join(', ') : value || '');

const isBrowser = () => typeof window !== 'undefined';

const isLoopbackHost = (host = '') =>
  /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/i.test(String(host).trim());

/** Rewrite localhost absolute upload URLs so phones / other PCs can load them. */
const toRelativeUploadPath = (raw) => {
  try {
    const url = new URL(raw);
    if (/\/uploads\//i.test(url.pathname) && isLoopbackHost(url.hostname)) {
      return url.pathname + url.search;
    }
  } catch {
    /* not a URL */
  }
  return raw;
};

/**
 * Base URL where Express serves /uploads.
 * In local/dev on LAN: use the same host as the page (Vite proxies /uploads).
 * Never hardcode localhost — that breaks phones and other PCs.
 */
export const getAssetBaseUrl = () => {
  const assetOverride = (import.meta.env.VITE_ASSET_URL || '').trim();
  if (assetOverride) {
    try {
      const overrideUrl = new URL(assetOverride, isBrowser() ? window.location.origin : undefined);
      if (isBrowser() && isLoopbackHost(overrideUrl.hostname) && !isLoopbackHost(window.location.hostname)) {
        return window.location.origin;
      }
      return overrideUrl.origin;
    } catch {
      return assetOverride.replace(/\/$/, '');
    }
  }

  const api = (import.meta.env.VITE_API_URL || '').trim();
  if (api) {
    try {
      const pageOrigin = isBrowser() ? window.location.origin : 'http://localhost:5173';
      const url = new URL(api, pageOrigin);

      // /api relative → same origin (Vite/Vercel proxy) — works on phone + PC
      if (api.startsWith('/')) return pageOrigin;

      // VITE_API_URL pointed at localhost but user opened site via LAN IP / hostname
      if (isBrowser() && isLoopbackHost(url.hostname) && !isLoopbackHost(window.location.hostname)) {
        return window.location.origin;
      }

      return url.origin;
    } catch {
      /* fall through */
    }
  }

  // Dev: same origin → Vite proxies /uploads to the API (works on mobile LAN)
  if (import.meta.env.DEV && isBrowser()) return window.location.origin;

  // Production without VITE_API_URL: relative /uploads (needs Vercel rewrite or Cloudinary)
  return '';
};

/**
 * Resolve product/gallery image paths for <img src>.
 * - Full http(s) / Cloudinary URLs → unchanged (except localhost uploads → rewritten)
 * - /uploads/... → prefixed with API / page origin so mobile & other PCs work
 */
export const resolveAssetUrl = (path) => {
  if (!path) return '';
  let raw = String(path).trim();
  if (!raw) return '';

  if (/^(blob:|data:)/i.test(raw)) return raw;

  // Stale DB values like http://localhost:5000/uploads/x.jpg break on phones
  if (/^https?:\/\//i.test(raw)) {
    raw = toRelativeUploadPath(raw);
    if (/^https?:\/\//i.test(raw)) return raw;
  }

  if (raw.includes('res.cloudinary.com')) {
    return raw.startsWith('//') ? `https:${raw}` : `https://${raw.replace(/^\/+/, '')}`;
  }

  const normalized = raw.startsWith('/') ? raw : `/${raw}`;
  const base = getAssetBaseUrl();

  if (base) return `${base.replace(/\/$/, '')}${normalized}`;

  return normalized;
};

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
