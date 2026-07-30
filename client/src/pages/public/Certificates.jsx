import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaAward, FaCertificate } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ContactCTA from '../../components/common/ContactCTA.jsx';
import { getCertificates } from '../../services/certificateService';
import { formatDate, resolveAssetUrl } from '../../utils/format';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCertificates({ limit: 50, isActive: true })
      .then((res) => setCertificates(res.data || []))
      .catch(() => setCertificates([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO title="Certificates" description="View Lotus Agritech's quality certifications and industry compliance credentials." />
      <PageHero title="Certificates & Compliance" subtitle="Our commitment to quality, backed by recognized standards." breadcrumb={[{ label: 'Certificates' }]} />

      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <LoadingSpinner />
          ) : certificates.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert, i) => (
                <motion.div
                  key={cert._id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
                  className="card p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform"
                >
                  <div className="w-full aspect-[4/3] rounded-xl bg-surface flex items-center justify-center mb-5 overflow-hidden">
                    {cert.image ? (
                      <img src={resolveAssetUrl(cert.image)} alt={cert.title} className="w-full h-full object-contain p-4" />
                    ) : (
                      <FaAward className="text-primary text-5xl" />
                    )}
                  </div>
                  <h3 className="font-semibold text-ink mb-1.5">{cert.title}</h3>
                  {cert.issuer && <p className="text-xs text-muted mb-2">Issued by {cert.issuer}</p>}
                  {cert.description && <p className="text-sm text-muted mb-3">{cert.description}</p>}
                  {cert.issuedAt && <p className="text-xs text-muted">{formatDate(cert.issuedAt)}</p>}
                  {cert.fileUrl && (
                    <a
                      href={resolveAssetUrl(cert.fileUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-primary mt-3 flex items-center gap-1.5"
                    >
                      <FaCertificate size={13} /> View Certificate
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-16">Certificates will be published soon.</p>
          )}
        </div>
      </section>

      <ContactCTA />
    </>
  );
};

export default Certificates;
