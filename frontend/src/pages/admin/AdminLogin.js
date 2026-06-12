import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, formatApiErrorDetail } from '../../contexts/AuthContext';
import { Lock, User } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(credentials.email, credentials.password);
    
    if (result.success) {
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } else {
      toast.error(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-8">
          <div className="text-center mb-8">
            <div className="bg-[#0A192F] w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-bold text-[#0A192F] heading-font mb-2">
              Admin Login
            </h2>
            <p className="text-gray-600 body-font">Access the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-login-form">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 body-font mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  data-testid="admin-email-input"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                  className="w-full pl-10 px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0A192F] focus:border-transparent body-font"
                  placeholder="admin@brilliantgrammar.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 body-font mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  data-testid="admin-password-input"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                  className="w-full pl-10 px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0A192F] focus:border-transparent body-font"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              data-testid="admin-login-btn"
              disabled={loading}
              className="w-full bg-[#0A192F] text-white px-8 py-4 font-semibold transition-all duration-300 hover:bg-[#1E293B] btn-primary body-font disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-[#0A192F] body-font">
              ← Back to Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
