
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import '../css/Login.css'

const Login = () => {
  const [email, setEmail] = useState('admin@inventory.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Effects */}
      <div className="login-bg-glow login-bg-glow-one" />
      <div className="login-bg-glow login-bg-glow-two" />

      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <Package size={28} strokeWidth={2.2} />
          </div>

          <div>
            <h1>Inventory</h1>
            <span>Management System</span>
          </div>
        </div>

        {/* Header */}
        <div className="login-header">
          <h2>Welcome back 👋</h2>
          <p>Sign in to continue to your dashboard</p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />

              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@inventory.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="password-label">
              <label htmlFor="password">Password</label>

              <span className="secure-label">
                <ShieldCheck size={14} />
                Secure
              </span>
            </div>

            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />

              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-spinner" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Register */}
        <div className="login-register">
          <span>Don't have an account?</span>

          <Link to="/register">
            Create an account
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Demo */}
        <div className="demo-box">
          <div className="demo-icon">
            <ShieldCheck size={17} />
          </div>

          <div>
            <span>Demo Account</span>
            <strong>admin@inventory.com</strong>
            <small>Password: admin123</small>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <span>© {new Date().getFullYear()} Inventory System</span>
          <span className="footer-dot">•</span>
          <span>Secure Access</span>
        </div>

      </div>
    </div>
  );
};

export default Login;



