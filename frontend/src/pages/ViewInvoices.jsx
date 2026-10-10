import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';
import { AdminNavbar } from '../components/AdminNavbar';
import { 
  FilePlus, 
  Search, 
  Calendar, 
  Eye, 
  Printer, 
  FileText, 
  ArrowLeft,
  X
} from 'lucide-react';

export const ViewInvoices = () => {
  const { invoices } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Filter invoices by search term (number or customer) and date
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (inv.customerEmail && inv.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDate = !dateFilter || inv.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  const handlePrint = (inv) => {
    setSelectedInvoice(inv);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--cream)' }}>
      <Sidebar />

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminNavbar title="Invoice Registry" />

        <main style={{ padding: '32px 36px', flexGrow: 1 }}>
          
          {/* Header & New Invoice Button */}
          <div className="no-print" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Link to="/admin" style={{ color: 'var(--ink-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowLeft size={14} /> Admin
                </Link>
                <span style={{ color: 'var(--ink-muted)' }}>/</span>
                <span style={{ fontSize: '13px', color: 'var(--forest-deep)', fontWeight: '600' }}>Invoices</span>
              </div>
              <h1 style={{ fontSize: '24px', color: 'var(--forest-deep)', margin: 0 }}>
                Wholesale Invoices ({filteredInvoices.length})
              </h1>
            </div>

            <Link
              to="/admin/invoice"
              id="new-invoice-btn"
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FilePlus size={16} /> + New Invoice
            </Link>
          </div>

          {/* Search & Date Filter Bar */}
          <div className="no-print card-modern" style={{
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {/* Search Input */}
            <div style={{ flexGrow: 1, minWidth: '240px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by invoice number or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '38px', fontSize: '13px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--ink-muted)' }} />
            </div>

            {/* Date Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  className="form-input"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  style={{ paddingLeft: '36px', fontSize: '13px' }}
                />
                <Calendar size={15} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--ink-muted)' }} />
              </div>

              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="btn-secondary btn-sm"
                  style={{ padding: '8px 12px', fontSize: '12px' }}
                >
                  Clear Date
                </button>
              )}
            </div>
          </div>

          {/* Invoices Table */}
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-muted)' }}>
                      No invoices found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td>
                        <span style={{
                          fontFamily: 'monospace',
                          fontWeight: '700',
                          fontSize: '14px',
                          color: 'var(--forest-deep)',
                          backgroundColor: 'var(--cream)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-light)'
                        }}>
                          {inv.invoiceNumber}
                        </span>
                      </td>
                      <td>{inv.date}</td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--forest-deep)' }}>
                          {inv.customerName}
                        </div>
                        {inv.customerPhone && (
                          <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                            {inv.customerPhone}
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: '700', fontSize: '15px', color: 'var(--forest-deep)' }}>
                        ₹{Number(inv.grandTotal).toLocaleString()}
                      </td>
                      <td>
                        <span style={{
                          backgroundColor: inv.status === 'Paid' ? 'var(--success-light)' : 'var(--warning-light)',
                          color: inv.status === 'Paid' ? '#14532D' : '#92400E',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '11px',
                          fontWeight: '700'
                        }}>
                          {inv.status || 'Paid'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="btn-secondary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="View Invoice"
                          >
                            <Eye size={13} /> View
                          </button>
                          <button
                            onClick={() => handlePrint(inv)}
                            className="btn-secondary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="Print Invoice"
                          >
                            <Printer size={13} /> Print
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </main>
      </div>

      {/* Invoice Viewer / Print Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '720px', padding: '36px' }}
          >
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <button
                onClick={() => window.print()}
                className="btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={14} /> Print Invoice
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--cream)',
                  color: 'var(--ink)'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="printable-area" style={{ border: '1px solid var(--border)', padding: '28px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--white)' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--forest)', paddingBottom: '20px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', color: 'var(--forest-deep)', margin: '0 0 4px' }}>
                    ABCH TRADERS PVT LTD
                  </h2>
                  <p style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.4 }}>
                    Central Wholesale Yard, Koyambedu Logistics Hub, Chennai - 600092<br />
                    GSTIN: 33AAACB2026M1ZV • Tel: +91 98401 23456
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--gold-deep)', fontFamily: 'var(--font-serif)' }}>
                    INVOICE
                  </div>
                  <div style={{ fontSize: '13px', marginTop: '4px' }}>
                    <b>#{selectedInvoice.invoiceNumber}</b>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>
                    Date: {selectedInvoice.date}
                  </div>
                </div>
              </div>

              {/* Billed To */}
              <div style={{ backgroundColor: 'var(--cream)', padding: '14px 18px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px' }}>
                <div style={{ color: 'var(--ink-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>
                  Billed To:
                </div>
                <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--forest-deep)' }}>
                  {selectedInvoice.customerName}
                </div>
                <div>{selectedInvoice.customerPhone} • {selectedInvoice.customerEmail}</div>
                {selectedInvoice.customerAddress && <div>{selectedInvoice.customerAddress}</div>}
              </div>

              {/* Items List */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', background: 'var(--cream-dark)' }}>
                    <th style={{ padding: '8px' }}>#</th>
                    <th style={{ padding: '8px' }}>Item Description</th>
                    <th style={{ padding: '8px' }}>Qty</th>
                    <th style={{ padding: '8px' }}>Rate</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '10px 8px' }}>{idx + 1}</td>
                      <td style={{ padding: '10px 8px', fontWeight: '600' }}>{item.productName || item.name}</td>
                      <td style={{ padding: '10px 8px' }}>{item.quantity}</td>
                      <td style={{ padding: '10px 8px' }}>₹{item.price}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: '700' }}>
                        ₹{(item.total || item.quantity * item.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '240px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal:</span>
                    <b>₹{Number(selectedInvoice.subtotal).toLocaleString()}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tax ({selectedInvoice.taxRate || 5}% GST):</span>
                    <b>₹{Number(selectedInvoice.taxAmount).toLocaleString()}</b>
                  </div>
                  {selectedInvoice.shipping > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Freight / Delivery:</span>
                      <b>₹{Number(selectedInvoice.shipping).toLocaleString()}</b>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '2px solid var(--forest)',
                    paddingTop: '6px',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: 'var(--forest-deep)'
                  }}>
                    <span>Grand Total:</span>
                    <span style={{ color: 'var(--gold-deep)' }}>
                      ₹{Number(selectedInvoice.grandTotal).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
