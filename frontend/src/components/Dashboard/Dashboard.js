import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import InventoryList from './InventoryList';
import AddInventoryForm from './AddInventoryForm';

const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(response.data.inventory);
    } catch (err) {
      setError('Failed to fetch inventory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/inventory',
        newItem,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setInventory([response.data.item, ...inventory]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item');
    }
  };

  const handleUpdateQuantity = async (id, adjustment) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:5000/api/inventory/${id}/quantity`,
        { adjustment },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setInventory(inventory.map(item => 
        item._id === id ? response.data.item : item
      ));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update quantity');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}!</h1>
      <div className="dashboard-content">
        <div className="inventory-section">
          <h2>Add New Item</h2>
          <AddInventoryForm onAdd={handleAddItem} />
        </div>
        <div className="inventory-section">
          <h2>Your Inventory</h2>
          <InventoryList 
            items={inventory}
            onUpdateQuantity={handleUpdateQuantity}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 