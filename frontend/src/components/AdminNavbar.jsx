import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ExternalLink, Bell, LogOut, Shield } from 'lucide-react';

export const AdminNavbar = ({ title = "Operations Dashboard" }) => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header style={{
      backgroundColor: 'var(--white)',
      borderBottom: '1px solid var(--border)',
      padding: '16px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      <div>
        <h2 style={{ fontSize: '20px', margin: 0, color: 'var(--forest-deep)' }}>
          {title}
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
          ABCH Traders Management Console
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Quick link to public store */}
        <Link
          to="/"
          className="btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ExternalLink size={14} /> View Store
        </Link>

        {/* Notifications badge */}
        <div style={{
          position: 'relative',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: 'var(--sage-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--forest)'
        }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--gold)',
            borderRadius: '50%'
          }} />
        </div>

        {/* Admin profile pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'var(--cream)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: 'var(--forest-deep)',
            color: 'var(--gold-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '13px'
          }}>
            <Shield size={16} />
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.2 }}>
            <div style={{ fontWeight: '700', color: 'var(--forest-deep)' }}>
              {currentUser?.name || 'Administrator'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gold-deep)', fontWeight: '600' }}>
              Super Admin
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            style={{ color: 'var(--ink-muted)', marginLeft: '6px', padding: '4px' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
