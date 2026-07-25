import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaBriefcase,
  FaCheckCircle,
  FaClock,
  FaFileUpload,
  FaMapMarkerAlt,
  FaTimes,
} from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import Button from '../../components/common/Button.jsx';
import { getCareers } from '../../services/careerService';
import { applyForJob } from '../../services/applicationService';

const ApplyModal = ({ career, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const onSubmit = async (values) => {
    setStatus({ state: 'loading', message: '' });
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('coverLetter', values.coverLetter || '');
      if (career?._id) formData.append('career', career._id);
      if (values.resume?.[0]) formData.append('resume', values.resume[0]);

      await applyForJob(formData);
      setStatus({ state: 'success', message: 'Application submitted successfully! We will get back to you soon.' });
      reset();
    } catch (err) {
      setStatus({
        state: 'error',
        message: err.response?.data?.message || 'Failed to submit application. Please try again.',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-lg text-secondary">Apply for {career?.title}</h3>
          <button onClick={onClose} className="text-muted hover:text-secondary w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100">
            <FaTimes />
          </button>
        </div>

        {status.state === 'success' ? (
          <div className="p-8 text-center">
            <FaCheckCircle className="text-emerald-500 text-5xl mx-auto mb-4" />
            <p className="font-semibold text-secondary mb-2">Application Submitted!</p>
            <p className="text-sm text-muted mb-6">{status.message}</p>
            <button onClick={onClose} className="btn btn-primary">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className="label-field">Full Name *</label>
              <input {...register('name', { required: 'Name is required' })} className="input-field" placeholder="Your full name" />
              {errors.name && <p className="error-text">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label-field">Email *</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="input-field"
                placeholder="you@example.com"
              />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label-field">Phone *</label>
              <input {...register('phone', { required: 'Phone is required' })} className="input-field" placeholder="+91 XXXXX XXXXX" />
              {errors.phone && <p className="error-text">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="label-field">Cover Letter</label>
              <textarea {...register('coverLetter')} rows={3} className="input-field resize-none" placeholder="Tell us why you're a great fit..." />
            </div>
            <div>
              <label className="label-field">Resume (PDF/DOC) *</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex items-center gap-3 hover:border-primary transition-colors">
                <FaFileUpload className="text-primary text-xl shrink-0" />
                <input
                  {...register('resume', { required: 'Resume is required' })}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="text-sm w-full"
                />
              </div>
              {errors.resume && <p className="error-text">{errors.resume.message}</p>}
            </div>
            {status.state === 'error' && <p className="error-text">{status.message}</p>}
            <button type="submit" disabled={status.state === 'loading'} className="btn btn-primary w-full disabled:opacity-60">
              {status.state === 'loading' ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

const Career = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyTo, setApplyTo] = useState(null);

  useEffect(() => {
    getCareers({ limit: 50, isOpen: true })
      .then((res) => setCareers(res.data || []))
      .catch(() => setCareers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO title="Careers" description="Explore current job openings at Lotus Agritech and join our growing PVC & UPVC pipe manufacturing team." />
      <PageHero title="Careers at Lotus Agritech" subtitle="Join a growing team building trusted piping solutions for India." breadcrumb={[{ label: 'Careers' }]} />

      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <LoadingSpinner />
          ) : careers.length ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {careers.map((job, i) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
                  className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-secondary">{job.title}</h3>
                      <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">{job.type}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted mb-3">
                      {job.department && (
                        <span className="flex items-center gap-1.5">
                          <FaBriefcase size={12} /> {job.department}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <FaMapMarkerAlt size={12} /> {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaClock size={12} /> {job.type}
                      </span>
                    </div>
                    <p className="text-secondary/80 text-sm max-w-2xl">{job.description}</p>
                    {job.requirements?.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {job.requirements.map((req) => (
                          <li key={req} className="flex items-start gap-2 text-xs text-muted">
                            <FaCheckCircle className="text-primary mt-0.5 shrink-0" size={11} /> {req}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Button onClick={() => setApplyTo(job)} variant="accent" className="shrink-0">
                    Apply Now
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg font-semibold text-secondary mb-2">No open positions right now</p>
              <p className="text-muted">Check back soon or send us your resume for future opportunities.</p>
              <div className="mt-6">
                <Button onClick={() => setApplyTo({ title: 'General Application' })} variant="outline">
                  Submit General Application
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {applyTo && <ApplyModal career={applyTo} onClose={() => setApplyTo(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Career;
