import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Lock, Mail, ArrowRight, Shield } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your email or phone number');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      await login(identifier, password);
      // Redirect back to home page so customer can immediately add to cart and order
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{
        flexGrow: 1,
        backgroundColor: 'var(--cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border)',
          padding: '40px 36px'
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'var(--cream)',
              margin: '0 auto 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--gold-light)',
              overflow: 'hidden'
            }}>
              <img src="/images/LOGO.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <h2 style={{ fontSize: '26px', color: 'var(--forest-deep)', marginBottom: '6px' }}>
              Customer Sign In
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>
              Sign in to add farm-fresh produce to your cart and place orders
            </p>
          </div>

          {location.state?.message && (
            <div className="alert-box alert-error" style={{ fontSize: '13px', marginBottom: '20px' }}>
              {location.state.message}
            </div>
          )}

          {error && (
            <div className="alert-box alert-error" style={{ fontSize: '13px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email or Phone Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. rajesh.kumar@greenharvest.in or 9840123456"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                  required
                />
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--ink-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  style={{ fontSize: '12px', color: 'var(--gold-deep)', fontWeight: '600' }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                  required
                />
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--ink-muted)' }} />
              </div>
            </div>

            <button
              type="submit"
              id="customer-login-btn"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: '15px', marginTop: '8px' }}
            >
              {loading ? 'Signing in...' : 'Sign In & Start Shopping'} <ArrowRight size={16} />
            </button>
          </form>



          {/* Register Link */}
          <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '14px', color: 'var(--ink-soft)' }}>
            New to ABCH Traders?{' '}
            <Link to="/register" style={{ color: 'var(--forest)', fontWeight: '700', textDecoration: 'underline' }}>
              Create an account here
            </Link>
          </div>

          {/* Dedicated Admin Portal Link at bottom */}
          <div style={{ textAlign: 'center', marginTop: '18px', paddingTop: '14px', borderTop: '1px dashed var(--border)', fontSize: '12px' }}>
            <Link to="/admin/login" style={{ color: 'var(--ink-muted)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Shield size={13} /> Staff or Administrator? Access Admin Portal
            </Link>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="modal-overlay" onClick={() => setForgotModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--forest-deep)', marginBottom: '10px' }}>
              Reset Password
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '20px' }}>
              Please contact the ABCH Traders wholesale desk at <b>+91 98401 23456</b> or email <b>support@abchtraders.com</b> to reset your trade account credentials.
            </p>
            <button
              onClick={() => setForgotModal(false)}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              Understood
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
