import React, { useState, useEffect } from 'react';
import './CurrentInventory.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const CurrentInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/inventory`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInventory(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  if (loading) {
    return <div className="loading">Loading inventory...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchInventory}>Retry</button>
      </div>
    );
  }

  if (!inventory.length) {
    return <div className="no-items">No items in inventory</div>;
  }

  return (
    <div className="inventory-container">
      <h2>Current Inventory</h2>
      <div className="inventory-grid">
        {inventory.map((item) => (
          <div key={item._id} className="inventory-item">
            <h3>{item.name}</h3>
            <p className="description">{item.description}</p>
            <div className="item-details">
              <span>Price: ${item.price}</span>
              <span>Quantity: {item.quantity} {item.unit}</span>
              <span>Category: {item.category}</span>
              {item.quantity <= item.minStockLevel && (
                <span className="low-stock">Low Stock!</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <button onClick={fetchInventory} className="refresh-button">
        Refresh Inventory
      </button>
    </div>
  );
};

export default CurrentInventory; 