import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {
  Lock,
  Mail,
  ArrowRight,
  Shield,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  X,
  Phone,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import { apiChangePasswordDirect } from '../services/api';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot / Change password modal state (Direct reset with old & new password, no OTP needed)
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

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

  // Direct Password Reset using Old Password and New Password
  const handleDirectPasswordChange = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotInput.trim()) {
      setForgotError('Please enter your registered email or phone number.');
      return;
    }
    if (!oldPassword) {
      setForgotError('Please enter your current (old) password.');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError('New passwords do not match. Please re-enter.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await apiChangePasswordDirect(
        forgotInput.trim(),
        oldPassword,
        newPassword
      );
      setForgotSuccess(res?.message || 'Password updated successfully! You can now log in.');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setForgotError(
        err.message || 'Failed to update password. Please check your old password or contact admin.'
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setForgotModal(false);
    setForgotInput('');
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotError('');
    setForgotSuccess('');
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
              Sign in to view wholesale rates, access your cart, and place orders
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
                  placeholder="e.g. buyer@domain.com or 9840123456"
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
                  onClick={() => {
                    setForgotError('');
                    setForgotSuccess('');
                    setForgotModal(true);
                  }}
                  style={{ fontSize: '12px', color: 'var(--gold-deep)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Forgot / Change Password?
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
              Create an account
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

      {/* Forgot / Change Password Modal (Old Password + New Password, or Contact Admin) */}
      {forgotModal && (
        <div className="modal-overlay" onClick={closeForgotModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: 'var(--forest-deep)', margin: 0 }}>
                  Reset / Change Password
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                  Enter your old password & new password to update immediately
                </span>
              </div>
              <button
                onClick={closeForgotModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {forgotError && (
              <div className="alert-box alert-error" style={{ fontSize: '12px', marginBottom: '16px' }}>
                {forgotError}
              </div>
            )}

            {/* SUCCESS STATE */}
            {forgotSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 size={46} style={{ color: 'var(--success)', margin: '0 auto 12px' }} />
                <h4 style={{ color: 'var(--forest-deep)', margin: '0 0 8px' }}>Password Updated Successfully!</h4>
                <p style={{ fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '20px' }}>
                  {forgotSuccess}
                </p>
                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  Proceed to Sign In
                </button>
              </div>
            ) : (
              /* DIRECT PASSWORD UPDATE FORM */
              <form onSubmit={handleDirectPasswordChange}>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontSize: '12px' }}>Registered Email or Phone *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. buyer@domain.com or 98401..."
                      value={forgotInput}
                      onChange={(e) => setForgotInput(e.target.value)}
                      style={{ paddingLeft: '38px', fontSize: '13px' }}
                      required
                    />
                    <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontSize: '12px' }}>Current (Old) Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Enter your existing password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      style={{ paddingLeft: '38px', fontSize: '13px' }}
                      required
                    />
                    <KeyRound size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontSize: '12px' }}>New Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ paddingLeft: '38px', fontSize: '13px' }}
                      required
                    />
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label" style={{ fontSize: '12px' }}>Confirm New Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Re-enter new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      style={{ paddingLeft: '38px', fontSize: '13px' }}
                      required
                    />
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={forgotLoading}
                  style={{ width: '100%', padding: '11px', fontSize: '14px' }}
                >
                  {forgotLoading ? 'Updating Password…' : 'Update Password'}
                </button>

                {/* HELP / CONTACT ADMIN SECTION */}
                <div
                  style={{
                    marginTop: '20px',
                    padding: '12px 14px',
                    backgroundColor: 'var(--cream)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    color: 'var(--ink-soft)',
                    lineHeight: '1.5',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: 'var(--forest-deep)', marginBottom: '4px' }}>
                    <HelpCircle size={15} />
                    Forgot your old password?
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '11.5px' }}>
                    If you cannot remember your old password, please contact the Admin directly to verify your account and reset your access:
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <a
                      href="tel:+919840123456"
                      style={{ color: 'var(--forest)', fontWeight: '700', textDecoration: 'none' }}
                    >
                      📞 +91 98401 23456
                    </a>
                    <a
                      href="https://wa.me/919840123456?text=Hi%20ABCH%20Traders,%20I%20forgot%20my%20account%20password.%20Please%20help%20me%20reset%20it."
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#15803D',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        textDecoration: 'none',
                      }}
                    >
                      <MessageCircle size={12} /> WhatsApp Support
                    </a>
                  </div>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
