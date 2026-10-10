import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';
import { GenerateInvoice } from './pages/GenerateInvoice';
import { ViewInvoices } from './pages/ViewInvoices';

// Protected route wrappers
import { AdminRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Dashboard — requires login (handled inside Dashboard) */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin Routes — separate from customer login */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/invoice" element={<AdminRoute><GenerateInvoice /></AdminRoute>} />
            <Route path="/admin/invoices" element={<AdminRoute><ViewInvoices /></AdminRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AppProvider>
  );
}

export default App;
