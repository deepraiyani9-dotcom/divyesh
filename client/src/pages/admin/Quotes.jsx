import { useCallback, useEffect, useState } from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import PageHeader from '../../components/admin/PageHeader.jsx';
import SearchInput from '../../components/admin/SearchInput.jsx';
import DataTable from '../../components/admin/DataTable.jsx';
import Pagination from '../../components/admin/Pagination.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import * as quoteService from '../../services/quoteService';
import { formatDateTime } from '../../utils/format';

const STATUS_OPTIONS = ['new', 'quoted', 'closed'];

const Quotes = () => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await quoteService.getQuotes({ page, limit: 10, ...(q ? { q } : {}) });
      setItems(res.data || []);
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (id, status) => {
    setUpdating(true);
    try {
      await quoteService.updateQuote(id, { status });
      setViewing((prev) => (prev && prev._id === id ? { ...prev, status } : prev));
      load();
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await quoteService.deleteQuote(deleteTarget._id);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'companyName', label: 'Company', render: (row) => row.companyName || '—' },
    { key: 'phone', label: 'Phone' },
    { key: 'products', label: 'Items', render: (row) => `${row.products?.length || 0} product(s)` },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'createdAt', label: 'Received', render: (row) => formatDateTime(row.createdAt) },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewing(row)}
            className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
          >
            <FaEye size={13} />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
          >
            <FaTrash size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Quote Requests" description="View and manage quote requests submitted by prospective customers." />
      <div
        className="p-4 md:p-6 rounded-2xl border border-slate-300 shadow-md"
        style={{ backgroundColor: '#ffffff', opacity: 1 }}
      >
        <div className="mb-4">
          <SearchInput
            value={q}
            onChange={(v) => {
              setQ(v);
              setPage(1);
            }}
            placeholder="Search quote requests..."
          />
        </div>
        <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No quote requests yet." />
        <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
      </div>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Quote Request Details" size="md">
        {viewing && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Name</p>
                <p className="text-ink font-medium">{viewing.name}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Company</p>
                <p className="text-ink font-medium">{viewing.companyName || '—'}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Phone</p>
                <p className="text-ink font-medium">{viewing.phone}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Email</p>
                <p className="text-ink font-medium">{viewing.email}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Location</p>
                <p className="text-ink font-medium">{[viewing.city, viewing.state].filter(Boolean).join(', ') || '—'}</p>
              </div>
            </div>

            {viewing.products?.length > 0 && (
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-2">Requested Products</p>
                <div className="space-y-2">
                  {viewing.products.map((p, i) => (
                    <div key={i} className="bg-surface p-3 rounded-lg text-sm flex justify-between gap-3">
                      <span className="font-medium text-ink">{p.productName || 'Unnamed product'}</span>
                      <span className="text-muted">{p.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewing.message && (
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Message</p>
                <p className="text-ink/80 bg-surface p-3 rounded-lg">{viewing.message}</p>
              </div>
            )}

            <div>
              <label className="label-field">Update Status</label>
              <select
                value={viewing.status}
                onChange={(e) => handleStatusChange(viewing._id, e.target.value)}
                disabled={updating}
                className="input-field"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={deleteTarget ? `Delete quote request from "${deleteTarget.name}"?` : ''}
      />
    </div>
  );
};

export default Quotes;
