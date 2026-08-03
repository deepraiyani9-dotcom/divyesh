import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaAward,
  FaBoxes,
  FaCheckCircle,
  FaCogs,
  FaHeadset,
  FaIndustry,
  FaMedal,
  FaPhoneAlt,
  FaRulerCombined,
  FaShieldAlt,
  FaTruck,
} from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import SectionTitle from '../../components/common/SectionTitle.jsx';
import Button from '../../components/common/Button.jsx';
import ProductCard from '../../components/common/ProductCard.jsx';
import BlogCard from '../../components/common/BlogCard.jsx';
import TestimonialCard from '../../components/common/TestimonialCard.jsx';
import ContactCTA from '../../components/common/ContactCTA.jsx';
import GoogleMapEmbed from '../../components/common/GoogleMapEmbed.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import useFetch from '../../hooks/useFetch.js';
import { getProducts } from '../../services/productService';
import { getBlogs } from '../../services/blogService';
import { getTestimonials } from '../../services/testimonialService';
import { getCertificates } from '../../services/certificateService';
import { COMPANY, INDUSTRIES, MANUFACTURING_STEPS, WHY_CHOOSE_US } from '../../utils/constants';
import { resolveAssetUrl } from '../../utils/format';
import heroImg from '../../assets/hero-pvc.png';
import introPipesImg from '../../assets/intro-pipes.png';
import whyChooseBg from '../../assets/why-choose-bg.png';

const ICONS = { FaMedal, FaCogs, FaTruck, FaHeadset };

const STATS = [
  { label: 'Pipe Sizes Available', value: '20–250mm', icon: <FaRulerCombined /> },
  { label: 'Products Delivered', value: '50K+', icon: <FaBoxes /> },
  { label: 'Quality Certified', value: 'ISO 9001', icon: <FaShieldAlt /> },
  { label: 'Manufacturing Lines', value: '12+', icon: <FaIndustry /> },
];

