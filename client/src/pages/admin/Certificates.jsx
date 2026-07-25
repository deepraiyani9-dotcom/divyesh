import ResourceManager from '../../components/admin/ResourceManager.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import * as certificateService from '../../services/certificateService';
import { formatDate, resolveAssetUrl } from '../../utils/format';

const fields = [
  { name: 'title', label: 'Certificate Title', type: 'text', required: true },
  { name: 'issuer', label: 'Issued By', type: 'text' },
  { name: 'issuedAt', label: 'Issue Date', type: 'date' },
  { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
  { name: 'image', label: 'Certificate Image', type: 'image' },
  { name: 'fileUrl', label: 'Certificate Document (PDF)', type: 'image' },
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
  { key: 'issuer', label: 'Issuer' },
  { key: 'issuedAt', label: 'Issued', render: (row) => formatDate(row.issuedAt) },
  { key: 'isActive', label: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> },
];

const Certificates = () => (
  <ResourceManager
    title="Certificates"
    description="Manage certifications and compliance documents."
    service={{
      getAll: certificateService.getCertificates,
      create: certificateService.createCertificate,
      update: certificateService.updateCertificate,
      remove: certificateService.deleteCertificate,
    }}
    columns={columns}
    fields={fields}
    emptyValues={{ title: '', issuer: '', issuedAt: '', description: '', image: '', fileUrl: '', isActive: true }}
    itemLabel={(item) => item.title}
  />
);

export default Certificates;
