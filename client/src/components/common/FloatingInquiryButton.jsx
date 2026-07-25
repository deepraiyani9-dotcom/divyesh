import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPhoneAlt, FaPlus, FaTimes, FaWhatsapp, FaFileInvoiceDollar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { COMPANY } from '../../utils/constants';

const FloatingInquiryButton = () => {
  const [open, setOpen] = useState(false);

  const items = [
    { label: 'Call Now', icon: <FaPhoneAlt />, href: COMPANY.phoneHref, color: 'bg-primary' },
    { label: 'WhatsApp', icon: <FaWhatsapp />, href: COMPANY.whatsappHref, color: 'bg-emerald-500' },
    { label: 'Get a Quote', icon: <FaFileInvoiceDollar />, to: '/request-quote', color: 'bg-accent' },
  ];

  return (
    <div className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          items.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.8 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="bg-secondary text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                {item.label}
              </span>
              {item.to ? (
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`w-12 h-12 rounded-full ${item.color} text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform`}
                >
                  {item.icon}
                </Link>
              ) : (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className={`w-12 h-12 rounded-full ${item.color} text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform`}
                >
                  {item.icon}
                </a>
              )}
            </motion.div>
          ))}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.9 }}
        aria-label="Quick contact options"
        className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-2xl shadow-accent/40"
        animate={{ rotate: open ? 45 : 0 }}
      >
        {open ? <FaTimes size={20} /> : <FaPlus size={20} />}
      </motion.button>
    </div>
  );
};

export default FloatingInquiryButton;
