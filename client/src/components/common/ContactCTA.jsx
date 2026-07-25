import { motion } from 'framer-motion';
import { FaPhoneAlt, FaFileInvoice } from 'react-icons/fa';
import Button from './Button.jsx';
import { COMPANY } from '../../utils/constants';

const ContactCTA = () => {
  return (
    <section className="section-padding bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 15% 50%, #0B5ED7 0%, transparent 50%), radial-gradient(circle at 85% 30%, #F97316 0%, transparent 45%)',
      }} />
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left"
        >
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
              Ready to build steady flows for your project?
            </h2>
            <p className="text-slate-300 max-w-xl">
              Get in touch with our team for bulk pricing, dealership enquiries, or technical guidance on our PVC & UPVC pipe range.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Button href={COMPANY.phoneHref} variant="white" icon={<FaPhoneAlt />}>
              Call Us Now
            </Button>
            <Button to="/request-quote" variant="accent" icon={<FaFileInvoice />}>
              Request a Quote
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;
