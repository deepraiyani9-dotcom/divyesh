import { useCallback, useEffect, useState } from 'react';
import { FaEye, FaTrash, FaPaperPlane, FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
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

const emptyReply = {
  quotedPrice: '',
  currency: 'INR',
  priceNote: '',
  quoteDetails: '',
  deliveryDays: '',
  paymentTerms: '',
  validUntil: '',
  adminNotes: '',
  sendEmailToCustomer: true,
  status: 'quoted',
};

const Quotes = () => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [reply, setReply] = useState(emptyReply);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

  const openQuote = (row) => {
    setViewing(row);
    setMessage('');
    setError('');
    setReply({
      quotedPrice: row.quotedPrice ?? '',
      currency: row.currency || 'INR',
      priceNote: row.priceNote || '',
      quoteDetails: row.quoteDetails || '',
      deliveryDays: row.deliveryDays || '',
      paymentTerms: row.paymentTerms || '',
      validUntil: row.validUntil ? String(row.validUntil).slice(0, 10) : '',
      adminNotes: row.adminNotes || '',
      sendEmailToCustomer: true,
      status: row.status === 'new' ? 'quoted' : row.status,
    });
  };

  const handleReplyChange = (field, value) => {
    setReply((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveQuote = async () => {
    if (!viewing) return;
    if (reply.quotedPrice === '' || Number.isNaN(Number(reply.quotedPrice))) {
      setError('Enter a quotation price.');
      return;
    }
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const res = await quoteService.replyToQuote(viewing._id, {
        ...reply,
        quotedPrice: Number(reply.quotedPrice),
        validUntil: reply.validUntil || null,
      });
      setViewing(res.data);
      setMessage(res.message || 'Quotation saved.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save quotation.');
    } finally {
      setSaving(false);
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
    {
      key: 'quotedPrice',
      label: 'Price',
      render: (row) =>
        row.quotedPrice != null ? (
          <span className="font-semibold text-primary">
            ₹{Number(row.quotedPrice).toLocaleString('en-IN')}
          </span>
        ) : (
          <span className="text-muted text-xs">Not quoted</span>
        ),
    },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'createdAt', label: 'Received', render: (row) => formatDateTime(row.createdAt) },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openQuote(row)}
            className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
            title="View & reply with price"
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
      <PageHeader
        title="Quote Requests"
        description="Open a request, enter price & details, then email the quotation to the customer."
      />
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

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="Send Quotation"
        size="lg"
      >
        {viewing && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Customer</p>
                <p className="text-ink font-medium">{viewing.name}</p>
                <p className="text-muted text-xs mt-0.5">{viewing.companyName || '—'}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Contact</p>
                <p className="text-ink font-medium">{viewing.email}</p>
                <p className="text-muted text-xs mt-0.5">{viewing.phone}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase font-semibold mb-1">Location</p>
                <p className="text-ink font-medium">
                  {[viewing.city, viewing.state].filter(Boolean).join(', ') || '—'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 items-end">
                <a
                  href={`tel:${viewing.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-primary/10 text-primary"
                >
                  <FaPhoneAlt /> Call
                </a>
                <a
                  href={`https://wa.me/${String(viewing.phone).replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${viewing.name}, regarding your quote request with Lotus Agritech...`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700"
                >
                  <FaWhatsapp /> WhatsApp
                </a>
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
                <p className="text-muted text-xs uppercase font-semibold mb-1">Customer message</p>
                <p className="text-ink/80 bg-surface p-3 rounded-lg text-sm">{viewing.message}</p>
              </div>
            )}

            <div className="border-t border-slate-100 pt-5">
              <h4 className="font-semibold text-ink mb-3">Your quotation reply</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Quoted price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input-field"
                    value={reply.quotedPrice}
                    onChange={(e) => handleReplyChange('quotedPrice', e.target.value)}
                    placeholder="e.g. 125000"
                  />
                </div>
                <div>
                  <label className="label-field">Currency</label>
                  <select
                    className="input-field"
                    value={reply.currency}
                    onChange={(e) => handleReplyChange('currency', e.target.value)}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label-field">Price note</label>
                  <input
                    type="text"
                    className="input-field"
                    value={reply.priceNote}
                    onChange={(e) => handleReplyChange('priceNote', e.target.value)}
                    placeholder="e.g. Inclusive of GST / Ex-factory Dwarka"
                  />
                </div>
                <div>
                  <label className="label-field">Delivery time</label>
                  <input
                    type="text"
                    className="input-field"
                    value={reply.deliveryDays}
                    onChange={(e) => handleReplyChange('deliveryDays', e.target.value)}
                    placeholder="e.g. 7–10 working days"
                  />
                </div>
                <div>
                  <label className="label-field">Payment terms</label>
                  <input
                    type="text"
                    className="input-field"
                    value={reply.paymentTerms}
                    onChange={(e) => handleReplyChange('paymentTerms', e.target.value)}
                    placeholder="e.g. 50% advance, 50% before dispatch"
                  />
                </div>
                <div>
                  <label className="label-field">Valid until</label>
                  <input
                    type="date"
                    className="input-field"
                    value={reply.validUntil}
                    onChange={(e) => handleReplyChange('validUntil', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field">Status after save</label>
                  <select
                    className="input-field"
                    value={reply.status}
                    onChange={(e) => handleReplyChange('status', e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label-field">Quotation details (sent to customer)</label>
                  <textarea
                    rows={4}
                    className="input-field"
                    value={reply.quoteDetails}
                    onChange={(e) => handleReplyChange('quoteDetails', e.target.value)}
                    placeholder="Pipe sizes, pressure rating, fittings included, transport, warranty..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-field">Internal admin notes (not emailed)</label>
                  <textarea
                    rows={2}
                    className="input-field"
                    value={reply.adminNotes}
                    onChange={(e) => handleReplyChange('adminNotes', e.target.value)}
                    placeholder="Private notes for your team"
                  />
                </div>
              </div>

              <label className="mt-4 flex items-center gap-2 text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={reply.sendEmailToCustomer}
                  onChange={(e) => handleReplyChange('sendEmailToCustomer', e.target.checked)}
                  className="rounded border-slate-300"
                />
                Email this quotation to {viewing.email}
              </label>

              {error && <p className="error-text mt-3">{error}</p>}
              {message && <p className="text-sm text-emerald-600 font-medium mt-3">{message}</p>}
              {viewing.emailSentAt && (
                <p className="text-xs text-muted mt-2">
                  Last emailed: {formatDateTime(viewing.emailSentAt)}
                </p>
              )}

              <button
                type="button"
                onClick={handleSaveQuote}
                disabled={saving}
                className="mt-4 inline-flex items-center gap-2 btn btn-primary disabled:opacity-60"
              >
                <FaPaperPlane size={13} />
                {saving ? 'Saving...' : reply.sendEmailToCustomer ? 'Save & email quotation' : 'Save quotation'}
              </button>
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
