import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaPlus, FaTrash } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import { submitQuote } from '../../services/quoteService';

const RequestQuote = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      products: [{ productName: '', quantity: '', notes: '' }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'products' });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const onSubmit = async (values) => {
    setStatus({ state: 'loading', message: '' });
    try {
      await submitQuote(values);
      setStatus({ state: 'success', message: 'Your quote request has been submitted. Our team will contact you shortly.' });
      reset();
    } catch (err) {
      setStatus({ state: 'error', message: err.response?.data?.message || 'Failed to submit request. Please try again.' });
    }
  };

  return (
    <>
      <SEO title="Request a Quote" description="Request a custom price quote for PVC & UPVC pipes from Lotus Agritech." />
      <PageHero title="Request a Quote" subtitle="Tell us what you need and we'll get back to you with the best pricing." breadcrumb={[{ label: 'Request a Quote' }]} />

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="card p-6 md:p-10">
            {status.state === 'success' ? (
              <div className="text-center py-12">
                <FaCheckCircle className="text-emerald-500 text-5xl mx-auto mb-4" />
                <p className="font-semibold text-xl text-secondary mb-2">Quote Request Submitted!</p>
                <p className="text-muted">{status.message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
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
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="label-field !mb-0">Products Required</label>
                    <button
                      type="button"
                      onClick={() => append({ productName: '', quantity: '', notes: '' })}
                      className="text-primary text-sm font-semibold flex items-center gap-1.5"
                    >
                      <FaPlus size={11} /> Add Product
                    </button>
                  </div>
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="grid sm:grid-cols-[2fr_1fr_2fr_auto] gap-3 items-start bg-surface p-3 rounded-lg">
                        <input
                          {...register(`products.${index}.productName`)}
                          className="input-field"
                          placeholder="Product name"
                        />
                        <input {...register(`products.${index}.quantity`)} className="input-field" placeholder="Quantity" />
                        <input {...register(`products.${index}.notes`)} className="input-field" placeholder="Notes (optional)" />
                        <button
                          type="button"
                          onClick={() => fields.length > 1 && remove(index)}
                          className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0 hover:bg-red-500 hover:text-white transition-colors"
                          aria-label="Remove product row"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label-field">Additional Message</label>
                  <textarea {...register('message')} rows={4} className="input-field resize-none" placeholder="Any additional details about your requirement..." />
                </div>

                {status.state === 'error' && <p className="error-text">{status.message}</p>}
                <button type="submit" disabled={status.state === 'loading'} className="btn btn-accent w-full disabled:opacity-60">
                  {status.state === 'loading' ? 'Submitting...' : 'Submit Quote Request'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default RequestQuote;
