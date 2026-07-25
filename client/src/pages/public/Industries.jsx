import { motion } from 'framer-motion';
import {
  FaBolt,
  FaBuilding,
  FaCity,
  FaHome,
  FaIndustry,
  FaCheckCircle,
} from 'react-icons/fa';
import { GiWheat } from 'react-icons/gi';
import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import ContactCTA from '../../components/common/ContactCTA.jsx';
import Button from '../../components/common/Button.jsx';
import { INDUSTRIES } from '../../utils/constants';

const ICONS = { GiWheat, FaHome, FaBuilding, FaIndustry, FaCity, FaBolt };

const Industries = () => {
  return (
    <>
      <SEO title="Industries We Serve" description="Discover the industries powered by Lotus Agritech PVC & UPVC pipes — agriculture, plumbing, construction, industrial and more." />
      <PageHero
        title="Industries We Serve"
        subtitle="Versatile piping solutions engineered for the unique demands of every sector."
        breadcrumb={[{ label: 'Industries' }]}
      />

      <section className="section-padding">
        <div className="container-custom space-y-10">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ICONS[ind.icon] || FaIndustry;
            const reversed = i % 2 === 1;
            return (
              <motion.div
                key={ind.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className={`card p-8 md:p-10 flex flex-col md:flex-row ${reversed ? 'md:flex-row-reverse' : ''} items-center gap-8`}
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-primary/10 text-primary flex items-center justify-center text-4xl md:text-5xl shrink-0">
                  <Icon />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-secondary mb-3">{ind.title}</h3>
                  <p className="text-muted leading-relaxed mb-4">{ind.description}</p>
                  <ul className="flex flex-wrap gap-3">
                    {['Durable', 'Cost-effective', 'Certified Quality'].map((tag) => (
                      <li key={tag} className="flex items-center gap-1.5 text-sm font-medium text-secondary/70">
                        <FaCheckCircle className="text-primary" size={12} /> {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="container-custom text-center mt-14">
          <Button to="/products">Explore Our Products</Button>
        </div>
      </section>

      <ContactCTA />
    </>
  );
};

export default Industries;
