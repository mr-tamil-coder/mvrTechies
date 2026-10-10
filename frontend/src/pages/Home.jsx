import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { Cart } from '../components/Cart';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  Leaf,
  Filter
} from 'lucide-react';

export const Home = () => {
  const { products, addInquiry } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Contact Us Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    businessName: '',
    message: ''
  });
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const categories = ['All', 'Exotic Vegetables', 'Salad Greens', 'Fresh Herbs', 'Roots & Aromatics', 'Staples'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) {
      alert('Please fill in your name and phone number.');
      return;
    }

    addInquiry({
      name: contactForm.name,
      phone: contactForm.phone,
      email: contactForm.email || 'wholesale@lead.com',
      businessName: contactForm.businessName || 'Wholesale Buyer',
      message: contactForm.message || 'Direct procurement inquiry.'
    });

    setInquirySuccess(true);
    setContactForm({
      name: '',
      phone: '',
      email: '',
      businessName: '',
      message: ''
    });
  };

  const whatsappUrl = `https://wa.me/919840123456?text=${encodeURIComponent(
    "Hi ABCH Traders! I am interested in sourcing farm-fresh vegetables for my wholesale/retail business. Please share your catalog and bulk rates."
  )}`;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Slide-over Cart Drawer */}
      <Cart isDrawer={true} />

      {/* Floating WhatsApp Contact Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        title="Chat with Wholesale Specialist on WhatsApp"
        aria-label="WhatsApp Contact"
      >
        <MessageCircle size={30} />
      </a>

      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        backgroundColor: 'var(--cream)',
        padding: '70px 0 90px',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border)'
      }}>
        {/* Subtle decorative background foliage shapes */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(76,140,86,0.08) 0%, rgba(250,248,245,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}>
            {/* Left Hero Content */}
            <div>
              <div className="badge-eyebrow" style={{ marginBottom: '18px' }}>
                <Sparkles size={13} /> Pure Farm to Table • Export Grade
              </div>

              <h1 style={{
                fontSize: 'clamp(34px, 4.5vw, 54px)',
                lineHeight: 1.15,
                color: 'var(--forest-deep)',
                marginBottom: '20px'
              }}>
                Freshness Harvested at Dawn, <span style={{ color: 'var(--gold-deep)', fontStyle: 'italic' }}>Delivered with Integrity.</span>
              </h1>

              <p style={{
                fontSize: '17px',
                lineHeight: 1.6,
                color: 'var(--ink-soft)',
                marginBottom: '32px',
                maxWidth: '540px'
              }}>
                ABCH Traders bridges pesticide-free smallholder farms with premier restaurants, supermarkets, and international cold chains. Experience 29 hand-sorted vegetable varieties with guaranteed crispness.
              </p>

              {/* Hero Call to Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
                <a href="#products" className="btn-primary" style={{ padding: '14px 30px' }}>
                  Explore Fresh Catalog <ArrowRight size={18} />
                </a>
                <a href="#contact" className="btn-secondary" style={{ padding: '14px 26px' }}>
                  Wholesale Inquiry
                </a>
              </div>

              {/* Value Badges */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                borderTop: '1px solid var(--border)',
                paddingTop: '24px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--forest)', fontWeight: '700', fontSize: '14px' }}>
                    <Truck size={18} /> Same-Day Dispatch
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '2px' }}>Chilled transit at 4°C</div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--forest)', fontWeight: '700', fontSize: '14px' }}>
                    <ShieldCheck size={18} /> Zero Chemical
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '2px' }}>Soil Association tested</div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--forest)', fontWeight: '700', fontSize: '14px' }}>
                    <Leaf size={18} /> 29 Varieties
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '2px' }}>Exotics, greens & roots</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Banner */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--white)',
                position: 'relative'
              }}>
                <img
                  src="/images/Broccoli.jpeg"
                  alt="Farm Fresh Produce Banner"
                  style={{
                    width: '100%',
                    height: '420px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />

                {/* Floating Highlight Card */}
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(11, 39, 22, 0.92)',
                  backdropFilter: 'blur(8px)',
                  color: 'var(--cream)',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold-light)', fontWeight: '700' }}>
                      B2B & Retail Direct
                    </span>
                    <h4 style={{ fontSize: '16px', color: 'white', margin: '2px 0 0' }}>
                      Daily Harvest Sorting in Koyambedu
                    </h4>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <MessageCircle size={14} /> Quick Order
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="products" style={{ padding: '80px 0', backgroundColor: 'var(--sage-light)' }}>
        <div className="container">
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '44px'
          }}>
            <span className="badge-eyebrow" style={{ marginBottom: '12px' }}>
              Hand-Selected Inventory
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', color: 'var(--forest-deep)', marginBottom: '12px' }}>
              Our Seasonal Produce Catalog
            </h2>
            <p style={{ maxWidth: '600px', color: 'var(--ink-soft)', fontSize: '15px' }}>
              Graded daily for uniform size, moisture content, and optimal culinary performance. Transparent pricing updated directly from our logistics yard.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '40px'
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: '600',
                  backgroundColor: selectedCategory === cat ? 'var(--forest-deep)' : 'var(--white)',
                  color: selectedCategory === cat ? 'var(--gold-light)' : 'var(--forest-deep)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--forest-deep)' : 'var(--border)',
                  boxShadow: selectedCategory === cat ? 'var(--shadow-sm)' : 'none',
                  transition: 'var(--transition)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '24px'
          }}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* WHATSAPP INSTANT PROCUREMENT BANNER */}
      <section style={{
        backgroundColor: 'var(--forest-deep)',
        color: 'var(--cream)',
        padding: '50px 0',
        borderTop: '1px solid rgba(231, 203, 132, 0.2)',
        borderBottom: '1px solid rgba(231, 203, 132, 0.2)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            <div>
              <span style={{ color: 'var(--gold-light)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Instant Desk Support
              </span>
              <h3 style={{ fontSize: '24px', color: 'var(--cream)', marginTop: '4px' }}>
                Need Custom Tonnage or Daily Hotel Supply?
              </h3>
              <p style={{ color: 'var(--sage)', fontSize: '14px', maxWidth: '580px', marginTop: '4px' }}>
                Chat directly with our sourcing coordinators on WhatsApp. We generate instant digital estimates and verify batch freshness in real time.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#25D366',
                color: 'white',
                padding: '14px 28px',
                borderRadius: 'var(--radius-full)',
                fontWeight: '700',
                fontSize: '15px',
                boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)'
              }}
            >
              <MessageCircle size={20} /> Connect via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section id="contact" style={{ padding: '80px 0', backgroundColor: 'var(--cream)' }}>
        <div className="container">
          <div style={{
            maxWidth: '780px',
            margin: '0 auto',
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            padding: '44px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)'
          }}>
            
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span className="badge-eyebrow" style={{ marginBottom: '10px' }}>
                Get In Touch
              </span>
              <h2 style={{ fontSize: '30px', color: 'var(--forest-deep)', marginBottom: '8px' }}>
                Contact ABCH Traders
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>
                Have an inquiry about wholesale rates, international exports, or regular supplies? Submit your details below.
              </p>
            </div>

            {inquirySuccess ? (
              <div style={{
                backgroundColor: 'var(--success-light)',
                border: '1px solid rgba(22, 163, 74, 0.3)',
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <CheckCircle2 size={40} style={{ color: 'var(--success)' }} />
                <h4 style={{ fontSize: '18px', color: '#14532D', margin: 0 }}>
                  Thank you! Your inquiry has been submitted.
                </h4>
                <p style={{ fontSize: '13px', color: '#166534', maxWidth: '440px', lineHeight: 1.5 }}>
                  Our wholesale sourcing desk has logged your inquiry into our operations desk. We will reach back via phone/email shortly.
                </p>
                <button
                  onClick={() => setInquirySuccess(false)}
                  className="btn-secondary btn-sm"
                  style={{ marginTop: '8px' }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Suresh Raina"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="e.g. +91 98401 23456"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="e.g. buyer@enterprise.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Business / Organisation Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Fresh Kitchen Ltd"
                      value={contactForm.businessName}
                      onChange={(e) => setContactForm({ ...contactForm, businessName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Produce Requirements</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    placeholder="Specify vegetable varieties, weekly tonnage, packing preferences, or delivery locations..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  id="submit-inquiry-btn"
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '15px' }}
                >
                  <Send size={16} /> Submit Inquiry
                </button>

              </form>
            )}

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
