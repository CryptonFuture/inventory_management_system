import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  Package,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../css/Register.css'

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(
        form.name,
        form.email,
        form.password,
        form.role
      );

      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Effects */}
      <div className="login-bg-glow login-bg-glow-one" />
      <div className="login-bg-glow login-bg-glow-two" />

      <div className="login-card register-card">

        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <Package size={27} strokeWidth={2.2} />
          </div>

          <div>
            <h1>Inventory</h1>
            <span>Management System</span>
          </div>
        </div>

        {/* Header */}
        <div className="login-header">
          <h2>Create your account</h2>
          <p>
            Register to start managing your inventory
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name">
              Full Name
            </label>

            <div className="input-wrapper">
              <User
                size={18}
                className="input-icon"
              />

              <input
                id="name"
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <div className="input-wrapper">
              <Mail
                size={18}
                className="input-icon"
              />

              <input
                id="email"
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="password-label">
              <label htmlFor="password">
                Password
              </label>

              <span className="secure-label">
                <ShieldCheck size={14} />
                Secure
              </span>
            </div>

            <div className="input-wrapper">
              <Lock
                size={18}
                className="input-icon"
              />

              <input
                id="password"
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role">
              Account Role
            </label>

            <div className="input-wrapper">
              <ShieldCheck
                size={18}
                className="input-icon"
              />

              <select
                id="role"
                name="role"
                className="form-control role-select"
                value={form.role}
                onChange={handleChange}
              >
                <option value="staff">
                  Staff
                </option>

                <option value="manager">
                  Manager
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>
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
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Login */}
        <div className="login-register">
          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Sign in
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Security Info */}
        <div className="demo-box register-security">
          <div className="demo-icon">
            <ShieldCheck size={17} />
          </div>

          <div>
            <span>Secure Registration</span>
            <strong>Your account is protected</strong>
            <small>
              Your credentials are securely handled
            </small>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <span>
            © {new Date().getFullYear()} Inventory System
          </span>

          <span className="footer-dot">
            •
          </span>

          <span>
            Secure Access
          </span>
        </div>

      </div>
    </div>
  );
};

export default Register;

