import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';

export const Cart = ({ isDrawer = true, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const { addOrder, currentUser } = useApp();
  const [orderSuccess, setOrderSuccess] = useState(null);

  // If drawer mode and not open, don't render drawer overlay
  if (isDrawer && !isCartOpen) return null;

  const handleClose = () => {
    if (onClose) onClose();
    setIsCartOpen(false);
    setOrderSuccess(null);
  };

  const handleSubmitOrder = () => {
    if (cartItems.length === 0) return;

    const newOrder = addOrder({
      customerName: currentUser?.name || 'Guest Wholesale Client',
      customerEmail: currentUser?.email || 'wholesale@client.com',
      customerPhone: currentUser?.phone || '+91 98401 23456',
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      totalAmount: cartTotal + Math.round(cartTotal * 0.05)
    });

    setOrderSuccess(newOrder);
    clearCart();
  };

  const getWhatsAppMessage = () => {
    const itemsList = cartItems
      .map(item => `• ${item.name} (${item.quantity} ${item.unit}) - ₹${item.price * item.quantity}`)
      .join('%0A');
    const grand = cartTotal + Math.round(cartTotal * 0.05);
    return `https://wa.me/919840123456?text=Hi%20ABCH%20Traders,%20I%20would%20like%20to%20place%20an%20order:%0A%0A${itemsList}%0A%0AEstimated%20Total:%20₹${grand}%0AClient:%20${encodeURIComponent(currentUser?.name || 'Valued Buyer')}`;
  };

  const content = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--white)'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--cream)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--forest-deep)',
            color: 'var(--gold-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShoppingBag size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', margin: 0, color: 'var(--forest-deep)' }}>Your Order Cart</h3>
            <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items selected
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              title="Clear all items"
              style={{
                fontSize: '12px',
                color: 'var(--danger)',
                fontWeight: '600',
                padding: '4px 8px'
              }}
            >
              Clear
            </button>
          )}
          {isDrawer && (
            <button
              onClick={handleClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ink-soft)',
                backgroundColor: 'rgba(0,0,0,0.05)'
              }}
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {orderSuccess ? (
          <div style={{
            textAlign: 'center',
            padding: '30px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '20px', color: 'var(--forest-deep)' }}>Order Submitted Successfully!</h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', maxWidth: '320px', lineHeight: 1.5 }}>
              Thank you! Your order <b>#{orderSuccess.id}</b> has been received. Our wholesale dispatch team will prepare your cold-chain shipment.
            </p>
            <div style={{
              backgroundColor: 'var(--sage-light)',
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              width: '100%',
              fontSize: '13px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Order ID:</span> <b>{orderSuccess.id}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Status:</span> <span style={{ color: 'var(--success)', fontWeight: '700' }}>Confirmed</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Amount:</span> <b>₹{orderSuccess.totalAmount}</b>
              </div>
            </div>
            <button
              onClick={() => setOrderSuccess(null)}
              className="btn-primary"
              style={{ marginTop: '10px', width: '100%' }}
            >
              Continue Shopping
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--ink-muted)'
          }}>
            <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <h4 style={{ fontSize: '18px', color: 'var(--forest-deep)', marginBottom: '8px' }}>Your cart is empty</h4>
            <p style={{ fontSize: '14px', marginBottom: '20px' }}>
              Explore our 29 farm-fresh produce varieties and add items to begin.
            </p>
            {isDrawer && (
              <button onClick={handleClose} className="btn-secondary btn-sm">
                Browse Products
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--white)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Thumb */}
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--sage-light)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <span style={{ fontSize: '24px' }}>{item.emoji || '🥬'}</span>
                  )}
                </div>

                {/* Details */}
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '14px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--forest-deep)' }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '2px' }}>
                    ₹{item.price} <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>/ {item.unit}</span>
                  </div>
                </div>

                {/* Counter */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--cream-dark)',
                  padding: '4px 6px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{ fontSize: '13px', fontWeight: '700', minWidth: '18px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Item Total */}
                <div style={{ textAlign: 'right', minWidth: '60px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--forest-deep)' }}>
                    ₹{item.price * item.quantity}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ color: 'var(--ink-muted)', marginTop: '4px', padding: '2px' }}
                    title="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary & Order Actions */}
      {!orderSuccess && cartItems.length > 0 && (
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--cream)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-soft)' }}>
              <span>Produce Subtotal:</span>
              <span>₹{cartTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-soft)' }}>
              <span>Estimated Tax (5% GST):</span>
              <span>₹{Math.round(cartTotal * 0.05)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--forest-deep)',
              borderTop: '1px dashed var(--border)',
              paddingTop: '10px'
            }}>
              <span>Total Payable:</span>
              <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--forest-deep)' }}>
                ₹{cartTotal + Math.round(cartTotal * 0.05)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleSubmitOrder}
              id="submit-order-btn"
              className="btn-primary"
              style={{ width: '100%', padding: '14px' }}
            >
              Submit Order <ArrowRight size={18} />
            </button>

            <a
              href={getWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#25D366',
                color: 'white',
                padding: '11px',
                borderRadius: 'var(--radius-full)',
                fontWeight: '600',
                fontSize: '13px',
                textDecoration: 'none'
              }}
            >
              <MessageCircle size={16} /> Instant Order via WhatsApp
            </a>
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: 'var(--ink-muted)' }}>
            ⚡ Phase 1 Demo: Orders are processed in frontend state.
          </div>
        </div>
      )}
    </div>
  );

  if (!isDrawer) {
    return (
      <div className="card-modern" style={{ overflow: 'hidden' }}>
        {content}
      </div>
    );
  }

  return (
    <div className="cart-overlay" onClick={handleClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </div>
  );
};
