import { motion } from 'framer-motion';
import { MANUFACTURING_STEPS } from '../../utils/constants';
import manufacturingBg from '../../assets/manufacturing-bg.png';

const ManufacturingFlow = ({ showTitle = false, compact = false }) => {
  return (
    <section className={`relative overflow-hidden ${compact ? 'py-10' : 'section-padding'}`}>
      <img
        src={manufacturingBg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ backgroundColor: 'rgba(250, 251, 252, 0.8)' }}
        aria-hidden
      />

      <div className="container-custom relative z-10">
        {showTitle && (
          <div className="text-center mb-10 md:mb-14">
            <p className="text-primary text-sm font-bold uppercase tracking-widest mb-2">How It&apos;s Made</p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink">Our Manufacturing Process</h2>
            <p className="text-muted mt-3 max-w-2xl mx-auto">
              A precise, quality-controlled journey from raw resin to the finished pipe in your hands.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MANUFACTURING_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative card p-6 pt-10 bg-white/95"
            >
              <span className="absolute -top-5 left-6 w-10 h-10 rounded-xl bg-primary text-white font-bold flex items-center justify-center shadow-lg">
                {step.step}
              </span>
              <h3 className="font-semibold text-ink mb-2 mt-2">{step.title}</h3>
              <p className="text-sm text-muted">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManufacturingFlow;
