import { useEffect, useState } from 'react';
import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import TestimonialCard from '../../components/common/TestimonialCard.jsx';
import ContactCTA from '../../components/common/ContactCTA.jsx';
import { getTestimonials } from '../../services/testimonialService';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials({ limit: 100, isActive: true })
      .then((res) => setTestimonials(res.data || []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO title="Testimonials" description="Read what our clients say about Lotus Agritech's PVC & UPVC pipes and service." />
      <PageHero title="Client Testimonials" subtitle="Real stories from the farmers, dealers and builders we serve." breadcrumb={[{ label: 'Testimonials' }]} />

      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <LoadingSpinner />
          ) : testimonials.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <TestimonialCard key={t._id} testimonial={t} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-16">No testimonials available yet.</p>
          )}
        </div>
      </section>

      <ContactCTA />
    </>
  );
};

export default Testimonials;
