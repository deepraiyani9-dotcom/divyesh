import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaFileDownload, FaFilePdf } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { getSettings } from '../../services/settingsService';
import { subscribeNewsletter } from '../../services/subscribeService';
import { resolveAssetUrl } from '../../utils/format';

const DownloadBrochure = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  useEffect(() => {
    getSettings()
      .then((res) => setSettings(res.data))
      .catch(() => setSettings(null))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (values) => {
    setStatus({ state: 'loading', message: '' });
    try {
      await subscribeNewsletter(values.email);
      setStatus({ state: 'success', message: 'Thank you! Your download will begin shortly.' });
      if (settings?.brochureUrl) {
        setTimeout(() => {
          window.open(resolveAssetUrl(settings.brochureUrl), '_blank');
        }, 600);
      }
    } catch (err) {
      setStatus({ state: 'error', message: err.response?.data?.message || 'Something went wrong. Please try again.' });
    }
  };

  return (
    <>
      <SEO title="Download Brochure" description="Download the Lotus Agritech product catalogue and company brochure." />
      <PageHero title="Download Brochure" subtitle="Get our complete product catalogue with specifications and pricing details." breadcrumb={[{ label: 'Download Brochure' }]} />

      <section className="section-padding">
        <div className="container-custom max-w-lg">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="card p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl mx-auto mb-5">
                <FaFilePdf />
              </div>
              <h3 className="font-bold text-xl text-secondary mb-2">Lotus Agritech Product Catalogue</h3>
              <p className="text-muted mb-6">
                Enter your email to access our full product brochure with specifications, pressure ratings and pricing.
              </p>

              {status.state === 'success' ? (
                <div className="py-4">
                  <FaCheckCircle className="text-emerald-500 text-4xl mx-auto mb-3" />
                  <p className="text-secondary font-medium">{status.message}</p>
                  {settings?.brochureUrl && (
                    <a
                      href={resolveAssetUrl(settings.brochureUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary mt-5"
                    >
                      <FaFileDownload /> Download Now
                    </a>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                  <div>
                    <label className="label-field">Email Address *</label>
                    <input
                      {...register('email', { required: 'Email is required' })}
                      type="email"
                      className="input-field"
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="error-text">{errors.email.message}</p>}
                  </div>
                  {status.state === 'error' && <p className="error-text">{status.message}</p>}
                  <button type="submit" disabled={status.state === 'loading'} className="btn btn-accent w-full disabled:opacity-60">
                    <FaFileDownload /> {status.state === 'loading' ? 'Processing...' : 'Get Brochure'}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default DownloadBrochure;
