import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Printer, CheckCircle2, FileText } from 'lucide-react';

export const InvoiceForm = ({ onCreated }) => {
  const { products, addInvoice } = useApp();

  // Generate an auto invoice number
  const [invoiceNumber] = useState(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);

  // Customer details
  const [customerName, setCustomerName] = useState('Green Harvest Wholesale Mart');
  const [customerPhone, setCustomerPhone] = useState('+91 98401 23456');
  const [customerEmail, setCustomerEmail] = useState('accounts@greenharvest.in');
  const [customerAddress, setCustomerAddress] = useState('Shop #14, Wholesale Yard, Koyambedu, Chennai - 600092');

  // Items
  const [items, setItems] = useState([
    {
      id: 1,
      productName: products[0]?.name || 'Exotic Green Asparagus',
      quantity: 10,
      price: products[0]?.price || 320,
      total: (products[0]?.price || 320) * 10
    },
    {
      id: 2,
      productName: products[1]?.name || 'Farm Fresh Broccoli',
      quantity: 25,
      price: products[1]?.price || 150,
      total: (products[1]?.price || 150) * 25
    }
  ]);

  const [taxRate, setTaxRate] = useState(5);
  const [shipping, setShipping] = useState(250);
  const [successMessage, setSuccessMessage] = useState(null);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const taxAmount = Math.round((subtotal * (Number(taxRate) / 100)) * 100) / 100;
  const grandTotal = subtotal + taxAmount + (Number(shipping) || 0);

  const handleProductSelect = (index, prodName) => {
    const matched = products.find(p => p.name === prodName);
    const updated = [...items];
    const price = matched ? matched.price : updated[index].price;
    const qty = updated[index].quantity;
    updated[index] = {
      ...updated[index],
      productName: prodName,
      price: price,
      total: price * qty
    };
    setItems(updated);
  };

  const handleQtyChange = (index, qty) => {
    const val = Math.max(1, parseFloat(qty) || 0);
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      quantity: val,
      total: val * updated[index].price
    };
    setItems(updated);
  };

  const handlePriceChange = (index, price) => {
    const val = Math.max(0, parseFloat(price) || 0);
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      price: val,
      total: updated[index].quantity * val
    };
    setItems(updated);
  };

  const addItem = () => {
    const defaultProd = products[items.length % products.length] || { name: 'Item', price: 100 };
    setItems(prev => [
      ...prev,
      {
        id: Date.now(),
        productName: defaultProd.name,
        quantity: 10,
        price: defaultProd.price,
        total: defaultProd.price * 10
      }
    ]);
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerateInvoice = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Please enter a customer name.');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one item.');
      return;
    }

    const created = addInvoice({
      invoiceNumber,
      date: invoiceDate,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      items,
      subtotal,
      taxRate,
      taxAmount,
      shipping: Number(shipping) || 0,
      grandTotal,
      status: 'Paid'
    });

    setSuccessMessage(`Invoice ${invoiceNumber} created and saved successfully!`);
    if (onCreated) onCreated(created);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {successMessage && (
        <div className="alert-box alert-success no-print" style={{ marginBottom: '24px' }}>
          <CheckCircle2 size={20} />
          <div style={{ flexGrow: 1 }}>
            <b>Success!</b> {successMessage}
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            style={{ fontWeight: '700', color: 'inherit' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Invoice Form / Preview Container */}
      <form onSubmit={handleGenerateInvoice} className="printable-area">
        <div className="card-modern" style={{ padding: '36px', border: '1px solid var(--border)' }}>
          
          {/* Invoice Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid var(--forest)',
            paddingBottom: '24px',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--forest-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img src="/images/LOGO.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                <h1 style={{ fontSize: '24px', color: 'var(--forest-deep)', margin: 0 }}>
                  ABCH TRADERS PVT LTD
                </h1>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                Central Wholesale Yard, Koyambedu Logistics Hub, Chennai - 600092<br />
                GSTIN: 33AAACB2026M1ZV • FSSAI: 12423002000512<br />
                Email: billing@abchtraders.com • Tel: +91 98401 23456
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '28px',
                fontWeight: '700',
                color: 'var(--gold-deep)',
                letterSpacing: '0.04em'
              }}>
                TAX INVOICE
              </div>
              <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--forest-deep)' }}>
                <b>Invoice #:</b> <span style={{ fontFamily: 'monospace', fontSize: '15px' }}>{invoiceNumber}</span>
              </div>
              <div style={{ marginTop: '4px', fontSize: '14px', color: 'var(--ink-soft)' }}>
                <b>Date:</b> {invoiceDate}
              </div>
            </div>
          </div>

          {/* Customer & Invoice Meta Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            backgroundColor: 'var(--cream)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '28px'
          }}>
            <div>
              <h4 style={{ fontSize: '14px', color: 'var(--forest-deep)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Billed To (Customer Details)
              </h4>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>Customer / Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer or Business Name"
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91..."
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@..."
                  />
                </div>
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>Billing Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Delivery / Billing Address"
                />
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', color: 'var(--forest-deep)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Invoice Parameters
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>Invoice Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>GST Rate (%)</label>
                  <select
                    className="form-select"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                  >
                    <option value={0}>0% (Tax Exempt)</option>
                    <option value={5}>5% (Fresh Produce GST)</option>
                    <option value={12}>12% (Standard)</option>
                    <option value={18}>18% (Processed)</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>Cold Chain Freight / Shipping (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                  min="0"
                />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '8px' }}>
                Payment Terms: Net 15 days • Bank Transfer / Cheque payable to ABCH Traders
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '15px', color: 'var(--forest-deep)', margin: 0 }}>
                Line Items
              </h4>
              <button
                type="button"
                onClick={addItem}
                className="btn-secondary btn-sm no-print"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} /> Add Line Item
              </button>
            </div>

            <div className="table-responsive">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>Product / Description</th>
                    <th style={{ width: '120px' }}>Qty (kg/pcs)</th>
                    <th style={{ width: '130px' }}>Unit Price (₹)</th>
                    <th style={{ width: '130px', textAlign: 'right' }}>Total (₹)</th>
                    <th style={{ width: '50px' }} className="no-print">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '600', color: 'var(--ink-muted)' }}>{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          list="product-suggestions"
                          value={item.productName}
                          onChange={(e) => handleProductSelect(index, e.target.value)}
                          placeholder="Select or enter item name"
                          style={{ padding: '8px 12px', fontSize: '13px' }}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          step="any"
                          className="form-input"
                          value={item.quantity}
                          onChange={(e) => handleQtyChange(index, e.target.value)}
                          style={{ padding: '8px 12px', fontSize: '13px' }}
                          required
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>₹</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            className="form-input"
                            value={item.price}
                            onChange={(e) => handlePriceChange(index, e.target.value)}
                            style={{ padding: '8px 12px', fontSize: '13px' }}
                            required
                          />
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '700', fontSize: '14px', color: 'var(--forest-deep)' }}>
                        ₹{item.total.toLocaleString()}
                      </td>
                      <td className="no-print" style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={items.length <= 1}
                          style={{
                            color: items.length <= 1 ? 'var(--ink-muted)' : 'var(--danger)',
                            opacity: items.length <= 1 ? 0.4 : 1,
                            padding: '4px'
                          }}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Datalist for fast item suggestions */}
            <datalist id="product-suggestions">
              {products.map(p => (
                <option key={p.id} value={p.name}>₹{p.price} / {p.unit}</option>
              ))}
            </datalist>
          </div>

          {/* Totals Summary */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '360px',
              backgroundColor: 'var(--cream)',
              padding: '18px 22px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: 'var(--ink-soft)' }}>Subtotal:</span>
                <b>₹{subtotal.toLocaleString()}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: 'var(--ink-soft)' }}>Tax ({taxRate}% GST):</span>
                <b>₹{taxAmount.toLocaleString()}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                <span style={{ color: 'var(--ink-soft)' }}>Shipping / Freight:</span>
                <b>₹{Number(shipping).toLocaleString()}</b>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '2px solid var(--forest)',
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--forest-deep)'
              }}>
                <span>Grand Total:</span>
                <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-deep)' }}>
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="no-print" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border)',
            paddingTop: '24px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
              Phase 1: Invoices are stored in React state & can be printed immediately.
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={handlePrint}
                className="btn-secondary"
              >
                <Printer size={16} /> Print / Save as PDF
              </button>

              <button
                type="submit"
                id="generate-invoice-btn"
                className="btn-primary"
              >
                <FileText size={16} /> Generate Invoice
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};
