import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineChevronDoubleUp } from 'react-icons/hi';

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const smoothScrollToTop = (durationMs = 1100) => {
  const startY = window.scrollY || document.documentElement.scrollTop;
  if (startY <= 0) return;

  const startTime = performance.now();

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    window.scrollTo(0, startY * (1 - easeInOutCubic(progress)));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(scrolled / max, 1) : 0);
      setVisible(scrolled > 200);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (scrolling) return;
    setScrolling(true);
    const duration = 1100;
    smoothScrollToTop(duration);
    window.setTimeout(() => setScrolling(false), duration + 50);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollTop}
          aria-label="Back to top"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="back-to-top"
        >
          <span
            className="back-to-top__fill"
            style={{ height: `${Math.round(progress * 100)}%` }}
            aria-hidden
          />
          <span className="back-to-top__content">
            <HiOutlineChevronDoubleUp className="back-to-top__icon" aria-hidden />
            <span className="back-to-top__text">Top</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
