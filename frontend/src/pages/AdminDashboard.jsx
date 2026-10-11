import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';
import { AdminNavbar } from '../components/AdminNavbar';
import {
  Users, MessageSquare, Package, ShoppingCart, FileText, Edit3, Check, X,
  FilePlus, CheckCircle2, Eye, Search, Download, Phone, Mail, TrendingUp,
  TrendingDown, Percent, IndianRupee, Inbox, Plus, Trash2, Save
} from 'lucide-react';

/* ---------- helpers ---------- */
// Statuses match Inquiry model enum exactly
const STATUSES = ['New', 'In Review', 'Responded'];
const STATUS_STYLE = {
  'New':        { bg: '#FEF3C7', fg: '#92400E' },
  'In Review':  { bg: '#DBEAFE', fg: '#1E40AF' },
  'Responded':  { bg: '#DCFCE7', fg: '#14532D' },
};

const PROD_CATEGORIES = ['Exotic Vegetables', 'Salad Greens', 'Fresh Herbs', 'Root Vegetables', 'Fresh Produce'];
const UNITS = ['kg', 'g', 'bunch', 'piece', 'box', 'tray'];
const EMOJIS = ['🥬', '🥦', '🌿', '🥕', '🧅', '🧄', '🫑', '🥑', '🍅', '🌽', '🫛', '🥗'];
const BLANK_PRODUCT = { name: '', category: 'Fresh Produce', unit: 'kg', price: '', emoji: '🥬', image: '', description: '', stock: 100 };

// All images available in /public/images/
const AVAILABLE_IMAGES = [
  '/images/asparagus.jpeg', '/images/asparagus 2.jpeg', '/images/asparagus 3.jpeg',
  '/images/Basil.jpeg', '/images/basil 2.jpg',
  '/images/beans.webp', '/images/beans 2.jpg',
  '/images/brinjal.jpg', '/images/brinjal 2.jpg',
  '/images/Broccoli.jpeg', '/images/broccoli 2.jpg', '/images/broccoli 3.avif',
  '/images/Brussels sprouts.jpeg', '/images/Brussels sprouts 2.avif',
  '/images/Cabbage.jpg', '/images/Cabbage 2.jpg',
  '/images/capsium.jpg', '/images/capsium 2.jpg',
  '/images/Carrot Pink.webp', '/images/Carrot Pink 2.jpg',
  '/images/cauliflower.jpg', '/images/cauliflower 2.jpg',
  '/images/coriander.webp', '/images/coriander 2.avif',
  '/images/cucumber.jpg', '/images/cucumber 2.jpg',
  '/images/curry leaves.webp', '/images/curry leaves 2.jpg',
  '/images/drumstick.webp', '/images/drumstick 2.jpg',
  '/images/gchilli.jpg', '/images/gchilli 2.avif',
  '/images/ginger.jpg', '/images/ginger 2.jpg',
  '/images/karela.jpg', '/images/Karela 2.webp',
  '/images/lady fingur.webp', '/images/lady fingur 2.jpg',
  '/images/lemon.jpg', '/images/lemon 2.webp',
  '/images/lotus stem.jpg', '/images/lotus stem 2.jpg',
  '/images/Methi Seasonal.jpg', '/images/Methi Seasonal.webp',
  '/images/mint.webp', '/images/mint 2.jpg',
  '/images/mushroom.webp', '/images/mushroom 2.jpg',
  '/images/onion.jpg', '/images/onion 2.jpg',
  '/images/onion small.jpg', '/images/onion small 2.jpg',
  '/images/potato.jpg', '/images/potato 2.jpg',
  '/images/potato sugar free.jpg', '/images/potato sugar free 2.webp',
  '/images/Red lettuce.jpeg', '/images/Red lettuce 2.jpg',
  '/images/Roman lettuce.webp', '/images/Roman lettuce 2.jpeg',
];

