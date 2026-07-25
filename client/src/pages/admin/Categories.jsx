import ResourceManager from '../../components/admin/ResourceManager.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import * as categoryService from '../../services/categoryService';
import { resolveAssetUrl } from '../../utils/format';

const fields = [
  { name: 'name', label: 'Category Name', type: 'text', required: true },
  { name: 'slug', label: 'Slug (optional)', type: 'text', help: 'Leave blank to auto-generate from name.' },
  { name: 'order', label: 'Display Order', type: 'number' },
  { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
  { name: 'image', label: 'Category Image', type: 'image', fullWidth: true },
  { name: 'isActive', label: 'Active', type: 'checkbox' },
];

const columns = [
  {
    key: 'image',
    label: '',
    render: (row) =>
      row.image ? (
        <img src={resolveAssetUrl(row.image)} alt={row.name} className="w-10 h-10 rounded-lg object-cover" />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-surface" />
      ),
  },
  { key: 'name', label: 'Name' },
  { key: 'order', label: 'Order' },
  { key: 'isActive', label: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> },
];

const Categories = () => (
  <ResourceManager
    title="Categories"
    description="Manage product categories displayed across your website."
    service={{
      getAll: categoryService.getCategories,
      create: categoryService.createCategory,
      update: categoryService.updateCategory,
      remove: categoryService.deleteCategory,
    }}
    columns={columns}
    fields={fields}
    emptyValues={{ name: '', slug: '', order: 0, description: '', image: '', isActive: true }}
    itemLabel={(item) => item.name}
  />
);

export default Categories;
