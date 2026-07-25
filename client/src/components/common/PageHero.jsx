import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';

const PageHero = ({ title, subtitle, breadcrumb = [] }) => {
  return (
    <section className="relative bg-secondary overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, #0B5ED7 0%, transparent 45%), radial-gradient(circle at 80% 80%, #F97316 0%, transparent 40%)',
        }}
      />
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -left-24 bottom-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
            <Link to="/" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <FaHome size={12} /> Home
            </Link>
            {breadcrumb.map((item) => (
              <span key={item.label} className="flex items-center gap-2">
                <FaChevronRight size={10} />
                {item.to ? (
                  <Link to={item.to} className="hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-accent">{item.label}</span>
                )}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white">{title}</h1>
          {subtitle && <p className="mt-4 max-w-2xl text-slate-300 text-base md:text-lg">{subtitle}</p>}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;
