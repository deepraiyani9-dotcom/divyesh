const COLOR_MAP = {
  new: 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  quoted: 'bg-amber-100 text-amber-700',
  reviewed: 'bg-amber-100 text-amber-700',
  shortlisted: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-slate-200 text-slate-600',
  rejected: 'bg-red-100 text-red-600',
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-slate-200 text-slate-600',
  true: 'bg-emerald-100 text-emerald-700',
  false: 'bg-slate-200 text-slate-600',
};

const StatusBadge = ({ status }) => {
  const key = String(status).toLowerCase();
  const classes = COLOR_MAP[key] || 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${classes}`}>
      {String(status).replace(/-/g, ' ')}
    </span>
  );
};

export default StatusBadge;
