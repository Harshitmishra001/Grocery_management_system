// src/components/InventoryManager.js
import React, { useState, useEffect } from 'react';
import { getInventory, addInventoryItem } from '../api';
import './InventoryManager.css';

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
    threshold: '',
    unit: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const { inventory } = await getInventory();
      setInventory(inventory);
    } catch (err) {
      setError('Failed to load inventory');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name?.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.description?.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      const itemData = {
        ...formData,
        quantity: Number(formData.quantity) || 0,
        price: Number(formData.price),
        threshold: Number(formData.threshold) || 0
      };

      const result = await addInventoryItem(itemData);
      setSuccess('Item added successfully!');
      setFormData({
        name: '',
        description: '',
        quantity: '',
        price: '',
        threshold: '',
        unit: '',
        category: ''
      });
      loadInventory();
    } catch (err) {
      setError(err.message || 'Failed to add item');
    }
  };

  return (
    <div className="inventory-manager">
      <h2>Add New Item</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="inventory-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter item name"
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter item description"
          />
        </div>

        <div className="form-group">
          <label>Price ($):</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            placeholder="Enter price"
          />
        </div>

        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="0"
            placeholder="Enter quantity"
          />
        </div>

        <div className="form-group">
          <label>Threshold:</label>
          <input
            type="number"
            name="threshold"
            value={formData.threshold}
            onChange={handleInputChange}
            min="0"
            placeholder="Enter threshold"
          />
        </div>

        <div className="form-group">
          <label>Unit:</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            placeholder="Enter unit (e.g., kg, pieces)"
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Enter category"
          />
        </div>

        <button type="submit" className="submit-button">Add Item</button>
      </form>

      <h2>Current Inventory</h2>
      <div className="inventory-list">
        {inventory.map(item => (
          <div key={item._id} className="inventory-item">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity} {item.unit}</p>
            <p>Category: {item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryManager;
