import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaEnvelopeOpenText, FaFileInvoiceDollar, FaTimes } from 'react-icons/fa';
import { getQuotes } from '../../services/quoteService';
import { getContacts } from '../../services/contactService';

const POLL_MS = 8000;
const SEEN_KEY = 'lotus_admin_seen_enquiries';

const loadSeen = () => {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(SEEN_KEY) || '[]'));
  } catch {
    return new Set();
  }
};

const saveSeen = (set) => {
  sessionStorage.setItem(SEEN_KEY, JSON.stringify([...set].slice(-200)));
};

const EnquiryNotifier = () => {
  const navigate = useNavigate();
  const primed = useRef(false);
  const seenRef = useRef(loadSeen());
  const [alerts, setAlerts] = useState([]);
  const [unread, setUnread] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);

  const pushAlert = useCallback((item) => {
    setAlerts((prev) => {
      if (prev.some((a) => a.key === item.key)) return prev;
      return [item, ...prev].slice(0, 4);
    });
    setUnread((prev) => {
      if (prev.some((a) => a.key === item.key)) return prev;
      return [item, ...prev].slice(0, 20);
    });
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.key !== item.key));
    }, 14000);
  }, []);

  const dismissAlert = (key) => {
    setAlerts((prev) => prev.filter((a) => a.key !== key));
  };

  const markRead = (key) => {
    seenRef.current.add(key);
    saveSeen(seenRef.current);
    setAlerts((prev) => prev.filter((a) => a.key !== key));
    setUnread((prev) => prev.filter((a) => a.key !== key));
  };

  const openItem = (item) => {
    markRead(item.key);
    setPanelOpen(false);
    navigate(item.path);
  };

  const poll = useCallback(async () => {
    try {
      const [quotesRes, contactsRes] = await Promise.all([
        getQuotes({ limit: 8 }),
        getContacts({ limit: 8 }),
      ]);

      const quotes = quotesRes.data || [];
      const contacts = contactsRes.data || [];

      const incoming = [
        ...quotes.map((q) => ({
          key: `quote-${q._id}`,
          id: q._id,
          type: 'quote',
          title: 'New quote request',
          name: q.name,
          detail: [q.companyName, q.phone, q.email].filter(Boolean).join(' · '),
          path: '/admin/quotes',
          createdAt: q.createdAt,
        })),
        ...contacts.map((c) => ({
          key: `contact-${c._id}`,
          id: c._id,
          type: 'contact',
          title: 'New contact enquiry',
          name: c.name,
          detail: [c.phone, c.email, c.productInterested].filter(Boolean).join(' · '),
          path: '/admin/contacts',
          createdAt: c.createdAt,
        })),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (!primed.current) {
        incoming.forEach((item) => seenRef.current.add(item.key));
        saveSeen(seenRef.current);
        primed.current = true;
        return;
      }

      incoming.forEach((item) => {
        if (!seenRef.current.has(item.key)) {
          seenRef.current.add(item.key);
          saveSeen(seenRef.current);
          pushAlert(item);
        }
      });
    } catch {
      // ignore poll errors while logged in
    }
  }, [pushAlert]);

  useEffect(() => {
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [poll]);

  return (
    <>
      {/* Floating unread button — bottom right */}
      <div className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-[70] flex flex-col items-end gap-3">
        <AnimatePresence>
          {alerts.map((alert) => {
            const isQuote = alert.type === 'quote';
            const Icon = isQuote ? FaFileInvoiceDollar : FaEnvelopeOpenText;
            return (
              <motion.div
                key={alert.key}
                initial={{ opacity: 0, x: 80, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className="w-[min(92vw,22rem)] rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
              >
                <div className={`h-1.5 ${isQuote ? 'bg-accent' : 'bg-primary'}`} />
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${
                        isQuote ? 'bg-accent' : 'bg-primary'
                      }`}
                    >
                      <Icon />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                        {alert.title}
                      </p>
                      <p className="font-semibold text-ink truncate">{alert.name}</p>
                      <p className="text-xs text-muted truncate mt-0.5">{alert.detail || 'Open to view details'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => dismissAlert(alert.key)}
                      className="text-muted hover:text-ink p-1"
                      aria-label="Dismiss"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openItem(alert)}
                      className={`flex-1 text-sm font-semibold text-white py-2 rounded-xl ${
                        isQuote ? 'bg-accent hover:bg-accent-dark' : 'bg-primary hover:bg-primary-dark'
                      }`}
                    >
                      View enquiry
                    </button>
                    <button
                      type="button"
                      onClick={() => markRead(alert.key)}
                      className="px-3 text-xs font-semibold text-muted border border-slate-200 rounded-xl hover:bg-slate-50"
                    >
                      Later
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {unread.length > 0 && (
          <motion.button
            type="button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setPanelOpen((o) => !o)}
            className="relative w-14 h-14 rounded-full bg-accent text-white shadow-2xl shadow-accent/40 flex items-center justify-center hover:scale-105 transition-transform"
            aria-label="Enquiry notifications"
          >
            <FaFileInvoiceDollar size={18} />
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-[11px] font-bold flex items-center justify-center border-2 border-white">
              {unread.length}
            </span>
          </motion.button>
        )}

        <AnimatePresence>
          {panelOpen && unread.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-16 right-0 w-[min(92vw,20rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">New enquiries</p>
                <button
                  type="button"
                  className="text-xs font-semibold text-primary"
                  onClick={() => {
                    unread.forEach((u) => seenRef.current.add(u.key));
                    saveSeen(seenRef.current);
                    setUnread([]);
                    setAlerts([]);
                    setPanelOpen(false);
                  }}
                >
                  Clear all
                </button>
              </div>
              <ul className="max-h-64 overflow-y-auto">
                {unread.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => openItem(item)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0"
                    >
                      <p className="text-[10px] font-bold uppercase text-muted">
                        {item.type === 'quote' ? 'Quote' : 'Contact'}
                      </p>
                      <p className="text-sm font-semibold text-ink truncate">{item.name}</p>
                      <p className="text-xs text-muted truncate">{item.detail}</p>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="p-3 bg-slate-50 flex gap-2">
                <Link
                  to="/admin/quotes"
                  onClick={() => setPanelOpen(false)}
                  className="flex-1 text-center text-xs font-bold py-2 rounded-lg bg-accent text-white"
                >
                  Quotes
                </Link>
                <Link
                  to="/admin/contacts"
                  onClick={() => setPanelOpen(false)}
                  className="flex-1 text-center text-xs font-bold py-2 rounded-lg bg-primary text-white"
                >
                  Contacts
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default EnquiryNotifier;
