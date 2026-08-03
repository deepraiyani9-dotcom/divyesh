import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import * as authService from '../../services/authService';
import { COMPANY } from '../../utils/constants';
import logo from '../../assets/logo.png';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await authService.resetPassword(token, { password: values.password });
      if (res.token) localStorage.setItem('lotus_token', res.token);
      if (res.user) {
        localStorage.setItem('lotus_user', JSON.stringify(res.user));
        updateUser(res.user);
      }
      setSuccess('Password updated. Redirecting to dashboard...');
      setTimeout(() => navigate('/admin/dashboard'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Reset Password" description="Reset Lotus Agritech admin password." />
      <div className="min-h-screen flex items-center justify-center bg-brand px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-10"
        >
          <div className="text-center mb-8">
            <img src={logo} alt={COMPANY.name} className="h-14 w-14 object-contain rounded-full mx-auto mb-3" />
            <h1 className="text-xl font-bold text-ink">Set new password</h1>
            <p className="text-sm text-muted mt-1">Choose a strong password for your admin account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label-field">New password</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm" />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  placeholder="New password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>
            <div>
              <label className="label-field">Confirm password</label>
              <input
                {...register('confirm', {
                  required: 'Please confirm password',
                  validate: (v) => v === watch('password') || 'Passwords do not match',
                })}
                type="password"
                className="input-field"
                placeholder="Confirm password"
              />
              {errors.confirm && <p className="error-text">{errors.confirm.message}</p>}
            </div>
            {error && <p className="error-text text-center">{error}</p>}
            {success && <p className="text-sm text-emerald-600 text-center font-medium">{success}</p>}
            <button type="submit" disabled={submitting} className="btn btn-primary w-full disabled:opacity-60">
              {submitting ? 'Updating...' : 'Update password'}
            </button>
            <Link to="/admin/login" className="block text-center text-sm font-semibold text-muted hover:text-primary">
              Back to login
            </Link>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default ResetPassword;
