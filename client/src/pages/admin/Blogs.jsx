import ResourceManager from '../../components/admin/ResourceManager.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import * as blogService from '../../services/blogService';
import { formatDate, resolveAssetUrl } from '../../utils/format';

const fields = [
  { name: 'title', label: 'Blog Title', type: 'text', required: true },
  { name: 'slug', label: 'Slug (optional)', type: 'text', help: 'Leave blank to auto-generate from title.' },
  { name: 'author', label: 'Author', type: 'text' },
  { name: 'tags', label: 'Tags', type: 'tags' },
  { name: 'excerpt', label: 'Excerpt', type: 'textarea', fullWidth: true },
  { name: 'content', label: 'Content', type: 'textarea', rows: 8, required: true, fullWidth: true },
  { name: 'coverImage', label: 'Cover Image', type: 'image', fullWidth: true },
  { name: 'isPublished', label: 'Published', type: 'checkbox' },
];

const columns = [
  {
    key: 'coverImage',
    label: '',
    render: (row) =>
      row.coverImage ? (
        <img src={resolveAssetUrl(row.coverImage)} alt={row.title} className="w-12 h-12 rounded-lg object-cover" />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-surface" />
      ),
  },
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'publishedAt', label: 'Published', render: (row) => formatDate(row.publishedAt || row.createdAt) },
  { key: 'isPublished', label: 'Status', render: (row) => <StatusBadge status={row.isPublished ? 'active' : 'inactive'} /> },
];

const Blogs = () => (
  <ResourceManager
    title="Blogs"
    description="Manage blog articles published on your website."
    service={{
      getAll: blogService.getBlogs,
      create: blogService.createBlog,
      update: blogService.updateBlog,
      remove: blogService.deleteBlog,
    }}
    columns={columns}
    fields={fields}
    emptyValues={{
      title: '',
      slug: '',
      author: 'Lotus Agritech',
      tags: [],
      excerpt: '',
      content: '',
      coverImage: '',
      isPublished: true,
    }}
    itemLabel={(item) => item.title}
  />
);

export default Blogs;
