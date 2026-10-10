import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { User, Phone, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { addUser } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    businessName: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please provide a valid contact phone number.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please recheck.');
      return;
    }

    try {
      await addUser({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        businessName: formData.businessName || 'Independent Wholesale Buyer',
        location: 'Tamil Nadu, India'
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2200);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          maxWidth: '520px',
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border)',
          padding: '40px 36px'
        }}>

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'var(--cream)',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--gold-light)',
              overflow: 'hidden'
            }}>
              <img src="/images/LOGO.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <h2 style={{ fontSize: '26px', color: 'var(--forest-deep)', marginBottom: '6px' }}>
              Create Wholesale Account
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>
              Join verified buyers for daily market pricing & priority harvest dispatch
            </p>
          </div>

          {error && (
            <div className="alert-box alert-error" style={{ fontSize: '13px' }}>
              {error}
            </div>
          )}

          {success ? (
            <div style={{
              backgroundColor: 'var(--success-light)',
              padding: '28px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(22, 163, 74, 0.3)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CheckCircle2 size={44} style={{ color: 'var(--success)' }} />
              <h3 style={{ fontSize: '20px', color: '#14532D', margin: 0 }}>
                Registration Successful!
              </h3>
              <p style={{ fontSize: '14px', color: '#166534', lineHeight: 1.5 }}>
                Your wholesale profile has been registered in the system. Redirecting you to the login screen...
              </p>
              <Link to="/login" className="btn-primary btn-sm" style={{ marginTop: '8px' }}>
                Go to Login Now <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ananya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--ink-muted)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label">Phone Number *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+91 98401..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ paddingLeft: '40px' }}
                      required
                    />
                    <Phone size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--ink-muted)' }} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="buyer@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ paddingLeft: '40px' }}
                      required
                    />
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--ink-muted)' }} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Business / Trade Name (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Organic Eats Kitchen"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label">Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{ paddingLeft: '40px' }}
                      required
                    />
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--ink-muted)' }} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Confirm Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      style={{ paddingLeft: '40px' }}
                      required
                    />
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--ink-muted)' }} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                id="register-submit-btn"
                className="btn-primary"
                style={{ width: '100%', padding: '13px', fontSize: '15px' }}
              >
                Register Account <ArrowRight size={16} />
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', fontSize: '14px' }}>
                <span style={{ color: 'var(--ink-soft)' }}>Already have an account?</span>
                <Link to="/login" style={{ color: 'var(--forest)', fontWeight: '700', textDecoration: 'underline' }}>
                  Back to Login
                </Link>
              </div>


            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};
