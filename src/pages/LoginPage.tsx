import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, Eye, EyeOff, Wrench, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState<'email' | 'mobile'>('email');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (loginType === 'email') {
      if (!emailOrMobile) errs.emailOrMobile = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile))
        errs.emailOrMobile = 'Enter a valid email address';
    } else {
      if (!emailOrMobile) errs.emailOrMobile = 'Mobile number is required';
      else if (!/^[0-9]{10}$/.test(emailOrMobile.replace(/\D/g, '')))
        errs.emailOrMobile = 'Enter a valid 10-digit mobile number';
    }
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const email = loginType === 'email' ? emailOrMobile : `${emailOrMobile}@servicehub.com`;
      login(email, password);
      showToast('success', 'Welcome back! Login successful.');
      navigate('/');
      setLoading(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Login to book and manage your services</p>
        </div>

        <div className="card p-6 md:p-8">
          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setLoginType('email')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                loginType === 'email' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginType('mobile')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                loginType === 'mobile' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              Mobile
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {loginType === 'email' ? 'Email Address' : 'Mobile Number'}
              </label>
              <div className="relative">
                {loginType === 'email' ? (
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                ) : (
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                )}
                <input
                  type={loginType === 'email' ? 'email' : 'tel'}
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  placeholder={loginType === 'email' ? 'you@example.com' : '9876543210'}
                  className={`input-field pl-11 ${errors.emailOrMobile ? 'border-error-400 focus:ring-error-500/30 focus:border-error-500' : ''}`}
                />
              </div>
              {errors.emailOrMobile && <p className="text-xs text-error-500 mt-1">{errors.emailOrMobile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`input-field pl-11 pr-11 ${errors.password ? 'border-error-400 focus:ring-error-500/30 focus:border-error-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-error-500 mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? 'Logging in...' : 'Login'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
