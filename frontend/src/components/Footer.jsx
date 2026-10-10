import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Award, ShieldCheck, HeartHandshake, Lock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--forest-deep)',
      color: 'var(--sage)',
      borderTop: '1px solid rgba(231, 203, 132, 0.2)',
      paddingTop: '64px',
      paddingBottom: '32px'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img src="/images/LOGO.jpeg" alt="ABCH Traders Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <h3 style={{ color: 'var(--cream)', fontSize: '20px', margin: 0 }}>ABCH TRADERS</h3>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(232, 241, 228, 0.8)', marginBottom: '20px' }}>
              Premier farm-fresh vegetable sourcing & export distribution. Connecting high-yield organic growers directly to restaurants, wholesale hubs, and gourmet kitchens globally.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span className="badge-eyebrow" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--gold-light)' }}>
                <ShieldCheck size={14} /> 100% Organic Graded
              </span>
              <span className="badge-eyebrow" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--gold-light)' }}>
                <Award size={14} /> Global GAP Certified
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ color: 'var(--gold-light)', fontSize: '16px', marginBottom: '18px', letterSpacing: '0.04em' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><Link to="/" style={{ color: 'var(--sage)', transition: 'color 0.2s' }}>Home Catalog</Link></li>
              <li><a href="/#products" style={{ color: 'var(--sage)', transition: 'color 0.2s' }}>All 29 Fresh Produce</a></li>
              <li><a href="/#contact" style={{ color: 'var(--sage)', transition: 'color 0.2s' }}>Contact & Inquiry</a></li>
              <li><Link to="/login" style={{ color: 'var(--sage)', transition: 'color 0.2s' }}>Customer Sign In</Link></li>
              <li><Link to="/register" style={{ color: 'var(--sage)', transition: 'color 0.2s' }}>Register Account</Link></li>
              <li style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Link to="/admin/login" style={{ color: 'var(--gold-light)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={13} /> Staff / Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Sourcing Hubs */}
          <div>
            <h4 style={{ color: 'var(--gold-light)', fontSize: '16px', marginBottom: '18px', letterSpacing: '0.04em' }}>Our Standards</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <HeartHandshake size={20} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <span><b>Direct Sourcing:</b> Fair contracts with verified organic farmers across South India & Maharashtra.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <ShieldCheck size={20} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <span><b>Cold Chain Log:</b> Continuous 4°C-8°C climate-controlled transit for peak floret and leaf vitality.</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: 'var(--gold-light)', fontSize: '16px', marginBottom: '18px', letterSpacing: '0.04em' }}>Direct Trade Desk</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} style={{ color: 'var(--gold-light)' }} />
                <span>+91 98401 23456 / +91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} style={{ color: 'var(--gold-light)' }} />
                <span>trade@abchtraders.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} style={{ color: 'var(--gold-light)', marginTop: '3px', flexShrink: 0 }} />
                <span>Central Export Yard, Koyambedu Logistics Hub, Chennai - 600092, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
          color: 'var(--ink-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} ABCH Traders Pvt Ltd. All rights reserved. • Built for Wholesale & D2C Excellence.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Supply</span>
            <Link to="/admin/login" style={{ color: 'var(--gold-light)' }}>
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
