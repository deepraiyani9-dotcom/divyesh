import ResourceManager from '../../components/admin/ResourceManager.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import * as testimonialService from '../../services/testimonialService';
import { resolveAssetUrl, initials } from '../../utils/format';

const fields = [
  { name: 'name', label: 'Client Name', type: 'text', required: true },
  { name: 'company', label: 'Company', type: 'text' },
  { name: 'role', label: 'Role / Designation', type: 'text' },
  {
    name: 'rating',
    label: 'Rating',
    type: 'select',
    options: [1, 2, 3, 4, 5].map((n) => ({ value: n, label: `${n} Star${n > 1 ? 's' : ''}` })),
  },
  { name: 'message', label: 'Testimonial Message', type: 'textarea', required: true, fullWidth: true },
  { name: 'avatar', label: 'Avatar', type: 'image', fullWidth: true },
  { name: 'isActive', label: 'Active', type: 'checkbox' },
];

const columns = [
  {
    key: 'avatar',
    label: '',
    render: (row) =>
      row.avatar ? (
        <img src={resolveAssetUrl(row.avatar)} alt={row.name} className="w-10 h-10 rounded-full object-cover" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
          {initials(row.name)}
        </div>
      ),
  },
  { key: 'name', label: 'Name' },
  { key: 'company', label: 'Company' },
  { key: 'rating', label: 'Rating', render: (row) => `${row.rating || 5} / 5` },
  { key: 'isActive', label: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> },
];

const Testimonials = () => (
  <ResourceManager
    title="Testimonials"
    description="Manage client testimonials displayed across your website."
    service={{
      getAll: testimonialService.getTestimonials,
      create: testimonialService.createTestimonial,
      update: testimonialService.updateTestimonial,
      remove: testimonialService.deleteTestimonial,
    }}
    columns={columns}
    fields={fields}
    emptyValues={{ name: '', company: '', role: '', rating: 5, message: '', avatar: '', isActive: true }}
    itemLabel={(item) => item.name}
  />
);

export default Testimonials;
