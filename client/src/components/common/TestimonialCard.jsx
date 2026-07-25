import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { initials, resolveAssetUrl } from '../../utils/format';

const TestimonialCard = ({ testimonial, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
      className="card p-6 md:p-8 h-full flex flex-col"
    >
      <FaQuoteLeft className="text-primary/20 text-3xl mb-4" />
      <p className="text-secondary/80 flex-1 leading-relaxed">{testimonial.message}</p>
      <div className="flex items-center gap-1 mt-5 mb-4 text-accent">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar key={i} className={i < (testimonial.rating || 5) ? 'opacity-100' : 'opacity-20'} size={14} />
        ))}
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        {testimonial.avatar ? (
          <img
            src={resolveAssetUrl(testimonial.avatar)}
            alt={testimonial.name}
            className="w-11 h-11 rounded-full object-cover"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
            {initials(testimonial.name)}
          </div>
        )}
        <div>
          <p className="font-semibold text-secondary text-sm">{testimonial.name}</p>
          <p className="text-xs text-muted">
            {[testimonial.role, testimonial.company].filter(Boolean).join(', ')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