// Reusable image picker: file upload from device, dropdown of existing images, and URL/path
const ImagePicker = ({ value, onChange, fld }) => {
  const fileInputRef = React.useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* File Upload Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <button
          type="button"
          className="btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
          onClick={() => fileInputRef.current?.click()}
        >
          📁 Upload New Image from Device
        </button>
        <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
          (Upload from PC / gallery or pick below)
        </span>
      </div>

      {/* Select Existing Image dropdown */}
      <select
        style={fld}
        value={AVAILABLE_IMAGES.includes(value) ? value : ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">— Or select from library ({AVAILABLE_IMAGES.length} images) —</option>
        {AVAILABLE_IMAGES.map((img) => (
          <option key={img} value={img}>{img.replace('/images/', '')}</option>
        ))}
      </select>

      {/* Custom image URL or path */}
      <input
        style={fld}
        value={value && value.startsWith('data:') ? 'Image uploaded from device (base64 data)' : (value || '')}
        onChange={(e) => onChange(e.target.value)}
        disabled={value && value.startsWith('data:')}
        placeholder="Or paste image URL: https://... or /images/item.jpg"
      />

      {/* Preview with remove button */}
      {value && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
          <img
            src={value}
            alt="preview"
            onError={(e) => { e.target.style.display = 'none'; }}
            style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }}
          />
          <button
            type="button"
            className="btn-secondary btn-sm"
            style={{ fontSize: 11, padding: '4px 8px', color: 'var(--danger)' }}
            onClick={() => {
              onChange('');
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          >
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
};

// Thumbnail: shows real image if available, emoji fallback
const ProductThumb = ({ product, size = 48 }) => {
  const [err, setErr] = React.useState(false);
  return product.image && !err ? (
    <img
      src={product.image}
      alt={product.name}
      onError={() => setErr(true)}
      style={{ width: size, height: size, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-light)', flexShrink: 0 }}
    />
  ) : (
    <span style={{ fontSize: size * 0.55, width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--sage-light)', borderRadius: 8, flexShrink: 0 }}>
      {product.emoji || '🥬'}
    </span>
  );
};

const downloadCSV = (filename, rows) => {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [keys.join(','), ...rows.map((r) => keys.map((k) => esc(r[k])).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const Chip = ({ bg, fg, children }) => (
  <span style={{ background: bg, color: fg, padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
    {children}
  </span>
);

const SearchBox = ({ value, onChange, placeholder }) => (
  <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 340 }}>
    <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
    <input
      className="form-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ paddingLeft: 36, width: '100%' }}
    />
  </div>
);

const Empty = ({ title, hint }) => (
  <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--ink-soft)' }}>
    <Inbox size={30} style={{ color: 'var(--ink-muted)', marginBottom: 8 }} />
    <div style={{ fontWeight: 700, color: 'var(--forest-deep)' }}>{title}</div>
    <div style={{ fontSize: 13 }}>{hint}</div>
  </div>
);

const TabHeader = ({ title, sub, onBack, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
    <div>
      <h2 style={{ fontSize: 22, color: 'var(--forest-deep)', margin: 0 }}>{title}</h2>
      <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '4px 0 0' }}>{sub}</p>
    </div>
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {children}
      <button onClick={onBack} className="btn-secondary btn-sm">Back to overview</button>
    </div>
  </div>
);

/* ---------- component ---------- */
export const AdminDashboard = () => {
  const {
    products, addProduct, updateProduct, deleteProduct, updateProductPrice,
    users, inquiries, updateInquiryStatus, orders, invoices
  } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState('success');

  // price editing + change history
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPrice, setTempPrice] = useState('');
  const [prevPrices, setPrevPrices] = useState({});

  // filters
  const [priceQuery, setPriceQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [userQuery, setUserQuery] = useState('');
  const [inqQuery, setInqQuery] = useState('');
  const [inqFilter, setInqFilter] = useState('All');
  const [bulkPct, setBulkPct] = useState('');
  const [productQuery, setProductQuery] = useState('');
  const [productCat, setProductCat] = useState('All');

  // inquiry state
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // product management state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState(BLANK_PRODUCT);
  const [editForm, setEditForm] = useState(BLANK_PRODUCT);
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (msg, type = 'success') => { setToast(msg); setToastType(type); };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  /* derived data */
  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    const q = priceQuery.trim().toLowerCase();
    return products.filter(
      (p) => (category === 'All' || p.category === category) && (!q || p.name.toLowerCase().includes(q))
    );
  }, [products, priceQuery, category]);

  const filteredProductsMgr = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    return products.filter(
      (p) => (productCat === 'All' || p.category === productCat) && (!q || p.name.toLowerCase().includes(q))
    );
  }, [products, productQuery, productCat]);

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    return users.filter((u) => !q || [u.name, u.phone, u.email, u.businessName].some((v) => (v || '').toLowerCase().includes(q)));
  }, [users, userQuery]);

  const filteredInquiries = useMemo(() => {
    const q = inqQuery.trim().toLowerCase();
    return inquiries.filter(
      (i) =>
        (inqFilter === 'All' || (i.status || 'New') === inqFilter) &&
        (!q || [i.name, i.phone, i.businessName, i.message].some((v) => (v || '').toLowerCase().includes(q)))
    );
  }, [inquiries, inqQuery, inqFilter]);

  const newCount = inquiries.filter((i) => (i.status || 'New') === 'New').length;
  const revenue = invoices.reduce((s, inv) => s + Number(inv.total ?? inv.grandTotal ?? inv.amount ?? 0), 0);
  const recentOrders = [...orders].slice(-5).reverse();

  /* product management actions */
  const handleAddProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price) {
      showToast('Product name and price are required.', 'error');
      return;
    }
    setSavingProduct(true);
    try {
      await addProduct({ ...newProduct, price: parseFloat(newProduct.price) });
      setNewProduct(BLANK_PRODUCT);
      setShowAddProduct(false);
      showToast(`"${newProduct.name}" added successfully!`);
    } catch (err) {
      showToast('Failed to add product. Try again.', 'error');
    }
    setSavingProduct(false);
  };

  const startEditProduct = (p) => {
    setEditingProduct(p.id);
    setEditForm({ name: p.name, category: p.category, unit: p.unit, price: p.price, emoji: p.emoji || '🥬', image: p.image || '', description: p.description || '', stock: p.stock ?? 100 });
  };

  const handleUpdateProduct = async (p) => {
    if (!editForm.name.trim() || !editForm.price) { showToast('Name and price required.', 'error'); return; }
    setSavingProduct(true);
    try {
      await updateProduct(p.id, { ...editForm, price: parseFloat(editForm.price) });
      setEditingProduct(null);
      showToast(`"${editForm.name}" updated!`);
    } catch (err) {
      showToast('Update failed.', 'error');
    }
    setSavingProduct(false);
  };

  const handleDeleteProduct = async (p) => {
    setDeletingId(p.id);
    try {
      await deleteProduct(p.id);
      setConfirmDelete(null);
      showToast(`"${p.name}" deleted.`);
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
    setDeletingId(null);
  };

  /* inquiry status — persisted to DB */
  const handleInqStatus = (inq, status) => {
    updateInquiryStatus(inq.id, status);
    if (selectedInquiry && String(selectedInquiry.id) === String(inq.id)) {
      setSelectedInquiry({ ...selectedInquiry, status });
    }
  };

  /* price actions */
  const startEditPrice = (p) => { setEditingPriceId(p.id); setTempPrice(p.price); };
  const cancelEdit = () => { setEditingPriceId(null); setTempPrice(''); };

  const applyPrice = (p, value) => {
    setPrevPrices((m) => ({ ...m, [p.id]: Number(p.price) }));
    updateProductPrice(p.id, value);
  };

  const savePrice = (p) => {
    if (tempPrice === '' || Number(tempPrice) < 0) return;
    applyPrice(p, tempPrice);
    cancelEdit();
    setToast(`${p.name} is now ${money(tempPrice)} per ${p.unit}.`);
  };

  const applyBulk = () => {
    const pct = Number(bulkPct);
    if (!pct || !filteredProducts.length) return;
    filteredProducts.forEach((p) => applyPrice(p, Math.max(1, Math.round(Number(p.price) * (1 + pct / 100)))));
    setToast(`${pct > 0 ? 'Raised' : 'Lowered'} ${filteredProducts.length} prices by ${Math.abs(pct)}%.`);
    setBulkPct('');
  };

  const onPriceKey = (e, p) => {
    if (e.key === 'Enter') savePrice(p);
    if (e.key === 'Escape') cancelEdit();
  };

  const Delta = ({ p }) => {
    const prev = prevPrices[p.id];
    if (prev === undefined || prev === Number(p.price)) return null;
    const up = Number(p.price) > prev;
    const Icon = up ? TrendingUp : TrendingDown;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, marginLeft: 8, color: up ? '#B91C1C' : '#15803D' }}>
        <Icon size={12} /> {up ? '+' : ''}{(((p.price - prev) / prev) * 100).toFixed(1)}%
      </span>
    );
  };

  const PriceInput = ({ p, width = 90 }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontWeight: 700 }}>₹</span>
      <input
        type="number" min="0" autoFocus className="form-input"
        value={tempPrice}
        onChange={(e) => setTempPrice(e.target.value)}
        onKeyDown={(e) => onPriceKey(e, p)}
        style={{ width, padding: '6px 8px', fontSize: 13 }}
        aria-label={`New price for ${p.name}`}
      />
    </div>
  );

  /* stat cards */
  const stats = [
    { label: 'Wholesale users', value: users.length, icon: Users, color: 'var(--forest)', note: 'Open user list', onClick: () => setActiveTab('users') },
    { label: 'New inquiries', value: newCount, icon: MessageSquare, color: 'var(--gold)', note: `${inquiries.length} total`, onClick: () => setActiveTab('inquiries') },
    { label: 'Products', value: products.length, icon: Package, color: '#0284C7', note: 'Manage products', onClick: () => setActiveTab('products') },
    { label: 'Orders', value: orders.length, icon: ShoppingCart, color: '#7C3AED', note: 'Placed so far' },
    { label: 'Invoiced', value: money(revenue), icon: IndianRupee, color: '#16A34A', note: `${invoices.length} invoices`, onClick: () => navigate('/admin/invoices') },
  ];

  const fld = { padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, background: '#fff', width: '100%' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--cream)' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminNavbar title="Executive Admin Portal" />

        <main style={{ padding: '32px 36px', flexGrow: 1 }}>
          {/* Toast */}
          {toast && (
            <div
              role="status"
              className={`alert-box ${toastType === 'error' ? 'alert-error' : 'alert-success'}`}
              style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 50, boxShadow: '0 12px 32px rgba(0,0,0,.18)', maxWidth: 360 }}
            >
              <CheckCircle2 size={18} /> <span>{toast}</span>
            </div>
          )}

          {/* ================= OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: 26, color: 'var(--forest-deep)', margin: 0 }}>Operations overview</h1>
                  <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 4 }}>
                    {newCount > 0 ? `${newCount} new ${newCount === 1 ? 'inquiry' : 'inquiries'} waiting for a reply.` : 'You are all caught up on inquiries.'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Link to="/admin/invoice" className="btn-primary" style={{ fontSize: 13, padding: '10px 18px' }}>
                    <FilePlus size={16} /> Generate invoice
                  </Link>
                  <Link to="/admin/invoices" className="btn-secondary" style={{ fontSize: 13, padding: '10px 18px' }}>
                    <FileText size={16} /> View invoices
                  </Link>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 18, marginBottom: 30 }}>
                {stats.map(({ label, value, icon: Icon, color, note, onClick }) => (
                  <div
                    key={label}
                    onClick={onClick}
                    onKeyDown={(e) => e.key === 'Enter' && onClick && onClick()}
                    tabIndex={onClick ? 0 : -1}
                    role={onClick ? 'button' : undefined}
                    className="card-modern"
                    style={{ padding: 20, cursor: onClick ? 'pointer' : 'default', borderLeft: `4px solid ${color}` }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--ink-muted)', fontWeight: 600 }}>{label}</span>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--forest-deep)' }}>{value}</div>
                    <span style={{ fontSize: 11, color, fontWeight: 600 }}>{note}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
                {/* Latest inquiries */}
                <div className="card-modern" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 17, color: 'var(--forest-deep)', margin: 0 }}>Latest inquiries</h3>
                    <button onClick={() => setActiveTab('inquiries')} style={{ fontSize: 12, color: 'var(--forest)', fontWeight: 700 }}>
                      View all ({inquiries.length})
                    </button>
                  </div>
                  {inquiries.length === 0 && <Empty title="No inquiries yet" hint="New requests from the storefront form will show up here." />}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {inquiries.slice(0, 3).map((inq) => {
                      const st = inq.status || 'New';
                      const stStyle = STATUS_STYLE[st] || STATUS_STYLE['New'];
                      return (
                        <button
                          key={inq.id}
                          onClick={() => setSelectedInquiry(inq)}
                          style={{ textAlign: 'left', padding: '12px 14px', background: 'var(--cream)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <b style={{ fontSize: 14, color: 'var(--forest-deep)' }}>{inq.name}</b>
                            <Chip {...stStyle}>{st}</Chip>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 4 }}>
                            {inq.businessName || inq.phone} · {inq.date}
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: 0, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {inq.message}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick price editor */}
                <div className="card-modern" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <h3 style={{ fontSize: 17, color: 'var(--forest-deep)', margin: 0 }}>Quick price editor</h3>
                    <button onClick={() => setActiveTab('products')} style={{ fontSize: 12, color: 'var(--forest)', fontWeight: 700 }}>
                      Manage all {products.length} products
                    </button>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 0 12px' }}>Press Enter to save, Esc to cancel.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {products.slice(0, 4).map((p) => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--cream)', border: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <ProductThumb product={p} size={40} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--forest-deep)' }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>per {p.unit}</div>
                          </div>
                        </div>
                        {editingPriceId === p.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <PriceInput p={p} width={72} />
                            <button onClick={() => savePrice(p)} aria-label="Save price" style={{ background: 'var(--success)', color: '#fff', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Check size={14} />
                            </button>
                            <button onClick={cancelEdit} aria-label="Cancel" style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--forest-deep)' }}>{money(p.price)}<Delta p={p} /></span>
                            <button onClick={() => startEditPrice(p)} style={{ color: 'var(--forest)', background: 'var(--white)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Edit3 size={12} /> Edit
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent orders */}
                <div className="card-modern" style={{ padding: 24, gridColumn: '1 / -1' }}>
                  <h3 style={{ fontSize: 17, color: 'var(--forest-deep)', margin: '0 0 12px' }}>Recent orders</h3>
                  {recentOrders.length === 0 ? (
                    <Empty title="No orders yet" hint="Orders placed by wholesale buyers will appear here." />
                  ) : (
                    <div className="table-responsive">
                      <table className="table-modern">
                        <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th></tr></thead>
                        <tbody>
                          {recentOrders.map((o, i) => (
                            <tr key={o.id ?? i}>
                              <td>#{o.id ?? i + 1}</td>
                              <td>{o.customerName || o.userName || o.name || '—'}</td>
                              <td>{o.date || o.createdAt || '—'}</td>
                              <td style={{ fontWeight: 700 }}>{money(o.total ?? o.grandTotal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= MANAGE PRODUCTS ================= */}
          {activeTab === 'products' && (
            <div>
              <TabHeader
                title="Manage Products"
                sub={`${filteredProductsMgr.length} of ${products.length} products`}
                onBack={() => setActiveTab('overview')}
              >
                <SearchBox value={productQuery} onChange={setProductQuery} placeholder="Search products…" />
                <select className="form-input" value={productCat} onChange={(e) => setProductCat(e.target.value)} style={{ width: 'auto' }}>
                  {['All', ...PROD_CATEGORIES].map((c) => <option key={c}>{c}</option>)}
                </select>
                <button
                  className="btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => { setShowAddProduct(true); setNewProduct(BLANK_PRODUCT); setEditingProduct(null); }}
                >
                  <Plus size={14} /> Add Product
                </button>
                <button
                  className="btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => downloadCSV('products.csv', filteredProductsMgr.map((p) => ({ name: p.name, category: p.category, unit: p.unit, price: p.price, stock: p.stock })))}
                >
                  <Download size={14} /> Export CSV
                </button>
              </TabHeader>

              {/* Add Product Form */}
              {showAddProduct && (
                <div className="card-modern" style={{ padding: 24, marginBottom: 20, border: '2px solid var(--forest)', borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 17, color: 'var(--forest-deep)' }}>➕ Add New Product</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 4 }}>Name *</label>
                      <input style={fld} value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="e.g. Cherry Tomatoes" />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 4 }}>Category</label>
                      <select style={fld} value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                        {PROD_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 4 }}>Price (₹) *</label>
                      <input style={fld} type="number" min="0" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="e.g. 150" />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 4 }}>Unit</label>
                      <select style={fld} value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}>
                        {UNITS.map((u) => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 4 }}>Emoji</label>
                      <select style={fld} value={newProduct.emoji} onChange={(e) => setNewProduct({ ...newProduct, emoji: e.target.value })}>
                        {EMOJIS.map((em) => <option key={em}>{em}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 4 }}>Stock</label>
                      <input style={fld} type="number" min="0" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} placeholder="100" />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 4 }}>Product Image</label>
                      <ImagePicker value={newProduct.image} onChange={(v) => setNewProduct({ ...newProduct, image: v })} fld={fld} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 4 }}>Description</label>
                      <textarea style={{ ...fld, resize: 'vertical', minHeight: 60 }} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Short product description…" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                    <button className="btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={handleAddProduct} disabled={savingProduct}>
                      <Save size={14} /> {savingProduct ? 'Saving…' : 'Save Product'}
                    </button>
                    <button className="btn-secondary btn-sm" onClick={() => setShowAddProduct(false)}>Cancel</button>
                  </div>
                </div>
              )}

              {filteredProductsMgr.length === 0 ? (
                <Empty title="No products found" hint="Clear the search filter or add a new product." />
              ) : (
                <div className="table-responsive">
                  <table className="table-modern">
                    <thead>
                      <tr><th>Product</th><th>Category</th><th>Price</th><th>Unit</th><th>Stock</th><th style={{ width: 200 }}>Actions</th></tr>
                    </thead>
                    <tbody>
                      {filteredProductsMgr.map((p) => (
                        <React.Fragment key={p.id}>
                          <tr>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <ProductThumb product={p} size={52} />
                                <div>
                                  <div style={{ fontWeight: 700, color: 'var(--forest-deep)' }}>{p.name}</div>
                                  {p.description && <div style={{ fontSize: 11, color: 'var(--ink-muted)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>}
                                </div>
                              </div>
                            </td>
                            <td><Chip bg="var(--sage)" fg="var(--forest-deep)">{p.category}</Chip></td>
                            <td style={{ fontWeight: 700, fontSize: 15, color: 'var(--forest-deep)' }}>{money(p.price)}</td>
                            <td>per {p.unit}</td>
                            <td>{p.stock ?? '—'}</td>
                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button
                                  className="btn-secondary btn-sm"
                                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                                  onClick={() => editingProduct === p.id ? setEditingProduct(null) : startEditProduct(p)}
                                >
                                  <Edit3 size={12} /> {editingProduct === p.id ? 'Cancel' : 'Edit'}
                                </button>
                                <button
                                  className="btn-sm"
                                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA', borderRadius: 6, padding: '4px 10px', fontWeight: 600 }}
                                  onClick={() => setConfirmDelete(p)}
                                >
                                  <Trash2 size={12} /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                          {editingProduct === p.id && (
                            <tr>
                              <td colSpan={6} style={{ background: '#F0FDF4', padding: 16 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                                  <div>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 3 }}>Name *</label>
                                    <input style={fld} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                                  </div>
                                  <div>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 3 }}>Category</label>
                                    <select style={fld} value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                                      {PROD_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 3 }}>Price (₹) *</label>
                                    <input style={fld} type="number" min="0" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                                  </div>
                                  <div>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 3 }}>Unit</label>
                                    <select style={fld} value={editForm.unit} onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}>
                                      {UNITS.map((u) => <option key={u}>{u}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 3 }}>Emoji</label>
                                    <select style={fld} value={editForm.emoji} onChange={(e) => setEditForm({ ...editForm, emoji: e.target.value })}>
                                      {EMOJIS.map((em) => <option key={em}>{em}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 3 }}>Stock</label>
                                    <input style={fld} type="number" min="0" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} />
                                  </div>
                                  <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 3 }}>Product Image</label>
                                    <ImagePicker value={editForm.image} onChange={(v) => setEditForm({ ...editForm, image: v })} fld={fld} />
                                  </div>
                                  <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: 3 }}>Description</label>
                                    <textarea style={{ ...fld, resize: 'vertical', minHeight: 50 }} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                  <button className="btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => handleUpdateProduct(p)} disabled={savingProduct}>
                                    <Check size={13} /> {savingProduct ? 'Saving…' : 'Save Changes'}
                                  </button>
                                  <button className="btn-secondary btn-sm" onClick={() => setEditingProduct(null)}><X size={13} /> Cancel</button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= USERS ================= */}
          {activeTab === 'users' && (
            <div>
              <TabHeader title="Registered wholesale users" sub={`${filteredUsers.length} of ${users.length} accounts`} onBack={() => setActiveTab('overview')}>
                <SearchBox value={userQuery} onChange={setUserQuery} placeholder="Search name, phone, business" />
                <button
                  className="btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => downloadCSV('users.csv', filteredUsers.map((u) => ({ name: u.name, phone: u.phone, email: u.email, business: u.businessName, location: u.location, registered: u.registeredDate })))}
                >
                  <Download size={14} /> Export CSV
                </button>
              </TabHeader>

              <div className="table-responsive">
                {filteredUsers.length === 0 ? (
                  <Empty title="No users match" hint="Try a different name, phone number or business." />
                ) : (
                  <table className="table-modern">
                    <thead>
                      <tr><th>Name</th><th>Contact</th><th>Business & location</th><th>Registered</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--forest-deep)' }}>{u.name}</div>
                            <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>ID #{u.id}</span>
                          </td>
                          <td>
                            <a href={`tel:${u.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={12} /> {u.phone}</a>
                            <a href={`mailto:${u.email}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-soft)' }}><Mail size={12} /> {u.email}</a>
                          </td>
                          <td>
                            <div>{u.businessName || 'Wholesale client'}</div>
                            <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{u.location || 'India'}</span>
                          </td>
                          <td>{u.registeredDate}</td>
                          <td><Chip bg="var(--success-light)" fg="#14532D">{u.status || 'Active'}</Chip></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ================= INQUIRIES ================= */}
          {activeTab === 'inquiries' && (
            <div>
              <TabHeader title="Contact inquiries" sub={`${newCount} new · ${inquiries.length} total`} onBack={() => setActiveTab('overview')}>
                <SearchBox value={inqQuery} onChange={setInqQuery} placeholder="Search name, business, message" />
                <button
                  className="btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => downloadCSV('inquiries.csv', filteredInquiries.map((i) => ({ name: i.name, business: i.businessName, phone: i.phone, email: i.email, message: i.message, date: i.date, status: statusOf(i) })))}
                >
                  <Download size={14} /> Export CSV
                </button>
              </TabHeader>

              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {['All', ...STATUSES].map((s) => {
                  const count = s === 'All' ? inquiries.length : inquiries.filter((i) => (i.status || 'New') === s).length;
                  const on = inqFilter === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setInqFilter(s)}
                      style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600, border: '1px solid var(--border)', background: on ? 'var(--forest-deep)' : 'var(--white)', color: on ? '#fff' : 'var(--ink-soft)' }}
                    >
                      {s} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="table-responsive">
                {filteredInquiries.length === 0 ? (
                  <Empty title="Nothing here" hint="No inquiries match this search or status." />
                ) : (
                  <table className="table-modern">
                    <thead>
                      <tr><th>From</th><th>Message</th><th>Date</th><th>Status</th><th /></tr>
                    </thead>
                    <tbody>
                      {filteredInquiries.map((inq) => {
                        const st = inq.status || 'New';
                        const stStyle = STATUS_STYLE[st] || STATUS_STYLE['New'];
                        return (
                          <tr key={inq.id}>
                            <td>
                              <div style={{ fontWeight: 700, color: 'var(--forest-deep)' }}>{inq.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{inq.businessName || inq.phone}</div>
                            </td>
                            <td style={{ maxWidth: 320 }}>
                              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.4, color: 'var(--ink-soft)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{inq.message}</p>
                            </td>
                            <td>{inq.date}</td>
                            <td>
                              <select
                                value={st}
                                onChange={(e) => handleInqStatus(inq, e.target.value)}
                                aria-label={`Status for ${inq.name}`}
                                style={{ background: stStyle.bg, color: stStyle.fg, border: 'none', borderRadius: 'var(--radius-full)', padding: '4px 10px', fontSize: 12, fontWeight: 700 }}
                              >
                                {STATUSES.map((s) => <option key={s}>{s}</option>)}
                              </select>
                            </td>
                            <td>
                              <button onClick={() => setSelectedInquiry(inq)} className="btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                                <Eye size={13} /> Open
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= INQUIRY MODAL ================= */}
      {selectedInquiry && (() => {
        const st = selectedInquiry.status || 'New';
        const stStyle = STATUS_STYLE[st] || STATUS_STYLE['New'];
        return (
          <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 20, color: 'var(--forest-deep)', margin: 0 }}>{selectedInquiry.name}</h3>
                <Chip {...stStyle}>{st}</Chip>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, marginBottom: 18 }}>
                <div><b>Business:</b> {selectedInquiry.businessName || 'N/A'}</div>
                <div><b>Phone:</b> {selectedInquiry.phone}</div>
                <div><b>Email:</b> {selectedInquiry.email || 'N/A'}</div>
                <div><b>Received:</b> {selectedInquiry.date}</div>
                <div style={{ background: 'var(--cream)', padding: 12, borderRadius: 'var(--radius-md)', lineHeight: 1.5 }}>{selectedInquiry.message}</div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleInqStatus(selectedInquiry, s)}
                    style={{ padding: '5px 12px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 700, border: '1px solid var(--border)', background: st === s ? (STATUS_STYLE[s] || {}).bg : 'var(--white)', color: st === s ? (STATUS_STYLE[s] || {}).fg : 'var(--ink-soft)' }}
                  >
                    Mark {s.toLowerCase()}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={() => setSelectedInquiry(null)} className="btn-secondary btn-sm">Close</button>
                <a href={`tel:${selectedInquiry.phone}`} className="btn-secondary btn-sm">Call</a>
                <a
                  href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${selectedInquiry.name}, this is ABCH Traders following up on your produce inquiry.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary btn-sm"
                  onClick={() => handleInqStatus(selectedInquiry, 'In Review')}
                >
                  Reply on WhatsApp
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" style={{ maxWidth: 420 }}>
            <h3 style={{ fontSize: 18, color: '#991B1B', margin: '0 0 12px' }}>Delete Product?</h3>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 20 }}>
              Are you sure you want to delete <b style={{ color: 'var(--forest-deep)' }}>{confirmDelete.name}</b>? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn-secondary btn-sm" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="btn-sm"
                style={{ background: '#DC2626', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => handleDeleteProduct(confirmDelete)}
                disabled={deletingId === confirmDelete.id}
              >
                <Trash2 size={13} /> {deletingId === confirmDelete.id ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};