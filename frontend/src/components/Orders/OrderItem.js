import React from 'react';
import { format } from 'date-fns';

const OrderItem = ({ order, onCancel, onUpdateStatus, isAdmin }) => {
  const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy HH:mm');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffa500',
      processing: '#4169e1',
      shipped: '#32cd32',
      delivered: '#008000',
      cancelled: '#ff0000'
    };
    return colors[status] || '#000000';
  };

  return (
    <div className="order-item">
      <div className="order-header">
        <h3>Order #{order._id.slice(-6)}</h3>
        <span 
          className="order-status"
          style={{ color: getStatusColor(order.status) }}
        >
          {order.status.toUpperCase()}
        </span>
      </div>

      <div className="order-details">
        <div className="order-info">
          <p>Ordered on: {formatDate(order.createdAt)}</p>
          <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
          <p>Payment Method: {order.paymentMethod.replace('_', ' ')}</p>
        </div>

        <div className="order-items">
          <h4>Items:</h4>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.product.name} - {item.quantity} x ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>

        <div className="shipping-info">
          <h4>Shipping Address:</h4>
          <p>
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
            {order.shippingAddress.country}
          </p>
        </div>
      </div>

      <div className="order-actions">
        {order.status === 'pending' && (
          <button
            className="cancel-button"
            onClick={() => onCancel(order._id)}
          >
            Cancel Order
          </button>
        )}
        
        {isAdmin && (
          <div className="admin-actions">
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(order._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderItem; 