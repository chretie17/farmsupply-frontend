// AdminOrders.jsx

import React, { useState, useEffect } from 'react';
import api from '../../api'; // Ensure you have a configured API instance to handle requests
import { Download } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/orders'); // Fetch all orders
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/admin/orders/invoice/${orderId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert('Failed to download invoice. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-red-500 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Orders</h1>
      <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Order ID</th>
            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Product Name</th>
            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Farmer Name</th>
            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Quantity</th>
            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Total Price (RWF)</th>
            <th className="py-3 px-6 text-center text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.OrderId} className="border-b hover:bg-gray-50">
              <td className="py-3 px-6">{order.OrderId}</td>
              <td className="py-3 px-6">{order.ProductName}</td>
              <td className="py-3 px-6">{order.FarmerName}</td>
              <td className="py-3 px-6">{order.Quantity}</td>
              <td className="py-3 px-6">{order.TotalPrice}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => handleDownloadInvoice(order.OrderId)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none flex items-center"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Invoice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
