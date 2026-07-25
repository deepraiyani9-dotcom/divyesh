import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheckCircle, FaSave, FaUserCircle } from 'react-icons/fa';
import PageHeader from '../../components/admin/PageHeader.jsx';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import * as authService from '../../services/authService';
import { resolveAssetUrl } from '../../utils/format';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const payload = { name: values.name, phone: values.phone, avatar };
      if (values.password) payload.password = values.password;
      const res = await authService.updateProfile(payload);
      updateUser(res.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="My Profile" description="Manage your admin account details." />
      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 md:p-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          {avatar ? (
            <img src={resolveAssetUrl(avatar)} alt={user?.name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl">
              <FaUserCircle />
            </div>
          )}
          <div>
            <p className="font-semibold text-secondary">{user?.name}</p>
            <p className="text-sm text-muted capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="mb-5">
          <label className="label-field">Profile Photo</label>
          <ImageUploader value={avatar} onChange={setAvatar} />
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="label-field">Full Name</label>
            <input {...register('name', { required: 'Name is required' })} className="input-field" />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label-field">Phone</label>
            <input {...register('phone')} className="input-field" />
          </div>
        </div>

        <div className="mb-6">
          <label className="label-field">New Password</label>
          <input {...register('password')} type="password" className="input-field" placeholder="Leave blank to keep current password" />
        </div>

        {error && <p className="error-text mb-4">{error}</p>}
        {saved && (
          <p className="text-emerald-600 text-sm mb-4 flex items-center gap-2">
            <FaCheckCircle /> Profile updated successfully.
          </p>
        )}

        <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
          <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
