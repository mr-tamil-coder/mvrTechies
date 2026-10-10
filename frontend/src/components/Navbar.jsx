import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { ShoppingBag, User, LogOut, Menu, X, Shield, PackageCheck, UserPlus } from 'lucide-react';

export const Navbar = ({ onOpenOrders }) => {
  const { cartCount, setIsCartOpen } = useCart();
  const { currentUser, logout, orders } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToProducts = () => {
    if (location.pathname !== '/') {
      navigate('/#products');
    } else {
      const el = document.getElementById('products');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const scrollToContact = () => {
    if (location.pathname !== '/') {
      navigate('/#contact');
    } else {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--forest-deep)',
      borderBottom: '1px solid rgba(231, 203, 132, 0.2)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--cream)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '2px solid var(--gold-light)'
          }}>
            <img 
              src="/images/LOGO.jpeg" 
              alt="ABCH Traders Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span style="font-weight:900;color:var(--forest-deep);font-size:18px;">AB</span>';
              }}
            />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontWeight: '700',
              color: 'var(--cream)',
              letterSpacing: '0.02em',
              display: 'block',
              lineHeight: 1.1
            }}>
              ABCH <span style={{ color: 'var(--gold-light)' }}>TRADERS</span>
            </span>
            <span style={{
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--sage)',
              display: 'block'
            }}>
              Farm to Table • Fresh Produce
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          <Link to="/" style={{
            color: location.pathname === '/' ? 'var(--gold-light)' : 'var(--sage)',
            fontWeight: '600',
            fontSize: '15px',
            transition: 'var(--transition)'
          }}>
            Home
          </Link>

          <button onClick={scrollToProducts} style={{
            color: 'var(--sage)',
            fontWeight: '600',
            fontSize: '15px',
            background: 'none',
            padding: 0,
            transition: 'var(--transition)'
          }}>
            Fresh Produce
          </button>

          <button onClick={scrollToContact} style={{
            color: 'var(--sage)',
            fontWeight: '600',
            fontSize: '15px',
            background: 'none',
            padding: 0,
            transition: 'var(--transition)'
          }}>
            Contact Us
          </button>

          {/* If customer is logged in, show My Orders trigger right in the navbar */}
          {currentUser && currentUser.role !== 'admin' && (
            <button
              onClick={() => onOpenOrders && onOpenOrders()}
              style={{
                color: 'var(--gold-light)',
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(231, 203, 132, 0.1)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(231, 203, 132, 0.3)'
              }}
            >
              <PackageCheck size={16} /> My Orders
            </button>
          )}

          {/* Admin shortcut if logged in as Admin */}
          {currentUser?.role === 'admin' && (
            <Link to="/admin" style={{
              color: 'var(--gold-light)',
              fontWeight: '700',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Shield size={16} /> Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Actions: Cart & Login/Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          
          {/* Cart Icon Button */}
          <button 
            id="cart-toggle-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Shopping Cart"
            style={{
              position: 'relative',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(231, 203, 132, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cream)',
              transition: 'var(--transition)'
            }}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#D3352A',
                color: 'white',
                fontSize: '11px',
                fontWeight: '800',
                minWidth: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                border: '2px solid var(--forest-deep)'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* User Auth Section */}
          {currentUser ? (
            <div style={{ display: 'none', alignItems: 'center', gap: '10px' }} className="desktop-auth">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'var(--cream)',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  color: 'var(--forest-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '12px'
                }}>
                  {currentUser.name.charAt(0)}
                </div>
                <span>{currentUser.name}</span>
                {currentUser.role === 'admin' && (
                  <span style={{ fontSize: '10px', background: 'var(--gold)', color: 'var(--forest-deep)', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>ADMIN</span>
                )}
              </div>
              <button 
                onClick={handleLogout}
                title="Logout"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sage)',
                  backgroundColor: 'rgba(255,255,255,0.05)'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'none', alignItems: 'center', gap: '8px' }} className="desktop-auth">
              <Link 
                to="/login"
                className="btn-secondary btn-sm"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: 'var(--cream)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <User size={14} /> Login
              </Link>
              <Link 
                to="/register"
                className="btn-gold btn-sm"
              >
                <UserPlus size={14} /> Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              color: 'var(--cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.06)'
            }}
            className="mobile-toggle"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--forest-deep)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--cream)', fontSize: '16px', fontWeight: '600' }}>
            Home
          </Link>
          <button onClick={scrollToProducts} style={{ textAlign: 'left', color: 'var(--cream)', fontSize: '16px', fontWeight: '600' }}>
            Fresh Produce
          </button>
          <button onClick={scrollToContact} style={{ textAlign: 'left', color: 'var(--cream)', fontSize: '16px', fontWeight: '600' }}>
            Contact Us
          </button>
          {currentUser && currentUser.role !== 'admin' && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenOrders) onOpenOrders();
              }}
              style={{ textAlign: 'left', color: 'var(--gold-light)', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <PackageCheck size={18} /> My Orders
            </button>
          )}
          {currentUser?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--gold-light)', fontSize: '16px', fontWeight: '700' }}>
              Admin Portal
            </Link>
          )}
          <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {currentUser ? (
              <>
                <span style={{ color: 'var(--sage)', fontSize: '14px' }}>Logged in as <b>{currentUser.name}</b></span>
                <button onClick={handleLogout} style={{ color: '#F87171', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary btn-sm" style={{ flex: 1, textAlign: 'center' }}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-gold btn-sm" style={{ flex: 1, textAlign: 'center' }}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Responsive Inline Media Styles */}
      <style>{`
        @media (min-width: 820px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
