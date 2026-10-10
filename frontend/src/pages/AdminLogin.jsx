import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, Lock, Mail, ArrowRight, Database, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your administrator email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await adminLogin(email, password);
      if (loggedUser && loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Access denied: This account does not have administrator privileges.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B2716 0%, #123821 50%, #0B2716 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 20px',
      position: 'relative'
    }}>
      {/* Subtle radial glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(231,203,132,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Back link */}
      <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: '600',
          transition: 'color 0.2s'
        }}>
          <ArrowLeft size={16} /> Back to Storefront
        </Link>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        border: '1px solid rgba(231, 203, 132, 0.25)',
        overflow: 'hidden'
      }}>
        {/* Top gold accent bar */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--gold-deep), var(--gold-light), var(--gold-deep))' }} />

        <div style={{ padding: '40px 36px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '68px', height: '68px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--forest-deep), var(--forest))',
              color: 'var(--gold-light)',
              margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '3px solid rgba(231,203,132,0.4)',
              boxShadow: '0 8px 24px rgba(11,39,22,0.3)'
            }}>
              <Shield size={32} />
            </div>
            <h2 style={{ fontSize: '24px', color: 'var(--forest-deep)', margin: '0 0 6px', fontFamily: 'var(--font-serif)' }}>
              Admin Console
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: 0 }}>
              ABCH Traders — Authorized Management Access
            </p>
          </div>

          {/* DB Credentials Info */}
          <div style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            marginBottom: '24px',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#14532D', marginBottom: '8px' }}>
              <Database size={14} /> Database Admin Credentials
            </div>
            <div style={{ color: '#166534', lineHeight: 1.8 }}>
              <div>📧 <b>Email:</b> <code style={{ backgroundColor: 'white', padding: '1px 6px', borderRadius: '3px', border: '1px solid #BBF7D0' }}>admin@abchtraders.com</code></div>
              <div>🔑 <b>Password:</b> <code style={{ backgroundColor: 'white', padding: '1px 6px', borderRadius: '3px', border: '1px solid #BBF7D0' }}>adminPass123</code></div>
            </div>
            <div style={{ marginTop: '8px', fontSize: '11px', color: '#4ADE80', fontStyle: 'italic' }}>
              ✓ Stored securely in MongoDB with bcrypt hashing
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
              color: '#991B1B', borderRadius: 'var(--radius-md)',
              padding: '12px 14px', marginBottom: '20px', fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Administrator Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@abchtraders.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                  required
                />
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '42px', paddingRight: '42px' }}
                  required
                />
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="admin-login-submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', fontSize: '15px', marginTop: '8px',
                background: 'linear-gradient(135deg, var(--forest-deep), var(--forest))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Authenticating...
                </>
              ) : (
                <>Sign In to Operations Portal <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--ink-muted)' }}>
            This portal is restricted to authorized ABCH administrators only.<br />
            Unauthorized access is prohibited.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
