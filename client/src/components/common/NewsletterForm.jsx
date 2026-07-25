import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { subscribeNewsletter } from '../../services/subscribeService';

const NewsletterForm = ({ dark = false }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus({ state: 'loading', message: '' });
    try {
      await subscribeNewsletter(email);
      setStatus({ state: 'success', message: 'Subscribed successfully! Thank you.' });
      setEmail('');
    } catch (err) {
      setStatus({
        state: 'error',
        message: err.response?.data?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`flex-1 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent ${
            dark ? 'bg-white/10 text-white placeholder:text-slate-400 border border-white/10' : 'input-field'
          }`}
        />
        <button
          type="submit"
          disabled={status.state === 'loading'}
          className="btn btn-accent shrink-0 disabled:opacity-60"
        >
          {status.state === 'loading' ? 'Sending...' : 'Subscribe'} <FaPaperPlane size={12} />
        </button>
      </div>
      {status.message && (
        <p className={`text-xs mt-2 ${status.state === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
          {status.message}
        </p>
      )}
    </form>
  );
};

export default NewsletterForm;
