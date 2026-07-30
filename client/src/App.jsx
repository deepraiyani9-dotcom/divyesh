import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
import useScrollToTop from './hooks/useScrollToTop.js';

// Public pages
const Home = lazy(() => import('./pages/public/Home.jsx'));
const About = lazy(() => import('./pages/public/About.jsx'));
const Products = lazy(() => import('./pages/public/Products.jsx'));
const ProductDetails = lazy(() => import('./pages/public/ProductDetails.jsx'));
const Industries = lazy(() => import('./pages/public/Industries.jsx'));
const Gallery = lazy(() => import('./pages/public/Gallery.jsx'));
const Certificates = lazy(() => import('./pages/public/Certificates.jsx'));
const Infrastructure = lazy(() => import('./pages/public/Infrastructure.jsx'));
const ManufacturingProcess = lazy(() => import('./pages/public/ManufacturingProcess.jsx'));
const QualityControl = lazy(() => import('./pages/public/QualityControl.jsx'));
const Blog = lazy(() => import('./pages/public/Blog.jsx'));
const BlogDetails = lazy(() => import('./pages/public/BlogDetails.jsx'));
const Career = lazy(() => import('./pages/public/Career.jsx'));
const FAQ = lazy(() => import('./pages/public/FAQ.jsx'));
const Testimonials = lazy(() => import('./pages/public/Testimonials.jsx'));
const Contact = lazy(() => import('./pages/public/Contact.jsx'));
const RequestQuote = lazy(() => import('./pages/public/RequestQuote.jsx'));
const DownloadBrochure = lazy(() => import('./pages/public/DownloadBrochure.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/public/PrivacyPolicy.jsx'));
const Terms = lazy(() => import('./pages/public/Terms.jsx'));
const NotFound = lazy(() => import('./pages/public/NotFound.jsx'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/Login.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const AdminProducts = lazy(() => import('./pages/admin/Products.jsx'));
const AdminCategories = lazy(() => import('./pages/admin/Categories.jsx'));
const AdminBlogs = lazy(() => import('./pages/admin/Blogs.jsx'));
const AdminGallery = lazy(() => import('./pages/admin/Gallery.jsx'));
const AdminTestimonials = lazy(() => import('./pages/admin/Testimonials.jsx'));
const AdminCertificates = lazy(() => import('./pages/admin/Certificates.jsx'));
const AdminContacts = lazy(() => import('./pages/admin/Contacts.jsx'));
const AdminQuotes = lazy(() => import('./pages/admin/Quotes.jsx'));
const AdminSettings = lazy(() => import('./pages/admin/Settings.jsx'));
const AdminProfile = lazy(() => import('./pages/admin/Profile.jsx'));

function AppRoutes() {
  useScrollToTop();

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Public site */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/infrastructure" element={<Infrastructure />} />
          <Route path="/manufacturing-process" element={<ManufacturingProcess />} />
          <Route path="/quality-control" element={<QualityControl />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          <Route path="/careers" element={<Career />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/request-quote" element={<RequestQuote />} />
          <Route path="/download-brochure" element={<DownloadBrochure />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="quotes" element={<AdminQuotes />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
