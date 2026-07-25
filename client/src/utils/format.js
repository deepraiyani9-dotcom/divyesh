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

export const resolveAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;
  return path.startsWith('/') ? path : `/${path}`;
};

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
