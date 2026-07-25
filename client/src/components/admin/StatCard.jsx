import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon, color = 'primary', index = 0 }) => {
  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    emerald: 'bg-emerald-100 text-emerald-600',
    slate: 'bg-slate-200 text-slate-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="card p-5 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-secondary leading-none">{value}</p>
        <p className="text-xs text-muted mt-1.5">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
