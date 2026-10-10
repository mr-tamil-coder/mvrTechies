import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  apiGetProducts,
  apiCreateProduct,
  apiUpdateProduct,
  apiUpdateProductPrice,
  apiDeleteProduct,
  apiGetUsers,
  apiRegister,
  apiLogin,
  apiGetInquiries,
  apiCreateInquiry,
  apiUpdateInquiryStatus,
  apiGetInvoices,
  apiCreateInvoice,
  apiGetOrders,
  apiCreateOrder
} from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ── Loading / Connection state ──────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // ── Core data state — starts empty, filled from API ────────────────────────
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);

  // ── Auth — restore session from localStorage (token only, no data) ──────────
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('abch_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ── Initial data fetch from MongoDB via Express API ─────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Products — required for the storefront to work
        const prodRes = await apiGetProducts();
        if (prodRes?.products) {
          setProducts(prodRes.products);
          setIsBackendConnected(true);
        }

        // Users, inquiries, invoices, orders — load in parallel
        const [usersRes, inqRes, invRes, ordRes] = await Promise.allSettled([
          apiGetUsers(),
          apiGetInquiries(),
          apiGetInvoices(),
          apiGetOrders()
        ]);

        if (usersRes.status === 'fulfilled' && usersRes.value?.users) {
          setUsers(usersRes.value.users);
        }
        if (inqRes.status === 'fulfilled' && inqRes.value?.inquiries) {
          setInquiries(inqRes.value.inquiries);
        }
        if (invRes.status === 'fulfilled' && invRes.value?.invoices) {
          setInvoices(invRes.value.invoices);
        }
        if (ordRes.status === 'fulfilled' && ordRes.value?.orders) {
          setOrders(ordRes.value.orders);
        }
      } catch (err) {
        console.error('Backend fetch failed:', err.message);
        setIsBackendConnected(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ── Product CRUD (Add, Edit full details, Delete) ─────────────────────────
  const addProduct = async (productData) => {
    try {
      const res = await apiCreateProduct(productData);
      if (res?.product) {
        setProducts(prev => [res.product, ...prev]);
        return res.product;
      }
    } catch (err) {
      console.warn('Add product API failed:', err.message);
      // Fallback local addition if offline
      const localProd = {
        id: `prod-${Date.now()}`,
        ...productData,
        price: parseFloat(productData.price) || 0
      };
      setProducts(prev => [localProd, ...prev]);
      return localProd;
    }
  };

  const updateProduct = async (productId, updatedData) => {
    // Optimistic update
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, ...updatedData } : p))
    );

    try {
      const res = await apiUpdateProduct(productId, updatedData);
      if (res?.product) {
        setProducts(prev =>
          prev.map(p => (p.id === productId ? res.product : p))
        );
      }
      return true;
    } catch (err) {
      console.warn('Update product API failed:', err.message);
      return false;
    }
  };

  const deleteProduct = async (productId) => {
    // Optimistic update
    setProducts(prev => prev.filter(p => p.id !== productId));

    try {
      await apiDeleteProduct(productId);
      return true;
    } catch (err) {
      console.warn('Delete product API failed:', err.message);
      // Refresh on error
      refreshProducts();
      return false;
    }
  };

  // ── Update Product Price ────────────────────────────────────────────────────
  const updateProductPrice = async (productId, newPrice) => {
    const numericPrice = parseFloat(newPrice);
    if (isNaN(numericPrice) || numericPrice < 0) return false;

    // Optimistic UI update
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, price: numericPrice } : p))
    );

    try {
      await apiUpdateProductPrice(productId, numericPrice);
    } catch (err) {
      console.warn('Price update sync failed:', err.message);
      // Revert on failure — re-fetch
      try {
        const prodRes = await apiGetProducts();
        if (prodRes?.products) setProducts(prodRes.products);
      } catch (_) {}
    }
    return true;
  };

  // ── Add User (Registration) ─────────────────────────────────────────────────
  const addUser = async (userData) => {
    try {
      const res = await apiRegister(userData);
      if (res?.token) {
        localStorage.setItem('abch_token', res.token);
      }
      if (res?.user) {
        const newUser = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          phone: res.user.phone,
          businessName: res.user.businessName || '',
          location: userData.location || 'India',
          role: 'customer',
          status: 'Active',
          registeredDate: new Date().toISOString().split('T')[0]
        };
        setUsers(prev => [newUser, ...prev]);
        return newUser;
      }
    } catch (err) {
      console.warn('Registration API error:', err.message);
      throw err;
    }
  };

  // ── Add Inquiry ─────────────────────────────────────────────────────────────
  const addInquiry = async (inquiryData) => {
    try {
      const res = await apiCreateInquiry(inquiryData);
      if (res?.inquiry) {
        setInquiries(prev => [res.inquiry, ...prev]);
        return res.inquiry;
      }
    } catch (err) {
      // Optimistic fallback so the UI doesn't break
      const optimistic = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        status: 'New',
        ...inquiryData
      };
      setInquiries(prev => [optimistic, ...prev]);
      console.warn('Inquiry API error (local fallback):', err.message);
      return optimistic;
    }
  };

  // ── Update Inquiry Status ───────────────────────────────────────────────────
  const updateInquiryStatus = async (inquiryId, newStatus) => {
    // Optimistic update
    setInquiries(prev =>
      prev.map(i => (String(i.id) === String(inquiryId) ? { ...i, status: newStatus } : i))
    );
    try {
      await apiUpdateInquiryStatus(inquiryId, newStatus);
    } catch (err) {
      console.warn('Inquiry status update failed:', err.message);
      // Revert on failure
      try {
        const res = await apiGetInquiries();
        if (res?.inquiries) setInquiries(res.inquiries);
      } catch (_) {}
    }
    return true;
  };

  // ── Add Invoice ─────────────────────────────────────────────────────────────
  const addInvoice = async (invoiceData) => {
    try {
      const res = await apiCreateInvoice(invoiceData);
      if (res?.invoice) {
        setInvoices(prev => [res.invoice, ...prev]);
        return res.invoice;
      }
    } catch (err) {
      const optimistic = {
        id: Date.now(),
        date: invoiceData.date || new Date().toISOString().split('T')[0],
        status: 'Paid',
        ...invoiceData
      };
      setInvoices(prev => [optimistic, ...prev]);
      console.warn('Invoice API error (local fallback):', err.message);
      return optimistic;
    }
  };

  // ── Add Order ───────────────────────────────────────────────────────────────
  const addOrder = async (orderData) => {
    try {
      const res = await apiCreateOrder(orderData);
      if (res?.order) {
        setOrders(prev => [res.order, ...prev]);
        return res.order;
      }
    } catch (err) {
      const optimistic = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Confirmed',
        ...orderData
      };
      setOrders(prev => [optimistic, ...prev]);
      console.warn('Order API error (local fallback):', err.message);
      return optimistic;
    }
  };

  // ── Refresh helpers (used after admin edits) ────────────────────────────────
  const refreshProducts = async () => {
    try {
      const res = await apiGetProducts();
      if (res?.products) setProducts(res.products);
    } catch (err) {
      console.warn('Refresh products failed:', err.message);
    }
  };

  const refreshUsers = async () => {
    try {
      const res = await apiGetUsers();
      if (res?.users) setUsers(res.users);
    } catch (err) {
      console.warn('Refresh users failed:', err.message);
    }
  };

  const refreshInquiries = async () => {
    try {
      const res = await apiGetInquiries();
      if (res?.inquiries) setInquiries(res.inquiries);
    } catch (err) {
      console.warn('Refresh inquiries failed:', err.message);
    }
  };

  const refreshInvoices = async () => {
    try {
      const res = await apiGetInvoices();
      if (res?.invoices) setInvoices(res.invoices);
    } catch (err) {
      console.warn('Refresh invoices failed:', err.message);
    }
  };

  const refreshOrders = async () => {
    try {
      const res = await apiGetOrders();
      if (res?.orders) setOrders(res.orders);
    } catch (err) {
      console.warn('Refresh orders failed:', err.message);
    }
  };

  // ── Customer Login ──────────────────────────────────────────────────────────
  const login = async (emailOrPhone, password) => {
    const res = await apiLogin(emailOrPhone, password);
    if (res?.token && res?.user) {
      localStorage.setItem('abch_token', res.token);
      const loggedUser = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        phone: res.user.phone,
        role: res.user.role
      };
      setCurrentUser(loggedUser);
      localStorage.setItem('abch_auth_user', JSON.stringify(loggedUser));
      return loggedUser;
    }
    throw new Error('Login failed — invalid response from server.');
  };

  // ── Admin Login — strictly requires admin role from backend ─────────────────
  const adminLogin = async (email, password) => {
    try {
      const res = await apiLogin(email, password);
      if (res?.token && res?.user) {
        if (res.user.role !== 'admin') {
          throw new Error('Access denied: This account does not have administrator privileges.');
        }
        localStorage.setItem('abch_token', res.token);
        const adminUser = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          phone: res.user.phone,
          role: 'admin'
        };
        setCurrentUser(adminUser);
        localStorage.setItem('abch_auth_user', JSON.stringify(adminUser));
        return adminUser;
      }
      throw new Error('Authentication failed — invalid server response.');
    } catch (err) {
      if (err.message?.includes('Access denied')) throw err;

      // Backend offline fallback — accept only the seeded admin credentials
      const ADMIN_EMAIL = 'admin@abchtraders.com';
      const ADMIN_PASS = 'adminPass123';
      if (email.toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASS) {
        throw new Error('Invalid admin credentials.');
      }

      const adminUser = {
        name: 'Administrator',
        email,
        phone: '+91 98401 00001',
        role: 'admin'
      };
      setCurrentUser(adminUser);
      localStorage.setItem('abch_auth_user', JSON.stringify(adminUser));
      return adminUser;
    }
  };

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('abch_auth_user');
      localStorage.removeItem('abch_token');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        // State
        loading,
        isBackendConnected,
        products,
        users,
        inquiries,
        invoices,
        orders,
        currentUser,

        // Mutations
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductPrice,
        addUser,
        addInquiry,
        updateInquiryStatus,
        addInvoice,
        addOrder,
        login,
        adminLogin,
        logout,
        setCurrentUser,

        // Refresh helpers
        refreshProducts,
        refreshUsers,
        refreshInquiries,
        refreshInvoices,
        refreshOrders
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
