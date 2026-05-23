import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', password: '', role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-form-wrap">
          <div className="auth-logo">
            <div className="logo-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
            </div>
            <span className="logo-text">MelodyHub</span>
          </div>

          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">
            Join MelodyHub — listen as a fan or share your music as an artist.
          </p>

          {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                name="username" type="text" placeholder="coolartist99"
                value={form.username} onChange={handleChange} required autoFocus
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                name="email" type="email" placeholder="you@email.com"
                value={form.email} onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                name="password" type="password" placeholder="Min 6 characters"
                value={form.password} onChange={handleChange} required minLength={6}
              />
            </div>
            <div className="form-group">
              <label>I am a…</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="user">Listener / Fan</option>
                <option value="artist">Artist — I want to upload music</option>
              </select>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-visual">
          <h2 className="auth-visual-title">
            Share your<br />
            sound.
          </h2>
          <p className="auth-visual-sub">
            Upload tracks, build albums, and reach listeners
            worldwide — completely free.
          </p>
          <div className="auth-wave">
            {[30, 52, 22, 60, 42, 55, 35, 48, 28].map((h, i) => (
              <span key={i} style={{ height: h }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
