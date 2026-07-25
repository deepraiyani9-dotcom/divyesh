import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import ContactCTA from '../../components/common/ContactCTA.jsx';
import { FAQS } from '../../utils/constants';

const FAQ = () => {
  const [open, setOpen] = useState(0);

  return (
    <>
      <SEO title="FAQ" description="Frequently asked questions about Lotus Agritech's PVC & UPVC pipes, ordering, delivery and more." />
      <PageHero title="Frequently Asked Questions" subtitle="Everything you need to know about our products and services." breadcrumb={[{ label: 'FAQ' }]} />

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
                className="card overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-semibold text-secondary">{faq.question}</span>
                  <FaChevronDown className={`text-primary shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-muted leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
};

export default FAQ;
