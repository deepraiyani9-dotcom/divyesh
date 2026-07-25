import { useCallback, useEffect, useState } from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import PageHeader from '../../components/admin/PageHeader.jsx';
import SearchInput from '../../components/admin/SearchInput.jsx';
import DataTable from '../../components/admin/DataTable.jsx';
import Pagination from '../../components/admin/Pagination.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import * as contactService from '../../services/contactService';
import { formatDateTime } from '../../utils/format';

const STATUS_OPTIONS = ['new', 'in-progress', 'closed'];

const Contacts = () => {
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
      const res = await contactService.getContacts({ page, limit: 10, ...(q ? { q } : {}) });
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
      await contactService.updateContact(id, { status });
      setViewing((prev) => (prev && prev._id === id ? { ...prev, status } : prev));
      load();
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await contactService.deleteContact(deleteTarget._id);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'productInterested', label: 'Product', render: (row) => row.productInterested || '—' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'createdAt', label: 'Received', render: (row) => formatDateTime(row.createdAt) },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewing(row)}
            className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
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
      <PageHeader title="Contact Enquiries" description="View and manage messages submitted through the contact form." />
      <div className="card p-4 md:p-6">
        <div className="mb-4">
          <SearchInput
            value={q}
            onChange={(v) => {
              setQ(v);
              setPage(1);
            }}
            placeholder="Search enquiries..."
          />
        </div>
        <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No contact enquiries yet." />
        <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
      </div>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Enquiry Details" size="md">
        {viewing && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Name</p>
                <p className="text-secondary font-medium">{viewing.name}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Company</p>
                <p className="text-secondary font-medium">{viewing.companyName || '—'}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Phone</p>
                <p className="text-secondary font-medium">{viewing.phone}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Email</p>
                <p className="text-secondary font-medium">{viewing.email}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Location</p>
                <p className="text-secondary font-medium">{[viewing.city, viewing.state].filter(Boolean).join(', ') || '—'}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Product / Quantity</p>
                <p className="text-secondary font-medium">
                  {viewing.productInterested || '—'} {viewing.quantity ? `(${viewing.quantity})` : ''}
                </p>
              </div>
            </div>
            <div>
              <p className="text-muted text-xs uppercase font-semibold mb-1">Message</p>
              <p className="text-secondary/80 bg-surface p-3 rounded-lg">{viewing.message}</p>
            </div>
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
        message={deleteTarget ? `Delete enquiry from "${deleteTarget.name}"?` : ''}
      />
    </div>
  );
};

export default Contacts;
