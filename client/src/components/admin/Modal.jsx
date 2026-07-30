import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
};

const Modal = ({ open, onClose, title, children, size = 'md', footer }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`bg-white rounded-2xl shadow-2xl w-full ${SIZES[size]} max-h-[90vh] flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="font-semibold text-lg text-ink">{title}</h3>
              <button
                onClick={onClose}
                className="text-muted hover:text-ink hover:bg-slate-100 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">{children}</div>
            {footer && <div className="px-6 py-4 border-t border-slate-100 shrink-0">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
