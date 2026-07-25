import { useCallback, useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import PageHeader from './PageHeader.jsx';
import SearchInput from './SearchInput.jsx';
import DataTable from './DataTable.jsx';
import Pagination from './Pagination.jsx';
import Modal from './Modal.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import FormField from './FormField.jsx';
import { toArray } from '../../utils/format';

const getNested = (obj, path) =>
  path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

const setNested = (obj, path, value) => {
  const keys = path.split('.');
  const result = { ...obj };
  let cur = result;
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...(cur[keys[i]] || {}) };
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return result;
};

/**
 * Reusable CRUD manager for simple admin resources.
 *
 * props:
 *  - title, description
 *  - service: { getAll, create, update, remove }
 *  - columns: [{ key, label, render?(row) }]
 *  - fields: [{ name, label, type, options, required, ... }] (supports dot-path nesting)
 *  - emptyValues: default form state for "create"
 *  - transformSubmit(payload, editingItem) => payload
 *  - itemLabel(item) => string (used in delete confirmation)
 */
const ResourceManager = ({
  title,
  description,
  service,
  columns,
  fields,
  searchable = true,
  extraParams = {},
  transformSubmit,
  emptyValues = {},
  itemLabel = (item) => item.name || item.title || 'this item',
  limit = 10,
}) => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formValues, setFormValues] = useState(emptyValues);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await service.getAll({ page, limit, ...(q ? { q } : {}), ...extraParams });
      setItems(res.data || []);
      setPagination(res.pagination || { page: 1, pages: 1, total: (res.data || []).length });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setFormValues(emptyValues);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    let values = { ...emptyValues };
    fields.forEach((f) => {
      const val = getNested(item, f.name);
      values = setNested(values, f.name, val !== undefined ? val : getNested(emptyValues, f.name) ?? '');
    });
    setFormValues(values);
    setFormError('');
    setModalOpen(true);
  };

  const handleChange = (name, value) => {
    setFormValues((prev) => setNested(prev, name, value));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setSaving(true);
    setFormError('');
    try {
      let payload = JSON.parse(JSON.stringify(formValues));
      fields.forEach((f) => {
        const val = getNested(payload, f.name);
        if (f.type === 'tags') {
          payload = setNested(payload, f.name, toArray(val));
        } else if (f.type === 'number') {
          payload = setNested(payload, f.name, val === '' || val === undefined ? undefined : Number(val));
        }
      });
      if (transformSubmit) payload = transformSubmit(payload, editing);

      if (editing) {
        await service.update(editing._id, payload);
      } else {
        await service.create(payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save. Please check the form and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await service.remove(deleteTarget._id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const tableColumns = [
    ...columns,
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row)}
            className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
            aria-label="Edit"
          >
            <FaEdit size={13} />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
            aria-label="Delete"
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
        title={title}
        description={description}
        action={
          <button onClick={openCreate} className="btn btn-primary">
            <FaPlus size={12} /> Add New
          </button>
        }
      />
      <div className="card p-4 md:p-6">
        {searchable && (
          <div className="mb-4">
            <SearchInput
              value={q}
              onChange={(v) => {
                setQ(v);
                setPage(1);
              }}
              placeholder={`Search ${title.toLowerCase()}...`}
            />
          </div>
        )}
        <DataTable columns={tableColumns} rows={items} loading={loading} />
        <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${title}` : `Add ${title}`}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setModalOpen(false)} className="btn btn-outline" disabled={saving}>
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields.map((f) => (
            <div key={f.name} className={f.fullWidth ? 'md:col-span-2' : ''}>
              <FormField field={f} value={getNested(formValues, f.name)} onChange={handleChange} />
            </div>
          ))}
        </form>
        {formError && <p className="error-text mt-4">{formError}</p>}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={deleteTarget ? `Delete "${itemLabel(deleteTarget)}"? This cannot be undone.` : ''}
      />
    </div>
  );
};

export default ResourceManager;
