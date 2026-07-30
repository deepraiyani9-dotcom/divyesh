import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import SectionTitle from '../../components/common/SectionTitle.jsx';
import ContactCTA from '../../components/common/ContactCTA.jsx';
import { MANUFACTURING_STEPS } from '../../utils/constants';

const ManufacturingProcess = () => {
  return (
    <>
      <SEO title="Manufacturing Process" description="Learn about Lotus Agritech's precise, quality-controlled PVC & UPVC pipe manufacturing process." />
      <PageHero
        title="Manufacturing Process"
        subtitle="From raw resin to the finished pipe — a journey defined by precision and quality control."
        breadcrumb={[{ label: 'Manufacturing Process' }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle eyebrow="Step by Step" title="How We Manufacture Our Pipes" />
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-7 top-0 bottom-0 w-px bg-slate-200 hidden sm:block" />
            <div className="space-y-8">
              {MANUFACTURING_STEPS.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex gap-6 items-start"
                >
                  <span className="w-14 h-14 rounded-2xl bg-primary text-white font-bold flex items-center justify-center shrink-0 shadow-lg shadow-primary/30 relative z-10">
                    {step.step}
                  </span>
                  <div className="card p-6 flex-1">
                    <h3 className="font-semibold text-lg text-ink mb-2">{step.title}</h3>
                    <p className="text-muted">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
};

export default ManufacturingProcess;
