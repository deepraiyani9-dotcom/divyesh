import ResourceManager from '../../components/admin/ResourceManager.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import * as galleryService from '../../services/galleryService';
import { resolveAssetUrl } from '../../utils/format';

const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Infrastructure, Quality, Team' },
  { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
  { name: 'image', label: 'Image', type: 'image', fullWidth: true, required: true },
  { name: 'isActive', label: 'Active', type: 'checkbox' },
];

const columns = [
  {
    key: 'image',
    label: '',
    render: (row) =>
      row.image ? (
        <img src={resolveAssetUrl(row.image)} alt={row.title} className="w-12 h-12 rounded-lg object-cover" />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-surface" />
      ),
  },
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'isActive', label: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> },
];

const GalleryAdmin = () => (
  <ResourceManager
    title="Gallery"
    description="Manage photos displayed in the public gallery page."
    service={{
      getAll: galleryService.getGallery,
      create: galleryService.createGalleryItem,
      update: galleryService.updateGalleryItem,
      remove: galleryService.deleteGalleryItem,
    }}
    columns={columns}
    fields={fields}
    emptyValues={{ title: '', category: 'General', description: '', image: '', isActive: true }}
    itemLabel={(item) => item.title}
  />
);

export default GalleryAdmin;
