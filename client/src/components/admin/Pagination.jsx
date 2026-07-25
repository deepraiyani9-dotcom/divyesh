const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, start + 4);
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
      >
        Prev
      </button>
      {start > 1 && <span className="px-2 text-muted">…</span>}
      {pageNumbers.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
            n === page ? 'bg-primary text-white' : 'border border-slate-200 hover:bg-slate-50 text-secondary'
          }`}
        >
          {n}
        </button>
      ))}
      {end < pages && <span className="px-2 text-muted">…</span>}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
