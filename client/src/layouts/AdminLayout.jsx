import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaBars,
  FaBoxOpen,
  FaChartLine,
  FaCogs,
  FaEnvelopeOpenText,
  FaFileInvoiceDollar,
  FaImages,
  FaLayerGroup,
  FaNewspaper,
  FaSignOutAlt,
  FaTimes,
  FaUserCircle,
  FaUsers,
  FaCertificate,
  FaExternalLinkAlt,
  FaGlobe,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { COMPANY } from '../utils/constants';
import logo from '../assets/logo.png';
import GlobalSearch from '../components/admin/GlobalSearch.jsx';
import EnquiryNotifier from '../components/admin/EnquiryNotifier.jsx';

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <FaChartLine /> },
  { to: '/admin/products', label: 'Products', icon: <FaBoxOpen /> },
  { to: '/admin/categories', label: 'Categories', icon: <FaLayerGroup /> },
  { to: '/admin/blogs', label: 'Blogs', icon: <FaNewspaper /> },
  { to: '/admin/gallery', label: 'Gallery', icon: <FaImages /> },
  { to: '/admin/testimonials', label: 'Testimonials', icon: <FaUsers /> },
  { to: '/admin/certificates', label: 'Certificates', icon: <FaCertificate /> },
  { to: '/admin/contacts', label: 'Contact Enquiries', icon: <FaEnvelopeOpenText /> },
  { to: '/admin/quotes', label: 'Quote Requests', icon: <FaFileInvoiceDollar /> },
  { to: '/admin/settings', label: 'Settings', icon: <FaCogs /> },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#3D4A63] text-white">
      <Link to="/admin/dashboard" className="flex items-center gap-2.5 px-5 py-5 border-b border-white/20">
        <img
          src={logo}
          alt={COMPANY.name}
          className="h-11 w-11 object-contain rounded-full bg-white"
        />
        <span className="text-white font-bold leading-tight">
          {COMPANY.name}
          <span className="block text-[11px] text-white/80 font-medium">Admin Panel</span>
        </span>
      </Link>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 rounded-lg text-sm font-medium ${
                isActive ? 'bg-primary text-white' : 'text-slate-300'
              }`
            }
            style={{ paddingTop: '0.65rem', paddingBottom: '0.65rem' }}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-2">
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 rounded-lg text-sm font-medium text-white bg-primary"
          style={{ paddingTop: '0.65rem', paddingBottom: '0.65rem' }}
        >
          <FaGlobe className="text-base" />
          View Website
          <FaExternalLinkAlt className="ml-auto text-xs opacity-80" />
        </Link>
      </div>
      <div className="p-4 border-t border-white/20">
        <Link
          to="/admin/profile"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg mb-2"
        >
          <FaUserCircle className="text-slate-300 text-xl" />
          <div className="text-sm">
            <p className="text-white font-medium leading-tight">{user?.name}</p>
            <p className="text-slate-400 text-xs">{user?.role}</p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 w-full"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-surface">
      <aside className="hidden lg:flex w-72 bg-[#3D4A63] shrink-0 fixed h-screen">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="w-72 h-full bg-[#3D4A63]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-5 right-4 text-white text-xl"
                aria-label="Close sidebar"
              >
                <FaTimes />
              </button>
              <SidebarContent />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-5 py-4 flex items-center justify-between gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-ink text-xl shrink-0"
            aria-label="Open sidebar"
          >
            <FaBars />
          </button>
          <h1 className="font-semibold text-ink hidden lg:block shrink-0">Admin Dashboard</h1>
          <div className="flex-1 flex justify-center max-w-md mx-auto">
            <GlobalSearch />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg"
            >
              <FaGlobe size={13} />
              <span className="hidden sm:inline">View Website</span>
            </Link>
            <span className="text-sm text-muted hidden sm:inline">Welcome, {user?.name?.split(' ')[0]}</span>
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-secondary">
          <Outlet />
        </main>
        <EnquiryNotifier />
      </div>
    </div>
  );
};

export default AdminLayout;
