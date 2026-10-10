import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Tag, 
  Package,
  FilePlus, 
  FileText, 
  Store, 
  ArrowLeft
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const location = useLocation();
  const isAdminHome = location.pathname === '/admin';

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--forest-deep)',
      color: 'var(--cream)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      minHeight: '100vh',
      borderRight: '1px solid rgba(231, 203, 132, 0.15)'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: 'var(--cream)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '2px solid var(--gold-light)'
        }}>
          <img src="/images/LOGO.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', color: 'var(--cream)', margin: 0, fontFamily: 'var(--font-serif)' }}>
            ABCH TRADERS
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Admin Console
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div style={{ padding: '20px 14px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        
        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-muted)', padding: '6px 12px', fontWeight: '700', letterSpacing: '0.08em' }}>
          Operations
        </div>

        {/* Dashboard Overview */}
        <NavLink
          to="/admin"
          end
          onClick={() => setActiveTab && setActiveTab('overview')}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: '600',
            color: (isActive && (!activeTab || activeTab === 'overview')) ? 'var(--forest-deep)' : 'var(--sage)',
            backgroundColor: (isActive && (!activeTab || activeTab === 'overview')) ? 'var(--gold-light)' : 'transparent',
            transition: 'var(--transition)'
          })}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard Overview</span>
        </NavLink>

        {/* If on /admin, we can switch tabs; otherwise navigate to /admin */}
        {isAdminHome ? (
          <>
            <button
              onClick={() => setActiveTab('products')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                color: activeTab === 'products' ? 'var(--forest-deep)' : 'var(--sage)',
                backgroundColor: activeTab === 'products' ? 'var(--gold-light)' : 'transparent',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <Package size={18} />
              <span>Manage Products</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                color: activeTab === 'users' ? 'var(--forest-deep)' : 'var(--sage)',
                backgroundColor: activeTab === 'users' ? 'var(--gold-light)' : 'transparent',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <Users size={18} />
              <span>All Users</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                color: activeTab === 'inquiries' ? 'var(--forest-deep)' : 'var(--sage)',
                backgroundColor: activeTab === 'inquiries' ? 'var(--gold-light)' : 'transparent',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <MessageSquare size={18} />
              <span>Contact Inquiries</span>
            </button>

            <button
              onClick={() => setActiveTab('prices')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                color: activeTab === 'prices' ? 'var(--forest-deep)' : 'var(--sage)',
                backgroundColor: activeTab === 'prices' ? 'var(--gold-light)' : 'transparent',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <Tag size={18} />
              <span>Edit Prices</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--sage)'
              }}
            >
              <Package size={18} />
              <span>Manage Products</span>
            </Link>

            <Link
              to="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--sage)'
              }}
            >
              <Users size={18} />
              <span>All Users</span>
            </Link>

            <Link
              to="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--sage)'
              }}
            >
              <MessageSquare size={18} />
              <span>Contact Inquiries</span>
            </Link>

            <Link
              to="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--sage)'
              }}
            >
              <Tag size={18} />
              <span>Edit Prices</span>
            </Link>
          </>
        )}

        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-muted)', padding: '16px 12px 6px', fontWeight: '700', letterSpacing: '0.08em' }}>
          Invoicing & Accounts
        </div>

        {/* Generate Invoice */}
        <NavLink
          to="/admin/invoice"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: '600',
            color: isActive ? 'var(--forest-deep)' : 'var(--sage)',
            backgroundColor: isActive ? 'var(--gold-light)' : 'transparent',
            transition: 'var(--transition)'
          })}
        >
          <FilePlus size={18} />
          <span>Generate Invoice</span>
        </NavLink>

        {/* View Invoices */}
        <NavLink
          to="/admin/invoices"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: '600',
            color: isActive ? 'var(--forest-deep)' : 'var(--sage)',
            backgroundColor: isActive ? 'var(--gold-light)' : 'transparent',
            transition: 'var(--transition)'
          })}
        >
          <FileText size={18} />
          <span>View Invoices</span>
        </NavLink>
      </div>

      {/* Footer link to public store */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            color: 'var(--gold-light)',
            fontWeight: '600'
          }}
        >
          <Store size={16} /> Back to Public Store
        </Link>
      </div>
    </aside>
  );
};
