import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

const SIZE = 56;
const STROKE = 3.5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(scrolled / max, 1) : 0;
      setProgress(pct);
      setVisible(scrolled > 380);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollTop}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 28, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.75 }}
          whileHover={{ scale: 1.08, y: -4 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          className="back-to-top fixed bottom-24 right-5 md:bottom-28 md:right-8 z-40"
        >
          <span className="back-to-top__glow" aria-hidden />
          <svg
            className="back-to-top__ring"
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            aria-hidden
          >
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth={STROKE}
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="#E07A3D"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              className="back-to-top__progress"
            />
          </svg>
          <span className="back-to-top__core">
            <FaArrowUp className="back-to-top__icon" />
          </span>
          <span className="back-to-top__label">Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
