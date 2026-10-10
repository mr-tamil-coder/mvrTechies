import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { AdminNavbar } from '../components/AdminNavbar';
import { InvoiceForm } from '../components/InvoiceForm';
import { ArrowLeft, FileText } from 'lucide-react';

export const GenerateInvoice = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--cream)' }}>
      <Sidebar />

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminNavbar title="Create Tax Invoice" />

        <main style={{ padding: '32px 36px', flexGrow: 1 }}>
          <div className="no-print" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/admin" className="btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={14} /> Back to Dashboard
              </Link>
              <h2 style={{ fontSize: '22px', color: 'var(--forest-deep)', margin: 0 }}>
                Generate Fresh Produce Invoice
              </h2>
            </div>

            <Link to="/admin/invoices" className="btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} /> View All Saved Invoices
            </Link>
          </div>

          {/* Reusable Invoice Form */}
          <InvoiceForm />
        </main>
      </div>
    </div>
  );
};
