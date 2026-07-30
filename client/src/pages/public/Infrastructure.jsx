import { motion } from 'framer-motion';
import { FaCogs, FaFlask, FaIndustry, FaWarehouse } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import SectionTitle from '../../components/common/SectionTitle.jsx';
import ContactCTA from '../../components/common/ContactCTA.jsx';
import heroImg from '../../assets/hero.png';

const FACILITIES = [
  {
    icon: <FaIndustry />,
    title: 'Extrusion Lines',
    description: 'Multiple high-speed automated extrusion lines capable of producing pipes across a wide diameter range.',
  },
  {
    icon: <FaFlask />,
    title: 'Quality Testing Lab',
    description: 'In-house laboratory equipped for pressure, impact and dimensional testing of every production batch.',
  },
  {
    icon: <FaWarehouse />,
    title: 'Storage & Warehousing',
    description: 'Spacious raw material and finished goods warehousing ensuring smooth, uninterrupted supply.',
  },
  {
    icon: <FaCogs />,
    title: 'Maintenance Workshop',
    description: 'Dedicated in-house maintenance team ensuring maximum machine uptime and production efficiency.',
  },
];

const STATS = [
  { value: '50,000+ sq. ft.', label: 'Manufacturing Area' },
  { value: '12+', label: 'Extrusion Lines' },
  { value: '500+ MT', label: 'Monthly Capacity' },
  { value: '100%', label: 'Power Backup' },
];

const Infrastructure = () => {
  return (
    <>
      <SEO title="Infrastructure" description="Discover Lotus Agritech's state-of-the-art manufacturing infrastructure, extrusion lines and quality lab." />
      <PageHero title="Our Infrastructure" subtitle="A modern manufacturing facility built for scale, precision and consistency." breadcrumb={[{ label: 'Infrastructure' }]} />

      <section className="section-padding">
        <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
          <motion.img
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            src={heroImg}
            alt="Manufacturing infrastructure"
            className="w-full max-w-md mx-auto"
          />
          <div>
            <SectionTitle
              center={false}
              eyebrow="Built for Scale"
              title="State-of-the-Art Manufacturing Facility"
              description="Our facility on the Dwarka–Jamnagar Highway houses advanced extrusion technology, automated quality checks and ample storage — enabling us to consistently deliver at scale without compromising on quality."
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card p-6 text-center"
            >
              <p className="text-2xl md:text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-muted mt-1.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <SectionTitle eyebrow="Our Facilities" title="Inside Lotus Agritech" />
        <div className="grid sm:grid-cols-2 gap-6 container-custom !px-0">
          {FACILITIES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card p-6 flex items-start gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-muted">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <ContactCTA />
    </>
  );
};

export default Infrastructure;
