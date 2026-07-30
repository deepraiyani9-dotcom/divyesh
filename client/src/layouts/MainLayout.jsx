import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header.jsx';
import Footer from '../components/common/Footer.jsx';
import FloatingInquiryButton from '../components/common/FloatingInquiryButton.jsx';
import BackToTop from '../components/common/BackToTop.jsx';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <FloatingInquiryButton />
    </div>
  );
};

export default MainLayout;
