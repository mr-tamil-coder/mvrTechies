import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { Cart } from '../components/Cart';
import { Footer } from '../components/Footer';
import { 
  Search, 
  ShoppingBag, 
  LogOut, 
  User, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  PackageCheck,
  Store
} from 'lucide-react';

export const Dashboard = () => {
  const { currentUser, logout, products, orders } = useApp();
  const { cartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  // Redirect non-logged-in users to register page
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/register', {
        state: { message: 'Please register or login to access your dashboard and place orders.' }
      });
    }
  }, [currentUser, navigate]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'orders'

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filter products by search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Exotic Vegetables', 'Salad Greens', 'Fresh Herbs', 'Roots & Aromatics', 'Staples'];

  // Orders placed by current user or mock demo
  const userOrders = orders.filter(
    o => o.customerName === currentUser?.name || currentUser?.name === 'Rajesh Kumar' || true
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--cream)' }}>
      
      {/* CUSTOMER DASHBOARD HEADER */}
      <header style={{
        backgroundColor: 'var(--forest-deep)',
        borderBottom: '1px solid rgba(231, 203, 132, 0.2)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 90
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Brand & User Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                <img src="/images/LOGO.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)', fontSize: '18px', fontWeight: '700' }}>
                ABCH <span style={{ color: 'var(--gold-light)' }}>TRADERS</span>
              </span>
            </Link>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--sage)',
              fontSize: '13px'
            }}>
              <User size={15} style={{ color: 'var(--gold-light)' }} />
              <span>Welcome, <b>{currentUser?.name || 'Valued Buyer'}</b></span>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ flexGrow: 1, maxWidth: '420px', minWidth: '240px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search produce by name (e.g. Broccoli, Asparagus)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: '40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '13px',
                  paddingTop: '10px',
                  paddingBottom: '10px'
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--ink-muted)' }} />
            </div>
          </div>

          {/* Cart & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/" style={{ color: 'var(--sage)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', marginRight: '6px' }}>
              <Store size={15} /> Store
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--gold)',
                color: 'var(--forest-deep)',
                padding: '9px 16px',
                borderRadius: 'var(--radius-full)',
                fontWeight: '700',
                fontSize: '13px'
              }}
            >
              <ShoppingBag size={16} />
              <span>Cart ({cartCount})</span>
            </button>

            <button
              onClick={handleLogout}
              className="btn-secondary btn-sm"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: 'var(--cream)',
                border: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Cart Drawer Overlay */}
      <Cart isDrawer={true} />

      {/* SUB-NAV TABS */}
      <div style={{
        backgroundColor: 'var(--white)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px'
      }}>
        <div className="container" style={{ display: 'flex', gap: '24px' }}>
          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              padding: '16px 4px',
              borderBottom: activeTab === 'catalog' ? '3px solid var(--forest)' : '3px solid transparent',
              color: activeTab === 'catalog' ? 'var(--forest-deep)' : 'var(--ink-muted)',
              fontWeight: '700',
              fontSize: '15px'
            }}
          >
            Order Fresh Produce ({filteredProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '16px 4px',
              borderBottom: activeTab === 'orders' ? '3px solid var(--forest)' : '3px solid transparent',
              color: activeTab === 'orders' ? 'var(--forest-deep)' : 'var(--ink-muted)',
              fontWeight: '700',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Clock size={16} /> Order History ({userOrders.length})
          </button>
        </div>
      </div>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="container" style={{ padding: '36px 24px', flexGrow: 1 }}>
        
        {activeTab === 'catalog' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 380px',
            gap: '32px',
            alignItems: 'flex-start'
          }} className="dashboard-grid">
            
            {/* Left: Product Search, Category Filter, and Product Listing */}
            <div>
              {/* Category Pills */}
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '24px'
              }}>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: activeCategory === c ? 'var(--forest-deep)' : 'var(--white)',
                      color: activeCategory === c ? 'var(--gold-light)' : 'var(--forest-deep)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Product Listing Grid */}
              {filteredProducts.length === 0 ? (
                <div style={{
                  backgroundColor: 'var(--white)',
                  padding: '50px 20px',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  border: '1px solid var(--border)'
                }}>
                  <Search size={36} style={{ color: 'var(--ink-muted)', margin: '0 auto 12px' }} />
                  <h3 style={{ fontSize: '18px', color: 'var(--forest-deep)' }}>No products found</h3>
                  <p style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>Try searching for a different keyword or reset categories.</p>
                  <button onClick={() => { setSearchTerm(''); setActiveCategory('All'); }} className="btn-secondary btn-sm" style={{ marginTop: '12px' }}>
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '20px'
                }}>
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Embedded Cart Box */}
            <div style={{ position: 'sticky', top: '96px' }} className="dashboard-cart-sidebar">
              <Cart isDrawer={false} />
            </div>

          </div>
        )}

        {/* ORDER HISTORY TAB */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', color: 'var(--forest-deep)', marginBottom: '6px' }}>
                Your Placed Orders
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>
                Track delivery status and view itemized order totals
              </p>
            </div>

            <div className="table-responsive">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Dispatch Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td style={{ fontWeight: '700', fontFamily: 'monospace', color: 'var(--forest-deep)' }}>
                        {ord.id}
                      </td>
                      <td>{ord.date}</td>
                      <td>
                        {ord.items?.map((it, idx) => (
                          <span key={idx} style={{
                            display: 'inline-block',
                            backgroundColor: 'var(--cream)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: '12px',
                            marginRight: '4px',
                            marginBottom: '4px'
                          }}>
                            {it.name} (x{it.quantity})
                          </span>
                        ))}
                      </td>
                      <td style={{ fontWeight: '700', fontSize: '15px', color: 'var(--forest-deep)' }}>
                        ₹{ord.totalAmount}
                      </td>
                      <td>
                        <span style={{
                          backgroundColor: ord.status === 'Delivered' ? 'var(--success-light)' : 'var(--warning-light)',
                          color: ord.status === 'Delivered' ? '#14532D' : '#92400E',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}>
                          {ord.status}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', color: 'var(--forest)', fontWeight: '600' }}>
                          Cold-Chain Enroute
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      <Footer />

      {/* Responsive layout tweak */}
      <style>{`
        @media (max-width: 980px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-cart-sidebar {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
};
