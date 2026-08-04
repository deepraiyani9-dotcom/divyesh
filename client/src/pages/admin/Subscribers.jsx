import { useCallback, useEffect, useState } from 'react';
import { FaPaperPlane, FaTrash } from 'react-icons/fa';
import PageHeader from '../../components/admin/PageHeader.jsx';
import SearchInput from '../../components/admin/SearchInput.jsx';
import DataTable from '../../components/admin/DataTable.jsx';
import Pagination from '../../components/admin/Pagination.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import * as subscribeService from '../../services/subscribeService';
import { formatDateTime } from '../../utils/format';

const Subscribers = () => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await subscribeService.getSubscribers({ page, limit: 10, ...(q ? { q } : {}) });
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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await subscribeService.deleteSubscriber(deleteTarget._id);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const res = await subscribeService.broadcastNewsletter({ subject, message });
      const failed = res.data?.failed || 0;
      const sent = res.data?.sent || 0;
      if (failed > 0 && sent === 0) {
        setStatus({ type: 'error', text: res.message || 'Could not send emails. Please try again.' });
      } else if (failed > 0) {
        setStatus({ type: 'warning', text: res.message || `Sent to ${sent}, failed ${failed}.` });
      } else {
        setStatus({ type: 'success', text: res.message || `Email sent to ${sent} subscriber(s).` });
        setSubject('');
        setMessage('');
      }
    } catch (err) {
      const timedOut = err.code === 'ECONNABORTED' || /timeout/i.test(err.message || '');
      setStatus({
        type: 'error',
        text: timedOut
          ? 'Request timed out. Please try again — emails may still arrive shortly.'
          : err.response?.data?.message || 'Failed to send newsletter',
      });
    } finally {
      setSending(false);
    }
  };

  const columns = [
    { key: 'email', label: 'Email' },
    {
      key: 'isActive',
      label: 'Status',
      render: (row) => (
        <span className={`text-xs font-semibold ${row.isActive !== false ? 'text-emerald-600' : 'text-slate-400'}`}>
          {row.isActive !== false ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Subscribed', render: (row) => formatDateTime(row.createdAt) },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          type="button"
          onClick={() => setDeleteTarget(row)}
          className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          aria-label="Delete subscriber"
        >
          <FaTrash size={12} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Newsletter"
        subtitle="View subscribers and send email updates to everyone who subscribed."
      />

      <form onSubmit={handleSend} className="card p-5 md:p-6 mb-6 space-y-4">
        <h3 className="font-semibold text-ink flex items-center gap-2">
          <FaPaperPlane className="text-primary" /> Send newsletter email
        </h3>
        <div>
          <label className="label-field">Subject *</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input-field"
            placeholder="New PVC product launch"
            required
          />
        </div>
        <div>
          <label className="label-field">Message *</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-field resize-none min-h-[140px]"
            placeholder="Write your newsletter message..."
            required
          />
        </div>
        {status && (
          <p
            className={`text-sm rounded-lg px-3 py-2 ${
              status.type === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : status.type === 'warning'
                  ? 'bg-amber-50 text-amber-800'
                  : 'bg-red-50 text-red-600'
            }`}
          >
            {status.text}
          </p>
        )}
        <button type="submit" disabled={sending} className="btn-primary inline-flex items-center gap-2">
          <FaPaperPlane />
          {sending ? 'Sending...' : 'Send to all subscribers'}
        </button>
      </form>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className="text-sm text-muted">{pagination.total || 0} subscriber(s)</p>
        <SearchInput value={q} onChange={(val) => { setPage(1); setQ(val); }} placeholder="Search email..." />
      </div>

      <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No newsletter subscribers yet." />
      <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove subscriber?"
        message={`Remove ${deleteTarget?.email || 'this email'} from the newsletter list?`}
      />
    </div>
  );
};

export default Subscribers;
