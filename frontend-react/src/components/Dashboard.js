// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { getInventory } from '../api';
import InventoryManager from './InventoryManager';

function Dashboard({ user }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getInventory();
      // Ensure we're setting an array
      setInventory(Array.isArray(response) ? response : response.items || []);
    } catch (err) {
      setError('Failed to fetch inventory. Please try again.');
      console.error('Error fetching inventory:', err);
      setInventory([]); // Ensure inventory is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleNewItem = (newItem) => {
    setInventory(prev => Array.isArray(prev) ? [...prev, newItem] : [newItem]);
  };

  if (loading) {
    return <div>Loading inventory...</div>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={fetchInventory}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <InventoryManager user={user} onNewItem={handleNewItem} />
      
      <h3>Current Inventory</h3>
      {!Array.isArray(inventory) || inventory.length === 0 ? (
        <p>No items in inventory</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item._id || Math.random()}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.category}</td>
                <td>${(item.price || 0).toFixed(2)}</td>
                <td style={{ 
                  color: item.quantity <= item.threshold ? 'red' : 'green' 
                }}>
                  {item.quantity <= item.threshold ? 'Low Stock' : 'In Stock'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
