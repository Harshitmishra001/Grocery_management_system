import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import OrderItem from './OrderItem';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove cancelled order from state
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel order');
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    if (user.role !== 'admin') return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Update order in state
      setOrders(orders.map(order => 
        order._id === orderId ? response.data.order : order
      ));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update order status');
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <OrderItem
              key={order._id}
              order={order}
              onCancel={handleCancelOrder}
              onUpdateStatus={handleUpdateStatus}
              isAdmin={user.role === 'admin'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList; 