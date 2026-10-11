import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Lock, Mail, ArrowRight, Shield, KeyRound, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { apiForgotPasswordOtp, apiResetPasswordOtp } from '../services/api';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState('email'); // 'email', 'verify', 'done'
  const [forgotInput, setForgotInput] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotDemoOtp, setForgotDemoOtp] = useState('');
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

  // Step 1: Request Password Reset OTP
  const handleRequestForgotOtp = async (e) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotInput.trim()) {
      setForgotError('Please enter your registered email or phone number.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await apiForgotPasswordOtp(forgotInput.trim());
      if (res?.otp) {
        setForgotDemoOtp(res.otp);
      }
      setForgotStep('verify');
    } catch (err) {
      setForgotError(err.message || 'No registered account found with that email/phone.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Verify OTP and save new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotOtp.trim() || forgotOtp.trim().length !== 6) {
      setForgotError('Please enter the 6-digit OTP code.');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError('Passwords do not match. Please re-enter.');
      return;
    }

    setForgotLoading(true);
    try {
      await apiResetPasswordOtp(forgotInput.trim(), forgotOtp.trim(), newPassword);
      setForgotStep('done');
      setForgotSuccess('Your password has been reset successfully! You can now log in.');
    } catch (err) {
      setForgotError(err.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setForgotModal(false);
    setForgotStep('email');
    setForgotInput('');
    setForgotOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotError('');
    setForgotSuccess('');
    setForgotDemoOtp('');
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
                  style={{ fontSize: '12px', color: 'var(--gold-deep)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
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
              Create an authenticated account
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

      {/* Forgot Password OTP Modal */}
      {forgotModal && (
        <div className="modal-overlay" onClick={closeForgotModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: 'var(--forest-deep)', margin: 0 }}>
                  Reset Account Password
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                  Authenticate via 6-digit OTP code
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

            {/* STEP 3: RESET DONE */}
            {forgotStep === 'done' && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <CheckCircle2 size={44} style={{ color: 'var(--success)', margin: '0 auto 12px' }} />
                <h4 style={{ color: 'var(--forest-deep)', margin: '0 0 8px' }}>Password Reset Complete!</h4>
                <p style={{ fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '20px' }}>
                  {forgotSuccess}
                </p>
                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  Proceed to Login
                </button>
              </div>
            )}

            {/* STEP 2: ENTER OTP & NEW PASSWORD */}
            {forgotStep === 'verify' && (
              <form onSubmit={handleResetPassword}>
                {/* OTP Demo display banner */}
                <div style={{
                  background: 'var(--sage-light)',
                  border: '1px solid var(--forest)',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                  <ShieldCheck size={22} style={{ color: 'var(--forest-deep)' }} />
                  <div style={{ fontSize: '12px', color: 'var(--forest-deep)' }}>
                    <div><b>Password Reset OTP Code:</b></div>
                    <div style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '0.15em' }}>
                      {forgotDemoOtp || 'Sent to registered account'}
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontSize: '12px' }}>6-Digit OTP Code *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      className="form-input"
                      placeholder="Enter 6 digits"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      style={{ paddingLeft: '40px', letterSpacing: '0.15em', fontWeight: '700' }}
                      required
                    />
                    <KeyRound size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontSize: '12px' }}>New Password *</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontSize: '12px' }}>Confirm New Password *</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Re-enter new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={forgotLoading}
                  style={{ width: '100%', padding: '11px', fontSize: '14px' }}
                >
                  {forgotLoading ? 'Updating Password…' : 'Save New Password'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setForgotStep('email')}
                    style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Back to email entry
                  </button>
                </div>
              </form>
            )}

            {/* STEP 1: ENTER EMAIL OR PHONE */}
            {forgotStep === 'email' && (
              <form onSubmit={handleRequestForgotOtp}>
                <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '16px' }}>
                  Enter your registered wholesale email or phone number to receive a verification OTP code to securely reset your password.
                </p>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label" style={{ fontSize: '12px' }}>Registered Email or Phone *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. buyer@domain.com or 98401..."
                      value={forgotInput}
                      onChange={(e) => setForgotInput(e.target.value)}
                      style={{ paddingLeft: '40px' }}
                      required
                    />
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={forgotLoading}
                  style={{ width: '100%', padding: '11px', fontSize: '14px' }}
                >
                  {forgotLoading ? 'Sending OTP…' : 'Send Reset Code'} <ArrowRight size={14} />
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

