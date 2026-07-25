import { motion } from 'framer-motion';

const SectionTitle = ({ eyebrow, title, description, center = true, light = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`mb-10 md:mb-14 ${center ? 'text-center mx-auto max-w-2xl' : ''}`}
    >
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 ${
            light ? 'bg-white/10 text-accent' : 'bg-primary/10 text-primary'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          {eyebrow}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-[2.6rem] font-bold leading-tight ${light ? 'text-white' : 'text-secondary'}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base md:text-lg ${light ? 'text-slate-300' : 'text-muted'}`}>{description}</p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
