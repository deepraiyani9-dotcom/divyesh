import { motion } from 'framer-motion';
import { FaBalanceScale, FaFlask, FaMicroscope, FaRulerCombined, FaShieldAlt, FaWater } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import SectionTitle from '../../components/common/SectionTitle.jsx';
import ContactCTA from '../../components/common/ContactCTA.jsx';

const TESTS = [
  { icon: <FaBalanceScale />, title: 'Pressure Testing', description: 'Every batch is tested under sustained hydrostatic pressure to verify strength ratings.' },
  { icon: <FaRulerCombined />, title: 'Dimensional Accuracy', description: 'Precise diameter, wall thickness and length checks ensure consistent, spec-compliant pipes.' },
  { icon: <FaFlask />, title: 'Material Composition', description: 'Raw resin is lab-tested for purity to guarantee lead-free, potable-water-safe pipes.' },
  { icon: <FaMicroscope />, title: 'Impact Resistance', description: 'Pipes undergo impact testing to ensure durability during transport, handling and installation.' },
  { icon: <FaWater />, title: 'Leak & Joint Testing', description: 'Joint and seal integrity is verified to prevent leakage in real-world installations.' },
  { icon: <FaShieldAlt />, title: 'UV & Weather Resistance', description: 'Pipes are evaluated for long-term performance under sun exposure and varying weather conditions.' },
];

const STANDARDS = ['ISO 9001:2015', 'IS 4985 (UPVC Pipes)', 'IS 15778 (Agricultural Pipes)', 'Lead-Free Compliance'];

const QualityControl = () => {
  return (
    <>
      <SEO title="Quality Control" description="Explore the rigorous quality control processes and standards behind every Lotus Agritech pipe." />
      <PageHero
        title="Quality Control"
        subtitle="Every pipe is tested, verified and certified before it leaves our facility."
        breadcrumb={[{ label: 'Quality Control' }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle eyebrow="Testing Protocols" title="How We Ensure Consistent Quality" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTS.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
                className="card p-6 hover:-translate-y-2 transition-transform"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl mb-4">
                  {t.icon}
                </div>
                <h3 className="font-semibold text-ink mb-2">{t.title}</h3>
                <p className="text-sm text-muted">{t.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #0D7377 0%, transparent 45%)' }} />
        <div className="container-custom relative z-10">
          <SectionTitle light eyebrow="Standards We Follow" title="Certified Quality, Every Time" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STANDARDS.map((std, i) => (
              <motion.div
                key={std}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-md"
              >
                <FaShieldAlt className="text-accent text-2xl mx-auto mb-3" />
                <p className="text-ink font-semibold text-sm">{std}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
};

export default QualityControl;
