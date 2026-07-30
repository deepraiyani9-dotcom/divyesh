import { useCallback, useEffect, useState } from 'react';
import { FaEye, FaFileDownload, FaTrash } from 'react-icons/fa';
import PageHeader from '../../components/admin/PageHeader.jsx';
import SearchInput from '../../components/admin/SearchInput.jsx';
import DataTable from '../../components/admin/DataTable.jsx';
import Pagination from '../../components/admin/Pagination.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import * as applicationService from '../../services/applicationService';
import { formatDateTime, resolveAssetUrl } from '../../utils/format';

const STATUS_OPTIONS = ['new', 'reviewed', 'shortlisted', 'rejected'];

const Applications = () => {
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
      const res = await applicationService.getApplications({ page, limit: 10, ...(q ? { q } : {}) });
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
      await applicationService.updateApplication(id, { status });
      setViewing((prev) => (prev && prev._id === id ? { ...prev, status } : prev));
      load();
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await applicationService.deleteApplication(deleteTarget._id);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'career', label: 'Position', render: (row) => row.career?.title || 'General Application' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'createdAt', label: 'Applied', render: (row) => formatDateTime(row.createdAt) },
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
      <PageHeader title="Job Applications" description="Review job applications submitted through the careers page." />
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
            placeholder="Search applications..."
          />
        </div>
        <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No applications received yet." />
        <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
      </div>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Application Details" size="md">
        {viewing && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Applicant</p>
                <p className="text-ink font-medium">{viewing.name}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Position</p>
                <p className="text-ink font-medium">{viewing.career?.title || 'General Application'}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Email</p>
                <p className="text-ink font-medium">{viewing.email}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Phone</p>
                <p className="text-ink font-medium">{viewing.phone}</p>
              </div>
            </div>

            {viewing.coverLetter && (
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Cover Letter</p>
                <p className="text-ink/80 bg-surface p-3 rounded-lg">{viewing.coverLetter}</p>
              </div>
            )}

            {viewing.resumeUrl && (
              <a
                href={resolveAssetUrl(viewing.resumeUrl)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline w-full"
              >
                <FaFileDownload /> View / Download Resume
              </a>
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
        message={deleteTarget ? `Delete application from "${deleteTarget.name}"?` : ''}
      />
    </div>
  );
};

export default Applications;
