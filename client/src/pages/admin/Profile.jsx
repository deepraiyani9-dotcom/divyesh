import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheckCircle, FaKey, FaSave, FaUserCircle } from 'react-icons/fa';
import PageHeader from '../../components/admin/PageHeader.jsx';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import * as authService from '../../services/authService';
import { resolveAssetUrl } from '../../utils/format';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [error, setError] = useState('');
  const [pwdError, setPwdError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const {
    register: registerPwd,
    handleSubmit: handlePwdSubmit,
    reset: resetPwd,
    watch,
    formState: { errors: pwdErrors },
  } = useForm();

  const onSubmit = async (values) => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const res = await authService.updateProfile({
        name: values.name,
        phone: values.phone,
        avatar,
      });
      updateUser(res.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (values) => {
    setPwdSaving(true);
    setPwdSaved(false);
    setPwdError('');
    try {
      await authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      resetPwd();
      setPwdSaved(true);
      setTimeout(() => setPwdSaved(false), 3000);
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="My Profile" description="Manage your admin account details and password." />

      <form onSubmit={handleSubmit(onSubmit)} className="admin-card p-6 md:p-8 max-w-2xl mb-6">
        <div className="flex items-center gap-4 mb-6">
          {avatar ? (
            <img src={resolveAssetUrl(avatar)} alt={user?.name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl">
              <FaUserCircle />
            </div>
          )}
          <div>
            <p className="font-semibold text-ink">{user?.name}</p>
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

      <form onSubmit={handlePwdSubmit(onChangePassword)} className="admin-card p-6 md:p-8 max-w-2xl">
        <h3 className="font-semibold text-ink mb-1 flex items-center gap-2">
          <FaKey className="text-primary" /> Change Password
        </h3>
        <p className="text-sm text-muted mb-5">Enter your current password, then choose a new one.</p>

        <div className="space-y-4 mb-5">
          <div>
            <label className="label-field">Current password</label>
            <input
              {...registerPwd('currentPassword', { required: 'Current password is required' })}
              type="password"
              className="input-field"
              placeholder="Current password"
            />
            {pwdErrors.currentPassword && (
              <p className="error-text">{pwdErrors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <label className="label-field">New password</label>
            <input
              {...registerPwd('newPassword', {
                required: 'New password is required',
                minLength: { value: 6, message: 'At least 6 characters' },
              })}
              type="password"
              className="input-field"
              placeholder="New password"
            />
            {pwdErrors.newPassword && <p className="error-text">{pwdErrors.newPassword.message}</p>}
          </div>
          <div>
            <label className="label-field">Confirm new password</label>
            <input
              {...registerPwd('confirmPassword', {
                required: 'Please confirm new password',
                validate: (v) => v === watch('newPassword') || 'Passwords do not match',
              })}
              type="password"
              className="input-field"
              placeholder="Confirm new password"
            />
            {pwdErrors.confirmPassword && (
              <p className="error-text">{pwdErrors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {pwdError && <p className="error-text mb-4">{pwdError}</p>}
        {pwdSaved && (
          <p className="text-emerald-600 text-sm mb-4 flex items-center gap-2">
            <FaCheckCircle /> Password changed successfully.
          </p>
        )}

        <button type="submit" disabled={pwdSaving} className="btn btn-accent disabled:opacity-60">
          <FaKey /> {pwdSaving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
