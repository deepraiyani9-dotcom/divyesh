import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaEnvelope, FaInstagram, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import GoogleMapEmbed from '../../components/common/GoogleMapEmbed.jsx';
import { submitContact } from '../../services/contactService';
import { COMPANY } from '../../utils/constants';

const Contact = () => {
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
      await submitContact(values);
      setStatus({ state: 'success', message: 'Thank you! Your message has been sent successfully.' });
      reset();
    } catch (err) {
      setStatus({ state: 'error', message: err.response?.data?.message || 'Failed to send message. Please try again.' });
    }
  };

  const infoItems = [
    { icon: <FaPhoneAlt />, label: 'Call Us', value: COMPANY.phoneDisplay, href: COMPANY.phoneHref },
    { icon: <FaEnvelope />, label: 'Email Us', value: COMPANY.email, href: `mailto:${COMPANY.email}` },
    { icon: <FaMapMarkerAlt />, label: 'Visit Us', value: COMPANY.address, href: COMPANY.mapLink },
    { icon: <FaClock />, label: 'Working Hours', value: COMPANY.hours },
    { icon: <FaInstagram />, label: 'Instagram', value: '@lotusagritech_dwarka', href: COMPANY.instagram },
  ];

  return (
    <>
      <SEO title="Contact Us" description="Get in touch with Lotus Agritech for enquiries, bulk orders and technical support." />
      <PageHero title="Contact Us" subtitle="We'd love to hear from you. Reach out for enquiries, pricing or support." breadcrumb={[{ label: 'Contact' }]} />

      <section className="section-padding">
        <div className="container-custom grid lg:grid-cols-[1fr_1.3fr] gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="card p-6 md:p-8 mb-6">
              <h3 className="font-semibold text-lg text-ink mb-5">Get in Touch</h3>
              <div className="space-y-5">
                {infoItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-xs text-muted font-semibold uppercase tracking-wide">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="text-ink font-medium hover:text-primary transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-ink font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <GoogleMapEmbed height={280} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card p-6 md:p-8"
          >
            <h3 className="font-semibold text-lg text-ink mb-1">Send Us a Message</h3>
            <p className="text-sm text-muted mb-6">Fill out the form below and our team will get back to you within 24 hours.</p>

            {status.state === 'success' ? (
              <div className="text-center py-12">
                <FaCheckCircle className="text-emerald-500 text-5xl mx-auto mb-4" />
                <p className="font-semibold text-ink mb-2">Message Sent!</p>
                <p className="text-sm text-muted">{status.message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-field">Full Name *</label>
                  <input {...register('name', { required: 'Name is required' })} className="input-field" placeholder="John Doe" />
                  {errors.name && <p className="error-text">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label-field">Company Name</label>
                  <input {...register('companyName')} className="input-field" placeholder="Your company" />
                </div>
                <div>
                  <label className="label-field">Phone *</label>
                  <input {...register('phone', { required: 'Phone is required' })} className="input-field" placeholder="+91 XXXXX XXXXX" />
                  {errors.phone && <p className="error-text">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="label-field">Email *</label>
                  <input {...register('email', { required: 'Email is required' })} type="email" className="input-field" placeholder="you@example.com" />
                  {errors.email && <p className="error-text">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="label-field">State</label>
                  <input {...register('state')} className="input-field" placeholder="Gujarat" />
                </div>
                <div>
                  <label className="label-field">City</label>
                  <input {...register('city')} className="input-field" placeholder="Dwarka" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-field">Product Interested In</label>
                  <input {...register('productInterested')} className="input-field" placeholder="e.g. UPVC Agricultural Pipe" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-field">Quantity</label>
                  <input {...register('quantity')} className="input-field" placeholder="e.g. 500 units" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-field">Message *</label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Tell us about your requirement..."
                  />
                  {errors.message && <p className="error-text">{errors.message.message}</p>}
                </div>
                {status.state === 'error' && <p className="error-text sm:col-span-2">{status.message}</p>}
                <button type="submit" disabled={status.state === 'loading'} className="btn btn-primary sm:col-span-2 disabled:opacity-60">
                  {status.state === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Contact;
