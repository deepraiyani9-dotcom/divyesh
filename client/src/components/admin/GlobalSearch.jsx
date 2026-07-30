import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaBoxOpen,
  FaCertificate,
  FaChartLine,
  FaCogs,
  FaEnvelopeOpenText,
  FaFileInvoiceDollar,
  FaImages,
  FaLayerGroup,
  FaNewspaper,
  FaSearch,
  FaSpinner,
  FaTimes,
  FaUserCircle,
  FaUsers,
} from 'react-icons/fa';
import { globalSearch } from '../../services/searchService';

const PAGE_REFS = [
  {
    title: 'Dashboard',
    subtitle: 'Overview, stats & analytics',
    path: '/admin/dashboard',
    keywords: 'home stats analytics overview report summary count total',
    icon: FaChartLine,
  },
  {
    title: 'Products',
    subtitle: 'PVC & UPVC pipes catalog',
    path: '/admin/products',
    keywords:
      'product products pipe pipes pvc upvc tubing conduit diameter pressure catalog stock item items material fittings irrigation drainage water',
    icon: FaBoxOpen,
  },
  {
    title: 'Categories',
    subtitle: 'Group products by type',
    path: '/admin/categories',
    keywords: 'category categories group type types classify classification section',
    icon: FaLayerGroup,
  },
  {
    title: 'Blogs',
    subtitle: 'Articles, tips & news',
    path: '/admin/blogs',
    keywords: 'blog blogs article articles news post posts tip tips story content write writing seo',
    icon: FaNewspaper,
  },
  {
    title: 'Gallery',
    subtitle: 'Photos & project media',
    path: '/admin/gallery',
    keywords: 'gallery image images photo photos picture media album factory plant project',
    icon: FaImages,
  },
  {
    title: 'Testimonials',
    subtitle: 'Client reviews & feedback',
    path: '/admin/testimonials',
    keywords:
      'testimonial testimonials review reviews feedback rating client clients customer farmer dealer builder comment praise',
    icon: FaUsers,
  },
  {
    title: 'Certificates',
    subtitle: 'ISO & quality documents',
    path: '/admin/certificates',
    keywords: 'certificate certificates iso quality award awards license licence document compliance certified',
    icon: FaCertificate,
  },
  {
    title: 'Contact Enquiries',
    subtitle: 'Messages from the website',
    path: '/admin/contacts',
    keywords:
      'contact contacts enquiry enquiries inquiry message messages lead leads form phone email call support help customer reach',
    icon: FaEnvelopeOpenText,
  },
  {
    title: 'Quote Requests',
    subtitle: 'Bulk & dealer pricing requests',
    path: '/admin/quotes',
    keywords:
      'quote quotes quotation pricing price prices bulk dealer dealership order orders estimate costing gst invoice request',
    icon: FaFileInvoiceDollar,
  },
  {
    title: 'Settings',
    subtitle: 'Company & site settings',
    path: '/admin/settings',
    keywords: 'settings setting config configuration company address phone email social hours preference',
    icon: FaCogs,
  },
  {
    title: 'Profile',
    subtitle: 'Your admin account',
    path: '/admin/profile',
    keywords: 'profile account password login admin user me name',
    icon: FaUserCircle,
  },
];

const TYPE_ICON = {
  Product: FaBoxOpen,
  Category: FaLayerGroup,
  Blog: FaNewspaper,
  Gallery: FaImages,
  Testimonial: FaUsers,
  Certificate: FaCertificate,
  Contact: FaEnvelopeOpenText,
  Quote: FaFileInvoiceDollar,
};

/** Score how related a page is to typed words (higher = better suggestion). */
function scoreRelated(ref, words) {
  const title = ref.title.toLowerCase();
  const subtitle = ref.subtitle.toLowerCase();
  const keys = ref.keywords.toLowerCase().split(/\s+/);
  let score = 0;

  words.forEach((word) => {
    if (word.length < 2) return;
    if (title === word) score += 12;
    else if (title.startsWith(word)) score += 9;
    else if (title.includes(word)) score += 7;

    if (subtitle.includes(word)) score += 3;

    keys.forEach((key) => {
      if (key === word) score += 8;
      else if (key.startsWith(word) || word.startsWith(key)) score += 5;
      else if (key.includes(word) || word.includes(key)) score += 2;
    });
  });

  return score;
}

