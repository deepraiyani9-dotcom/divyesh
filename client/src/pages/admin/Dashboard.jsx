import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  FaBoxOpen,
  FaBriefcase,
  FaClipboardList,
  FaEnvelopeOpenText,
  FaFileInvoiceDollar,
  FaImages,
  FaLayerGroup,
  FaNewspaper,
  FaUsers,
} from 'react-icons/fa';
import StatCard from '../../components/admin/StatCard.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import DataTable from '../../components/admin/DataTable.jsx';
import { getAnalytics } from '../../services/analyticsService';
import { formatDateTime } from '../../utils/format';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAnalytics()
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load analytics data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="error-text">{error}</p>;

  const counts = data?.counts || {};

  const stats = [
    { label: 'Products', value: counts.products || 0, icon: <FaBoxOpen />, color: 'primary' },
    { label: 'Categories', value: counts.categories || 0, icon: <FaLayerGroup />, color: 'accent' },
    { label: 'Blog Posts', value: counts.blogs || 0, icon: <FaNewspaper />, color: 'emerald' },
    { label: 'Gallery Items', value: counts.gallery || 0, icon: <FaImages />, color: 'slate' },
    { label: 'Contact Enquiries', value: counts.contacts || 0, icon: <FaEnvelopeOpenText />, color: 'primary' },
    { label: 'Quote Requests', value: counts.quotes || 0, icon: <FaFileInvoiceDollar />, color: 'accent' },
    { label: 'Open Positions', value: counts.careers || 0, icon: <FaBriefcase />, color: 'emerald' },
    { label: 'New Applications', value: counts.applications || 0, icon: <FaClipboardList />, color: 'slate' },
  ];

  const barData = {
    labels: ['Products', 'Categories', 'Blogs', 'Gallery', 'Testimonials'],
    datasets: [
      {
        label: 'Total Records',
        data: [counts.products, counts.categories, counts.blogs, counts.gallery, counts.testimonials],
        backgroundColor: '#0B5ED7',
        borderRadius: 8,
        maxBarThickness: 48,
      },
    ],
  };

  const doughnutData = {
    labels: ['Contacts', 'Quotes', 'Applications'],
    datasets: [
      {
        data: [counts.contacts || 0, counts.quotes || 0, counts.applications || 0],
        backgroundColor: ['#0B5ED7', '#F97316', '#1E293B'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">Dashboard Overview</h1>
        <p className="text-sm text-muted mt-1">Welcome back! Here's a summary of your website activity.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-5 md:p-6 lg:col-span-2">
          <h3 className="font-semibold text-secondary mb-4">Content Overview</h3>
          <div className="h-72">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
              }}
            />
          </div>
        </div>
        <div className="card p-5 md:p-6">
          <h3 className="font-semibold text-secondary mb-4">Enquiries Breakdown</h3>
          <div className="h-72 flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5 md:p-6">
          <h3 className="font-semibold text-secondary mb-4 flex items-center gap-2">
            <FaEnvelopeOpenText className="text-primary" /> Recent Contact Enquiries
          </h3>
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'phone', label: 'Phone' },
              { key: 'createdAt', label: 'Date', render: (row) => formatDateTime(row.createdAt) },
            ]}
            rows={data?.recentContacts || []}
            emptyMessage="No recent contact enquiries."
          />
        </div>
        <div className="card p-5 md:p-6">
          <h3 className="font-semibold text-secondary mb-4 flex items-center gap-2">
            <FaFileInvoiceDollar className="text-accent" /> Recent Quote Requests
          </h3>
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'companyName', label: 'Company' },
              { key: 'createdAt', label: 'Date', render: (row) => formatDateTime(row.createdAt) },
            ]}
            rows={data?.recentQuotes || []}
            emptyMessage="No recent quote requests."
          />
        </div>
      </div>

      <p className="text-center text-xs text-muted mt-8">
        <FaUsers className="inline mr-1.5" /> Data refreshed on page load. Visit individual sections to manage records.
      </p>
    </div>
  );
};

export default Dashboard;
