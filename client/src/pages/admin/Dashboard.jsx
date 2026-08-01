import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut, PolarArea } from 'react-chartjs-2';
import {
  FaBoxOpen,
  FaEnvelopeOpenText,
  FaFileInvoiceDollar,
  FaImages,
  FaLayerGroup,
  FaNewspaper,
  FaSync,
  FaUsers,
} from 'react-icons/fa';
import StatCard from '../../components/admin/StatCard.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import DataTable from '../../components/admin/DataTable.jsx';
import { getAnalytics } from '../../services/analyticsService';
import { formatDateTime } from '../../utils/format';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const REFRESH_MS = 20000;
const RANGE_OPTIONS = [7, 14, 30];

const shortLabel = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [days, setDays] = useState(14);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [livePulse, setLivePulse] = useState(true);

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) setRefreshing(true);
      else setLoading(true);
      try {
        const res = await getAnalytics({ days });
        setData(res.data);
        setLastUpdated(new Date());
        setError('');
        setLivePulse((p) => !p);
      } catch {
        setError('Failed to load live analytics.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [days]
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const id = setInterval(() => load({ silent: true }), REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  const counts = data?.counts || {};
  const live = data?.live || {};
  const trend = data?.trend || { labels: [], contacts: [], quotes: [], total: [] };

  const stats = useMemo(
    () => [
      { label: 'Products', value: counts.products || 0, icon: <FaBoxOpen />, color: 'primary' },
      { label: 'Categories', value: counts.categories || 0, icon: <FaLayerGroup />, color: 'accent' },
      { label: 'Blog Posts', value: counts.blogs || 0, icon: <FaNewspaper />, color: 'emerald' },
      { label: 'Gallery Items', value: counts.gallery || 0, icon: <FaImages />, color: 'slate' },
      { label: 'Contact Enquiries', value: counts.contacts || 0, icon: <FaEnvelopeOpenText />, color: 'primary' },
      { label: 'Quote Requests', value: counts.quotes || 0, icon: <FaFileInvoiceDollar />, color: 'accent' },
    ],
    [counts]
  );

  const lineData = useMemo(
    () => ({
      labels: (trend.labels || []).map(shortLabel),
      datasets: [
        {
          label: 'Contacts',
          data: trend.contacts || [],
          borderColor: '#0D7377',
          backgroundColor: 'rgba(13, 115, 119, 0.18)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2.5,
        },
        {
          label: 'Quotes',
          data: trend.quotes || [],
          borderColor: '#E07A3D',
          backgroundColor: 'rgba(224, 122, 61, 0.12)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2.5,
        },
        {
          label: 'Total activity',
          data: trend.total || [],
          borderColor: '#5B6B8C',
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.35,
          borderDash: [6, 4],
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    }),
    [trend]
  );

  const statusData = useMemo(() => {
    const contacts = data?.contactStatuses || [];
    const quotes = data?.quoteStatuses || [];
    return {
      labels: ['New contacts', 'In progress', 'Closed contacts', 'New quotes', 'Quoted', 'Closed quotes'],
      datasets: [
        {
          data: [
            contacts.find((s) => s.status === 'new')?.count || 0,
            contacts.find((s) => s.status === 'in-progress')?.count || 0,
            contacts.find((s) => s.status === 'closed')?.count || 0,
            quotes.find((s) => s.status === 'new')?.count || 0,
            quotes.find((s) => s.status === 'quoted')?.count || 0,
            quotes.find((s) => s.status === 'closed')?.count || 0,
          ],
          backgroundColor: ['#0D7377', '#14919B', '#5B6B8C', '#E07A3D', '#F0A06A', '#C9652A'],
          borderWidth: 0,
        },
      ],
    };
  }, [data]);

  const polarData = useMemo(() => {
    const mix = data?.contentMix || [];
    return {
      labels: mix.map((m) => m.label),
      datasets: [
        {
          data: mix.map((m) => m.value),
          backgroundColor: [
            'rgba(13, 115, 119, 0.75)',
            'rgba(224, 122, 61, 0.75)',
            'rgba(91, 107, 140, 0.75)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(44, 51, 64, 0.65)',
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [data]);

  if (loading && !data) return <LoadingSpinner />;
  if (error && !data) return <p className="error-text">{error}</p>;

  return (
    <div>
      <div className="mb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex h-2.5 w-2.5 rounded-full ${livePulse ? 'bg-emerald-500' : 'bg-emerald-400'} shadow-[0_0_0_4px_rgba(16,185,129,0.2)]`}
            />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Live dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-ink">Activity Tracking</h1>
          <p className="text-sm text-muted mt-1">
            Auto-refreshes every {REFRESH_MS / 1000}s
            {lastUpdated ? ` · Updated ${lastUpdated.toLocaleTimeString()}` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setDays(opt)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  days === opt ? 'bg-primary text-white' : 'text-muted hover:text-ink'
                }`}
              >
                {opt}D
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => load({ silent: true })}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-ink hover:border-primary/40 disabled:opacity-60"
          >
            <FaSync className={refreshing ? 'animate-spin text-primary' : 'text-primary'} size={12} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-primary to-primary-dark shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Today’s enquiries</p>
          <p className="text-3xl font-bold mt-2">{live.todayTotal || 0}</p>
          <p className="text-xs text-white/75 mt-1">
            {live.todayContacts || 0} contacts · {live.todayQuotes || 0} quotes
          </p>
        </div>
        <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-accent to-accent-dark shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Open / new contacts</p>
          <p className="text-3xl font-bold mt-2">{live.newContacts || 0}</p>
          <p className="text-xs text-white/75 mt-1">Waiting for follow-up</p>
        </div>
        <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-brand to-brand-dark shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">New quote requests</p>
          <p className="text-3xl font-bold mt-2">{live.newQuotes || 0}</p>
          <p className="text-xs text-white/75 mt-1">Ready to price</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="p-5 md:p-6 lg:col-span-2 rounded-2xl border border-slate-300 shadow-md bg-white">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div>
              <h3 className="font-semibold text-ink">Live enquiry trend</h3>
              <p className="text-xs text-muted mt-0.5">Line tracking for contacts & quotes · last {days} days</p>
            </div>
          </div>
          <div className="h-80">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                  legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } },
                },
                scales: {
                  y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: 'rgba(15,23,42,0.06)' } },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        <div className="p-5 md:p-6 rounded-2xl border border-slate-300 shadow-md bg-white">
          <h3 className="font-semibold text-ink mb-1">Pipeline status</h3>
          <p className="text-xs text-muted mb-4">Contacts & quotes by stage</p>
          <div className="h-72 flex items-center justify-center">
            <Doughnut
              data={statusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '58%',
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="p-5 md:p-6 rounded-2xl border border-slate-300 shadow-md bg-white">
          <h3 className="font-semibold text-ink mb-1">Content mix</h3>
          <p className="text-xs text-muted mb-4">Polar view of site content volume</p>
          <div className="h-72">
            <PolarArea
              data={polarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } },
                scales: { r: { ticks: { display: false }, grid: { color: 'rgba(15,23,42,0.08)' } } },
              }}
            />
          </div>
        </div>

        <div className="p-5 md:p-6 lg:col-span-2 rounded-2xl border border-slate-300 shadow-md bg-white">
          <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
            <FaEnvelopeOpenText className="text-primary" /> Recent Contact Enquiries
          </h3>
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'phone', label: 'Phone' },
              { key: 'status', label: 'Status' },
              { key: 'createdAt', label: 'Date', render: (row) => formatDateTime(row.createdAt) },
            ]}
            rows={data?.recentContacts || []}
            emptyMessage="No recent contact enquiries."
          />
        </div>
      </div>

      <div className="p-5 md:p-6 rounded-2xl border border-slate-300 shadow-md bg-white">
        <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
          <FaFileInvoiceDollar className="text-accent" /> Recent Quote Requests
        </h3>
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'companyName', label: 'Company' },
            { key: 'status', label: 'Status' },
            { key: 'createdAt', label: 'Date', render: (row) => formatDateTime(row.createdAt) },
          ]}
          rows={data?.recentQuotes || []}
          emptyMessage="No recent quote requests."
        />
      </div>

      <p className="text-center text-xs text-muted mt-8">
        <FaUsers className="inline mr-1.5" /> Live graphs update automatically. Open Contacts / Quotes to manage records.
      </p>
    </div>
  );
};

export default Dashboard;
