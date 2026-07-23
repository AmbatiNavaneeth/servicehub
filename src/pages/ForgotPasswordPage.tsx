import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Wrench, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      showToast('info', 'Password reset link sent to your email.');
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-gray-50 to-primary-50/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-gray-900">
              Service<span className="text-primary-600">Hub</span>
            </span>
          </Link>
        </div>

        <div className="card p-6 md:p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-sm text-gray-500 mb-6">
                We've sent a password reset link to <span className="font-semibold text-gray-700">{email}</span>. Please check your inbox and follow the instructions.
              </p>
              <button onClick={() => navigate('/login')} className="btn-primary w-full py-3">
                Back to Login
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-4">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
              <p className="text-sm text-gray-500 mb-6">Enter your email and we'll send you a link to reset your password.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`input-field pl-11 ${error ? 'border-error-400' : ''}`}
                    />
                  </div>
                  {error && <p className="text-xs text-error-500 mt-1">{error}</p>}
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
