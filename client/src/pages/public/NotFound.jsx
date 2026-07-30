import { motion } from 'framer-motion';
import { FaArrowLeft, FaHome } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import Button from '../../components/common/Button.jsx';

const NotFound = () => {
  return (
    <>
      <SEO title="Page Not Found" description="The page you are looking for could not be found." />
      <section className="min-h-screen flex items-center justify-center px-5 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <h1 className="text-7xl md:text-9xl font-bold text-primary/20 mb-2">404</h1>
          <h2 className="text-2xl font-bold text-ink mb-3">Page Not Found</h2>
          <p className="text-muted mb-8">
            The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button to="/" icon={<FaHome />}>
              Back to Home
            </Button>
            <Button to="/contact" variant="outline" icon={<FaArrowLeft />}>
              Contact Support
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default NotFound;
