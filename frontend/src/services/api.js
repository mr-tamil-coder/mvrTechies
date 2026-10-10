const API_BASE_URL = 'http://localhost:5000/api';

// Helper for HTTP requests
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('abch_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (error) {
    console.warn(`API call failed for ${endpoint}:`, error.message);
    throw error;
  }
};

// 1. Products API
export const apiGetProducts = () => request('/products');
export const apiCreateProduct = (productData) =>
  request('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  });
export const apiUpdateProduct = (id, productData) =>
  request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  });
export const apiUpdateProductPrice = (id, price) =>
  request(`/products/${id}/price`, {
    method: 'PUT',
    body: JSON.stringify({ price })
  });
export const apiDeleteProduct = (id) =>
  request(`/products/${id}`, {
    method: 'DELETE'
  });

// 2. Auth & Users API
export const apiRegister = (userData) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });

export const apiLogin = (emailOrPhone, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ emailOrPhone, password })
  });

export const apiGetUsers = () => request('/auth/users');

// 3. Inquiries API
export const apiGetInquiries = () => request('/inquiries');
export const apiCreateInquiry = (inquiryData) =>
  request('/inquiries', {
    method: 'POST',
    body: JSON.stringify(inquiryData)
  });
export const apiUpdateInquiryStatus = (id, status) =>
  request(`/inquiries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });

// 4. Invoices API
export const apiGetInvoices = (search = '', date = '') => {
  const query = new URLSearchParams();
  if (search) query.append('search', search);
  if (date) query.append('date', date);
  const qStr = query.toString() ? `?${query.toString()}` : '';
  return request(`/invoices${qStr}`);
};

export const apiCreateInvoice = (invoiceData) =>
  request('/invoices', {
    method: 'POST',
    body: JSON.stringify(invoiceData)
  });

// 5. Orders API
export const apiGetOrders = () => request('/orders');
export const apiCreateOrder = (orderData) =>
  request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
