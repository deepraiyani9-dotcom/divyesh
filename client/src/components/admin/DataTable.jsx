import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { FaInbox } from 'react-icons/fa';

/**
 * columns: [{ key, label, render?(row) }]
 */
const DataTable = ({ columns, rows, loading, emptyMessage = 'No records found.', keyField = '_id' }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!rows?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted">
        <FaInbox size={32} className="mb-3 text-ink/50" />
        <p className="text-sm text-ink/70 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            {columns.map((col) => (
              <th key={col.key} className="py-3 px-4 font-semibold text-ink whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[keyField]} className="border-b border-slate-200 hover:bg-slate-100 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4 align-middle text-ink">
                  {col.render ? col.render(row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
