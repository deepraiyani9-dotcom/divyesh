import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { COMPANY } from '../../utils/constants';
import * as authService from '../../services/authService';
import logo from '../../assets/logo.png';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login'); // login | forgot
  const [forgotMsg, setForgotMsg] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: { email: 'admin@lotusagritech.com', password: '' } });

  if (!loading && isAuthenticated && mode === 'login') {
    const from = location.state?.from?.pathname || '/admin/dashboard';
    return <Navigate to={from} replace />;
  }

  const onLogin = async (values) => {
    setSubmitting(true);
    setError('');
    const res = await login(values);
    setSubmitting(false);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.message);
    }
  };

  const onForgot = async () => {
    const email = getValues('email');
    if (!email) {
      setError('Enter your admin email first.');
      return;
    }
    setSubmitting(true);
    setError('');
    setForgotMsg('');
    setResetUrl('');
    try {
      const res = await authService.forgotPassword({ email });
      setForgotMsg(res.message);
      if (res.resetUrl) setResetUrl(res.resetUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send reset link.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login" description="Lotus Agritech admin panel login." />
      <div className="min-h-screen flex items-center justify-center bg-brand relative overflow-hidden px-4">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #0D7377 0%, transparent 45%), radial-gradient(circle at 80% 80%, #E07A3D 0%, transparent 40%)',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-10 relative z-10"
        >
          <div className="text-center mb-8">
            <img
              src={logo}
              alt={COMPANY.name}
              className="h-16 w-16 object-contain rounded-full mx-auto mb-4"
            />
            <h1 className="text-xl font-bold text-ink">{COMPANY.name} Admin</h1>
            <p className="text-sm text-muted mt-1">
              {mode === 'login' ? 'Sign in to manage your website' : 'Reset your admin password'}
            </p>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleSubmit(onLogin)} className="space-y-5">
              <div>
                <label className="label-field">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm" />
                  <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    className="input-field pl-10"
                    placeholder="admin@lotusagritech.com"
                  />
                </div>
                {errors.email && <p className="error-text">{errors.email.message}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label-field mb-0">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setForgotMsg('');
                    }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm" />
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="error-text">{errors.password.message}</p>}
              </div>
              {error && <p className="error-text text-center">{error}</p>}
              <button type="submit" disabled={submitting} className="btn btn-primary w-full disabled:opacity-60">
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <p className="text-sm text-muted">
                Enter your admin email and we’ll send a reset link. Without SMTP configured, a local reset link will
                appear below.
              </p>
              <div>
                <label className="label-field">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm" />
                  <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    className="input-field pl-10"
                    placeholder="admin@lotusagritech.com"
                  />
                </div>
              </div>
              {error && <p className="error-text text-center">{error}</p>}
              {forgotMsg && <p className="text-sm text-emerald-600 text-center font-medium">{forgotMsg}</p>}
              {resetUrl && (
                <div className="bg-surface rounded-xl p-3 text-xs break-all">
                  <p className="font-semibold text-ink mb-1">Dev reset link:</p>
                  <a href={resetUrl} className="text-primary font-medium underline">
                    Open reset page
                  </a>
                  <p className="text-muted mt-2">{resetUrl}</p>
                </div>
              )}
              <button
                type="button"
                onClick={onForgot}
                disabled={submitting}
                className="btn btn-primary w-full disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Send reset link'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setForgotMsg('');
                  setResetUrl('');
                }}
                className="w-full text-sm font-semibold text-muted hover:text-primary"
              >
                Back to sign in
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Login;
