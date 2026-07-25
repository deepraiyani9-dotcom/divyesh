import { useEffect, useState } from 'react';
import ResourceManager from '../../components/admin/ResourceManager.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import * as productService from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { formatCurrency, resolveAssetUrl } from '../../utils/format';

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    getCategories({ limit: 100 })
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));
  }, []);

  if (loadingCategories) return <LoadingSpinner />;

  const fields = [
    { name: 'name', label: 'Product Name', type: 'text', required: true },
    { name: 'slug', label: 'Slug (optional)', type: 'text', help: 'Leave blank to auto-generate from name.' },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: categories.map((c) => ({ value: c._id, label: c.name })),
    },
    { name: 'price', label: 'Price (₹)', type: 'number' },
    { name: 'shortDescription', label: 'Short Description', type: 'textarea', fullWidth: true },
    { name: 'description', label: 'Full Description', type: 'textarea', rows: 6, fullWidth: true },
    { name: 'features', label: 'Features', type: 'tags', fullWidth: true },
    { name: 'applications', label: 'Applications', type: 'tags', fullWidth: true },
    { name: 'specifications.diameter', label: 'Diameter', type: 'text', placeholder: 'e.g. 63mm' },
    { name: 'specifications.pressureRating', label: 'Pressure Rating', type: 'text', placeholder: 'e.g. PN10' },
    { name: 'specifications.length', label: 'Length', type: 'text', placeholder: 'e.g. 6m' },
    { name: 'specifications.material', label: 'Material', type: 'text', placeholder: 'PVC / UPVC' },
    { name: 'specifications.color', label: 'Color', type: 'text', placeholder: 'White' },
    { name: 'images', label: 'Product Images', type: 'imageArray', fullWidth: true },
    { name: 'isFeatured', label: 'Featured Product', type: 'checkbox' },
    { name: 'isActive', label: 'Active', type: 'checkbox' },
  ];

  const columns = [
    {
      key: 'images',
      label: '',
      render: (row) =>
        row.images?.[0] ? (
          <img src={resolveAssetUrl(row.images[0])} alt={row.name} className="w-12 h-12 rounded-lg object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-surface" />
        ),
    },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category', render: (row) => row.category?.name || '—' },
    { key: 'price', label: 'Price', render: (row) => (row.price ? formatCurrency(row.price) : 'On Request') },
    {
      key: 'isFeatured',
      label: 'Featured',
      render: (row) => (row.isFeatured ? <StatusBadge status="active" /> : <span className="text-muted text-xs">—</span>),
    },
    { key: 'isActive', label: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> },
  ];

  return (
    <ResourceManager
      title="Products"
      description="Manage your PVC & UPVC pipe product catalogue."
      service={{
        getAll: productService.getProducts,
        create: productService.createProduct,
        update: productService.updateProduct,
        remove: productService.deleteProduct,
      }}
      columns={columns}
      fields={fields}
      emptyValues={{
        name: '',
        slug: '',
        category: '',
        price: '',
        shortDescription: '',
        description: '',
        features: [],
        applications: [],
        specifications: { diameter: '', pressureRating: '', length: '', material: 'PVC', color: 'White' },
        images: [],
        isFeatured: false,
        isActive: true,
      }}
      itemLabel={(item) => item.name}
    />
  );
};

export default Products;
