import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { Plus, Check, Star, Lock } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAdd = () => {
    // If user is not logged in, redirect to register page with helpful prompt
    if (!currentUser) {
      navigate('/register', {
        state: {
          message: `Please register or login to add ${product.name} to your cart and order online!`
        }
      });
      return;
    }

    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="card-modern" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    }}>
      {/* Category Tag & Rating */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 2,
        pointerEvents: 'none'
      }}>
        <span style={{
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(4px)',
          color: 'var(--forest-deep)',
          fontSize: '11px',
          fontWeight: '700',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
        }}>
          {product.category || 'Fresh Harvest'}
        </span>
        <span style={{
          backgroundColor: 'rgba(11, 39, 22, 0.85)',
          backdropFilter: 'blur(4px)',
          color: 'var(--gold-light)',
          fontSize: '11px',
          fontWeight: '700',
          padding: '3px 8px',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          gap: '3px'
        }}>
          <Star size={11} fill="currentColor" /> {product.rating || 4.8}
        </span>
      </div>

      {/* Image / Visual Container */}
      <div style={{
        height: '210px',
        backgroundColor: 'var(--sage-light)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid var(--border-light)'
      }}>
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          />
        ) : (
          <div style={{
            fontSize: '56px',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #eaf1e4, #dbe9d3)'
          }}>
            {product.emoji || '🥬'}
          </div>
        )}
      </div>

      {/* Content Body */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{
            fontSize: '17px',
            marginBottom: '8px',
            lineHeight: 1.3,
            color: 'var(--forest-deep)'
          }}>
            {product.name}
          </h3>
          <p style={{
            fontSize: '13px',
            color: 'var(--ink-soft)',
            lineHeight: 1.5,
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.description}
          </p>
        </div>

        {/* Footer: Price & Add Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '14px',
          borderTop: '1px solid var(--border-light)'
        }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: '600' }}>
              Wholesale Rate
            </div>
            <div style={{
              fontSize: '20px',
              fontFamily: 'var(--font-serif)',
              fontWeight: '700',
              color: 'var(--forest-deep)'
            }}>
              ₹{product.price}
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--ink-muted)', fontFamily: 'var(--font-sans)', marginLeft: '3px' }}>
                / {product.unit || 'kg'}
              </span>
            </div>
          </div>

          <button
            onClick={handleAdd}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: '700',
              backgroundColor: added
                ? 'var(--success)'
                : currentUser
                ? 'var(--forest)'
                : 'var(--gold-deep)',
              color: 'var(--white)',
              boxShadow: added ? '0 4px 12px rgba(22, 163, 74, 0.3)' : '0 4px 12px rgba(18, 56, 33, 0.2)'
            }}
            title={!currentUser ? 'Register/Login to add to cart' : 'Add to Cart'}
          >
            {added ? (
              <>
                <Check size={16} /> Added ✓
              </>
            ) : currentUser ? (
              <>
                <Plus size={16} /> Add to Cart
              </>
            ) : (
              <>
                <Lock size={14} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
