import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheckCircle, FaSave } from 'react-icons/fa';
import PageHeader from '../../components/admin/PageHeader.jsx';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { getSettings, updateSettings } from '../../services/settingsService';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [brochureUrl, setBrochureUrl] = useState('');
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    getSettings()
      .then((res) => {
        reset(res.data);
        setBrochureUrl(res.data.brochureUrl || '');
      })
      .catch(() => setError('Failed to load settings.'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values) => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await updateSettings({ ...values, brochureUrl });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Website Settings" description="Manage global company information displayed across your website." />
      <form onSubmit={handleSubmit(onSubmit)} className="admin-card p-6 md:p-8 max-w-3xl">
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="label-field">Company Name</label>
            <input {...register('companyName')} className="input-field" />
          </div>
          <div>
            <label className="label-field">Phone</label>
            <input {...register('phone')} className="input-field" />
          </div>
          <div>
            <label className="label-field">Email</label>
            <input {...register('email')} type="email" className="input-field" />
          </div>
          <div>
            <label className="label-field">Operational Hours</label>
            <input {...register('operationalHours')} className="input-field" />
          </div>
        </div>

        <div className="mb-5">
          <label className="label-field">Tagline / Slogan</label>
          <input {...register('tagline')} className="input-field" />
        </div>

        <div className="mb-5">
          <label className="label-field">Address</label>
          <textarea {...register('address')} rows={3} className="input-field resize-none" />
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-5">
          <div>
            <label className="label-field">Instagram URL</label>
            <input {...register('social.instagram')} className="input-field" />
          </div>
          <div>
            <label className="label-field">Facebook URL</label>
            <input {...register('social.facebook')} className="input-field" />
          </div>
          <div>
            <label className="label-field">LinkedIn URL</label>
            <input {...register('social.linkedin')} className="input-field" />
          </div>
        </div>

        <div className="mb-6">
          <label className="label-field">Brochure PDF</label>
          <ImageUploader value={brochureUrl} onChange={setBrochureUrl} />
        </div>

        {error && <p className="error-text mb-4">{error}</p>}
        {saved && (
          <p className="text-emerald-600 text-sm mb-4 flex items-center gap-2">
            <FaCheckCircle /> Settings saved successfully.
          </p>
        )}

        <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
          <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default Settings;
