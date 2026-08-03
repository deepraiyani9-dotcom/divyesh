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

/** Base URL where Express serves /uploads (API host — never the Vercel frontend). */
export const getAssetBaseUrl = () => {
  const assetOverride = (import.meta.env.VITE_ASSET_URL || '').trim();
  if (assetOverride) return assetOverride.replace(/\/$/, '');

  const api = (import.meta.env.VITE_API_URL || '').trim();
  if (api) {
    try {
      const url = new URL(api, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');
      // Strip trailing /api path → origin only (uploads live at host/uploads)
      return url.origin;
    } catch {
      /* fall through */
    }
  }

  if (import.meta.env.DEV) return 'http://localhost:5000';

  // Production without VITE_API_URL cannot load /uploads from Vercel — return empty
  // so relative paths stay relative (broken) rather than pointing at wrong host.
  // Set VITE_API_URL=https://YOUR-API.onrender.com/api in Vercel env.
  return '';
};

/**
 * Resolve product/gallery image paths for <img src>.
 * - Full http(s) / Cloudinary URLs → unchanged
 * - /uploads/... → prefixed with API origin (local or Render)
 */
export const resolveAssetUrl = (path) => {
  if (!path) return '';
  const raw = String(path).trim();
  if (!raw) return '';

  if (/^(https?:|blob:|data:)/i.test(raw)) return raw;

  // Already a Cloudinary-style path without protocol (rare)
  if (raw.includes('res.cloudinary.com')) {
    return raw.startsWith('//') ? `https:${raw}` : `https://${raw.replace(/^\/+/, '')}`;
  }

  const normalized = raw.startsWith('/') ? raw : `/${raw}`;
  const base = getAssetBaseUrl();

  if (base) return `${base.replace(/\/$/, '')}${normalized}`;

  // Dev proxy fallback
  if (import.meta.env.DEV) return `http://localhost:5000${normalized}`;

  return normalized;
};

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