const Home = () => {
  const { data: productsRes, loading: loadingProducts } = useFetch(
    () => getProducts({ isFeatured: true, limit: 6 }),
    []
  );
  const { data: blogsRes, loading: loadingBlogs } = useFetch(() => getBlogs({ limit: 3, isPublished: true }), []);
  const { data: testimonialsRes, loading: loadingTestimonials } = useFetch(
    () => getTestimonials({ limit: 6, isActive: true }),
    []
  );
  const { data: certificatesRes, loading: loadingCertificates } = useFetch(
    () => getCertificates({ limit: 8, isActive: true }),
    []
  );

  const products = productsRes?.data || [];
  const blogs = blogsRes?.data || [];
  const testimonials = testimonialsRes?.data || [];
  const certificates = certificatesRes?.data || [];

  return (
    <>
      <SEO
        title="Home"
        description={`${COMPANY.name} - ${COMPANY.slogan} Premium PVC & UPVC pipe manufacturer in Dwarka, Gujarat.`}
      />

      {/* HERO */}
      <section className="relative bg-brand overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 30%, #0D7377 0%, transparent 45%), radial-gradient(circle at 85% 70%, #E07A3D 0%, transparent 40%)',
          }}
        />
        <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 text-accent text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> PVC & UPVC Pipe Manufacturer
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Building Trust &amp; <span className="text-accent">Steady Flows</span>, One Pipe at a Time.
            </h1>
            <p className="text-slate-100 text-base md:text-lg max-w-xl mb-8">
              {COMPANY.name} engineers premium, durable PVC & UPVC piping solutions for agriculture, plumbing,
              construction and industrial applications — trusted across Gujarat and beyond.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button to="/products" variant="accent" icon={<FaArrowRight />}>
                Explore Products
              </Button>
              <Button href={COMPANY.phoneHref} variant="white" icon={<FaPhoneAlt />}>
                {COMPANY.phoneDisplay}
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-10">
              {['ISO 9001:2015 Certified', 'Lead-Free Material', '24×7 Support'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-slate-100 text-sm">
                  <FaCheckCircle className="text-accent" /> {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl" />
            <img
              src={heroImg}
              alt="Lotus Agritech PVC Pipes"
              className="relative z-10 w-full max-w-lg mx-auto rounded-3xl shadow-2xl shadow-black/25 animate-float object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-white border-b border-slate-100">
        <div className="container-custom py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl mx-auto mb-3">
                {s.icon}
              </div>
              <p className="text-2xl md:text-3xl font-bold text-ink">{s.value}</p>
              <p className="text-xs md:text-sm text-muted mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COMPANY INTRO */}
      <section className="section-padding">
        <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-[#F0F1F3]">
              <img
                src={introPipesImg}
                alt="PVC pipes ready for dispatch"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-primary p-6 text-white flex-1 flex flex-col justify-center">
                <p className="text-3xl font-bold">24×7</p>
                <p className="text-sm text-teal-100 mt-1">Support & Dispatch Ready</p>
              </div>
              <div className="rounded-2xl bg-accent p-6 text-white flex-1 flex flex-col justify-center">
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm text-orange-100 mt-1">Lead-Free Virgin Material</p>
              </div>
            </div>
          </motion.div>

          <div>
            <SectionTitle
              center={false}
              eyebrow="Who We Are"
              title="Gujarat's Trusted PVC & UPVC Pipe Manufacturing Partner"
              description="At Lotus Agritech, we combine advanced extrusion technology with rigorous quality control to deliver piping solutions that stand the test of time — from farm irrigation lines to municipal infrastructure."
            />
            <ul className="space-y-4 mb-8">
              {[
                'Advanced automated extrusion & testing facility',
                'Wide range of diameters and pressure ratings',
                'Consistent, on-time pan-India delivery',
                'Dedicated technical support for dealers & builders',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <FaCheckCircle className="text-primary mt-1 shrink-0" />
                  <span className="text-ink/80">{item}</span>
                </li>
              ))}
            </ul>
            <Button to="/about" variant="accent" icon={<FaArrowRight />}>
              Discover Our Story
            </Button>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-padding relative overflow-hidden">
        <img
          src={whyChooseBg}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ backgroundColor: 'rgba(250, 251, 252, 0.68)' }}
          aria-hidden
        />
        <div className="container-custom relative z-10">
          <SectionTitle
            eyebrow="Why Choose Us"
            title="Engineered for Durability. Trusted for Reliability."
            description="Everything we manufacture is built on a foundation of quality, precision and customer-first service."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card p-6 text-center hover:-translate-y-2 transition-transform bg-white/95 backdrop-blur-[2px]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl mx-auto mb-4">
                    {Icon ? <Icon /> : <FaMedal />}
                  </div>
                  <h3 className="font-semibold text-ink mb-2">{item.title}</h3>
                  <p className="text-sm text-muted">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle
            eyebrow="Our Range"
            title="Featured Products"
            description="Explore our most popular PVC & UPVC pipe solutions, trusted by farmers, builders and dealers alike."
          />
          {loadingProducts ? (
            <LoadingSpinner />
          ) : products.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">Featured products coming soon.</p>
          )}
          <div className="text-center mt-10">
            <Button to="/products" variant="primary" icon={<FaArrowRight />}>
              Explore Full Catalogue
            </Button>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="section-padding bg-brand relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 90% 10%, #0D7377 0%, transparent 45%)',
          }}
        />
        <div className="container-custom relative z-10">
          <SectionTitle
            light
            eyebrow="Industries We Serve"
            title="Piping Solutions Across Every Sector"
            description="From agricultural irrigation to industrial fluid transport — our pipes power critical infrastructure."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {INDUSTRIES.map((ind, i) => (
              <motion.div
                key={ind.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: 'easeOut' }}
                className={`bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all lg:col-span-2 ${
                  i === 3 ? 'lg:col-start-2' : ''
                } ${i >= 3 ? 'sm:col-span-1' : ''}`}
              >
                <h3 className="font-semibold text-ink mb-2">{ind.title}</h3>
                <p className="text-sm text-slate-600">{ind.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button to="/industries" variant="white" icon={<FaArrowRight />}>
              Explore Industries
            </Button>
          </div>
        </div>
      </section>

      {/* MANUFACTURING PROCESS */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle
            eyebrow="How It's Made"
            title="Our Manufacturing Process"
            description="A precise, quality-controlled journey from raw resin to the finished pipe in your hands."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MANUFACTURING_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative card p-6 pt-10"
              >
                <span className="absolute -top-5 left-6 w-10 h-10 rounded-xl bg-primary text-white font-bold flex items-center justify-center shadow-lg">
                  {step.step}
                </span>
                <h3 className="font-semibold text-ink mb-2 mt-2">{step.title}</h3>
                <p className="text-sm text-muted">{step.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button to="/manufacturing-process" variant="primary" icon={<FaArrowRight />}>
              See How We Manufacture
            </Button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle
            eyebrow="Client Stories"
            title="What Our Clients Say"
            description="Real feedback from the farmers, dealers and builders we serve every day."
          />
          {loadingTestimonials ? (
            <LoadingSpinner />
          ) : testimonials.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((t, i) => (
                <TestimonialCard key={t._id} testimonial={t} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">Testimonials coming soon.</p>
          )}
        </div>
      </section>

      {/* CERTIFICATES */}
      {!loadingCertificates && certificates.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <SectionTitle
              eyebrow="Quality Assured"
              title="Certifications & Standards"
              description="Our commitment to quality is backed by recognized industry certifications."
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {certificates.slice(0, 8).map((cert, i) => (
                <motion.div
                  key={cert._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="card p-5 text-center flex flex-col items-center gap-3"
                >
                  {cert.image ? (
                    <img src={resolveAssetUrl(cert.image)} alt={cert.title} className="h-16 object-contain" />
                  ) : (
                    <FaAward className="text-primary text-3xl" />
                  )}
                  <p className="text-sm font-semibold text-ink">{cert.title}</p>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button to="/certificates" variant="accent" icon={<FaArrowRight />}>
                View All Certificates
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* LATEST BLOGS */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle
            eyebrow="Resources"
            title="Latest From Our Blog"
            description="Tips, guides and industry insights on PVC & UPVC piping solutions."
          />
          {loadingBlogs ? (
            <LoadingSpinner />
          ) : blogs.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((b, i) => (
                <BlogCard key={b._id} blog={b} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">Articles coming soon.</p>
          )}
          <div className="text-center mt-10">
            <Button to="/blog" variant="accent" icon={<FaArrowRight />}>
              Read Latest Articles
            </Button>
          </div>
        </div>
      </section>

      <ContactCTA />

      {/* MAP */}
      <section className="section-padding bg-secondary">
        <div className="container-custom grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionTitle center={false} eyebrow="Visit Us" title="Find Our Manufacturing Unit" />
            <p className="text-muted mb-6">{COMPANY.address}</p>
            <div className="flex flex-col gap-3">
              <Button
                href={COMPANY.mapLink}
                target="_blank"
                rel="noreferrer"
                variant="primary"
                icon={<FaArrowRight />}
              >
                Get Directions & Contact Info
              </Button>
            </div>
          </div>
          <GoogleMapEmbed height={360} />
        </div>
      </section>
    </>
  );
};

export default Home;
