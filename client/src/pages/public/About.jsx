import { motion } from 'framer-motion';
import { FaBullseye, FaCheckCircle, FaEye, FaHandshake, FaLeaf, FaShieldAlt } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import SectionTitle from '../../components/common/SectionTitle.jsx';
import ContactCTA from '../../components/common/ContactCTA.jsx';
import { COMPANY } from '../../utils/constants';
import heroImg from '../../assets/hero.png';

const VALUES = [
  { title: 'Integrity', icon: <FaShieldAlt />, description: 'We operate with complete transparency and honesty in every business relationship.' },
  { title: 'Quality First', icon: <FaCheckCircle />, description: 'Every pipe undergoes stringent quality checks before it reaches our customers.' },
  { title: 'Sustainability', icon: <FaLeaf />, description: 'We manufacture responsibly, minimizing waste and environmental impact.' },
  { title: 'Customer Trust', icon: <FaHandshake />, description: 'Long-term relationships built on reliability, consistency and support.' },
];

const About = () => {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Lotus Agritech's journey, mission and commitment to manufacturing premium PVC & UPVC pipes."
      />
      <PageHero title="About Lotus Agritech" subtitle={COMPANY.slogan} breadcrumb={[{ label: 'About' }]} />

      <section className="section-padding">
        <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
          <motion.img
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            src={heroImg}
            alt="Lotus Agritech factory"
            className="w-full max-w-md mx-auto"
          />
          <div>
            <SectionTitle
              center={false}
              eyebrow="Our Story"
              title="Manufacturing Reliable Piping Solutions Since 2010"
              description={`${COMPANY.name} was founded with a simple mission: to deliver durable, dependable PVC & UPVC pipes that farmers, builders and industries can rely on for decades. What began as a modest manufacturing unit has grown into a trusted regional brand known for consistency and craftsmanship.`}
            />
            <p className="text-ink/80 leading-relaxed">
              Located on the Dwarka–Jamnagar Highway, our state-of-the-art facility combines automated extrusion
              technology with a dedicated quality assurance lab, ensuring every pipe that leaves our factory meets
              the highest industry standards.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-custom grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card p-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl mb-5">
              <FaBullseye />
            </div>
            <h3 className="text-xl font-bold text-ink mb-3">Our Mission</h3>
            <p className="text-muted leading-relaxed">
              To manufacture high-quality, durable PVC & UPVC piping solutions that empower agriculture, construction
              and industry — while building lasting trust through consistency, innovation and customer-first service.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card p-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center text-2xl mb-5">
              <FaEye />
            </div>
            <h3 className="text-xl font-bold text-ink mb-3">Our Vision</h3>
            <p className="text-muted leading-relaxed">
              To become India's most trusted name in PVC & UPVC pipe manufacturing, recognized for engineering
              excellence, sustainable practices and unwavering commitment to customer satisfaction.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle eyebrow="What Drives Us" title="Our Core Values" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card p-6 text-center hover:-translate-y-2 transition-transform"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl mx-auto mb-4">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-ink mb-2">{v.title}</h3>
                <p className="text-sm text-muted">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
};

export default About;
