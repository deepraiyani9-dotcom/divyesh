import ResourceManager from '../../components/admin/ResourceManager.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import * as careerService from '../../services/careerService';

const fields = [
  { name: 'title', label: 'Job Title', type: 'text', required: true },
  { name: 'department', label: 'Department', type: 'text' },
  { name: 'location', label: 'Location', type: 'text' },
  {
    name: 'type',
    label: 'Job Type',
    type: 'select',
    options: [
      { value: 'Full-time', label: 'Full-time' },
      { value: 'Part-time', label: 'Part-time' },
      { value: 'Contract', label: 'Contract' },
      { value: 'Internship', label: 'Internship' },
    ],
  },
  { name: 'description', label: 'Job Description', type: 'textarea', required: true, fullWidth: true },
  { name: 'requirements', label: 'Requirements', type: 'tags', fullWidth: true },
  { name: 'isOpen', label: 'Position Open', type: 'checkbox' },
];

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'department', label: 'Department' },
  { key: 'location', label: 'Location' },
  { key: 'type', label: 'Type' },
  { key: 'isOpen', label: 'Status', render: (row) => <StatusBadge status={row.isOpen ? 'active' : 'closed'} /> },
];

const Careers = () => (
  <ResourceManager
    title="Careers"
    description="Manage job openings displayed on the careers page."
    service={{
      getAll: careerService.getCareers,
      create: careerService.createCareer,
      update: careerService.updateCareer,
      remove: careerService.deleteCareer,
    }}
    columns={columns}
    fields={fields}
    emptyValues={{
      title: '',
      department: '',
      location: 'Dwarka, Gujarat',
      type: 'Full-time',
      description: '',
      requirements: [],
      isOpen: true,
    }}
    itemLabel={(item) => item.title}
  />
);

export default Careers;