const GlobalSearch = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setSearched(false);
    setActiveIndex(0);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return PAGE_REFS.map((ref) => ({ ...ref, score: 0, reason: 'Quick open' }));
    }

    const words = q.split(/\s+/).filter((w) => w.length >= 2);
    return PAGE_REFS.map((ref) => {
      const score = scoreRelated(ref, words);
      const matched = words.filter((word) => {
        const hay = `${ref.title} ${ref.subtitle} ${ref.keywords}`.toLowerCase();
        return hay.includes(word) || [...hay.split(/\s+/)].some(
          (k) => k.startsWith(word) || word.startsWith(k)
        );
      });
      return {
        ...ref,
        score,
        reason: matched.length
          ? `Related to: ${matched.slice(0, 3).join(', ')}`
          : '',
      };
    })
      .filter((ref) => ref.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query]);

  const listForKeys = searched ? results : suggestions;

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setSearched(false);
    setResults([]);
    setActiveIndex(0);
  }, [query]);

  const runSearch = async () => {
    const q = query.trim();
    if (q.length < 2) {
      setSearched(false);
      setResults([]);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await globalSearch(q);
      setResults(res.data || []);
      setActiveIndex(0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const goTo = (item) => {
    if (!item?.path) return;
    navigate(item.path);
    close();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(listForKeys.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searched && results[activeIndex]) goTo(results[activeIndex]);
      else if (!searched && query.trim().length >= 2 && e.shiftKey) runSearch();
      else if (!searched && listForKeys[activeIndex]) goTo(listForKeys[activeIndex]);
      else if (!searched && query.trim().length >= 2) runSearch();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted border border-slate-200 bg-slate-50 hover:bg-white hover:border-primary/40 hover:text-primary px-3 py-1.5 rounded-lg transition-colors"
        aria-label="Search admin"
      >
        <FaSearch size={12} />
        <span className="hidden md:inline">Search anything...</span>
        <kbd className="hidden lg:inline text-[10px] font-semibold bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400">
          Ctrl K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/45 flex items-start justify-center px-4 pt-[10vh]"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 px-3 py-3 border-b border-slate-100">
                <FaSearch className="text-muted shrink-0 ml-1" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type any related word — e.g. pipe, quote, iso..."
                  className="flex-1 py-2.5 px-2 text-sm outline-none text-ink placeholder:text-muted bg-transparent min-w-0"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                    className="text-muted hover:text-ink p-1.5"
                    aria-label="Clear"
                  >
                    <FaTimes size={12} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={runSearch}
                  disabled={loading || query.trim().length < 2}
                  className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaSearch size={12} />}
                  Search
                </button>
              </div>

              <div className="max-h-[58vh] overflow-y-auto">
                {!searched && (
                  <div className="px-4 pt-3 pb-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
                      {query.trim()
                        ? 'Suggested for you — related pages'
                        : 'Quick open — tap a page'}
                    </p>

                    {suggestions.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {suggestions.slice(0, 8).map((ref) => {
                          const Icon = ref.icon;
                          return (
                            <button
                              key={ref.path}
                              type="button"
                              onClick={() => goTo(ref)}
                              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-ink hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors"
                              title={ref.reason || ref.subtitle}
                            >
                              <Icon size={11} />
                              {ref.title}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-muted mb-3 py-1">
                        No related pages for “{query.trim()}”. Tap <strong>Search</strong> to look in all data.
                      </p>
                    )}
                  </div>
                )}

                {searched && !loading && results.length === 0 && (
                  <div className="px-5 py-6 text-center">
                    <p className="text-sm text-muted mb-3">
                      No data found for “{query.trim()}”.
                    </p>
                    {suggestions.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {suggestions.slice(0, 5).map((ref) => (
                          <button
                            key={ref.path}
                            type="button"
                            onClick={() => goTo(ref)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary"
                          >
                            Open {ref.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {searched && results.length > 0 && (
                  <div className="px-4 pt-3 pb-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-1">
                      Search results — tap to open
                    </p>
                  </div>
                )}

                {!searched && suggestions.length > 0 && (
                  <ul className="py-1 pb-2">
                    {suggestions.map((item, i) => {
                      const Icon = item.icon;
                      const active = i === activeIndex;
                      return (
                        <li key={item.path}>
                          <button
                            type="button"
                            onClick={() => goTo(item)}
                            onMouseEnter={() => setActiveIndex(i)}
                            className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                              active ? 'bg-primary/10' : 'hover:bg-slate-50'
                            }`}
                          >
                            <span
                              className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              <Icon size={14} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-ink text-sm">{item.title}</span>
                                <span className="text-[10px] uppercase tracking-wide font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                  Suggestion
                                </span>
                              </span>
                              <span className="block text-xs text-muted mt-0.5">
                                {item.reason || item.subtitle}
                              </span>
                            </span>
                            <span className="text-[11px] font-semibold text-primary self-center shrink-0">
                              Open →
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {searched && results.length > 0 && (
                  <ul className="py-1 pb-2">
                    {results.map((item, i) => {
                      const Icon = TYPE_ICON[item.type] || FaSearch;
                      const active = i === activeIndex;
                      return (
                        <li key={`${item.type}-${item.id}`}>
                          <button
                            type="button"
                            onClick={() => goTo(item)}
                            onMouseEnter={() => setActiveIndex(i)}
                            className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                              active ? 'bg-primary/10' : 'hover:bg-slate-50'
                            }`}
                          >
                            <span
                              className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              <Icon size={14} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2">
                                <span className="font-semibold text-ink text-sm truncate">{item.title}</span>
                                <span className="text-[10px] uppercase tracking-wide font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                  {item.type}
                                </span>
                              </span>
                              <span className="block text-xs text-muted mt-0.5 truncate">{item.subtitle}</span>
                            </span>
                            <span className="text-[11px] font-semibold text-primary self-center shrink-0">
                              Open →
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-slate-100 text-[11px] text-muted flex flex-wrap gap-x-3 gap-y-1">
                <span>Related words → live suggestions</span>
                <span>Tap Search → all data</span>
                <span>Tap row → open</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalSearch;
