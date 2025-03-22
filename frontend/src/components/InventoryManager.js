// src/components/InventoryManager.js
import React, { useState } from 'react';
import { addInventoryItem } from '../api';

function InventoryManager({ onNewItem }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [threshold, setThreshold] = useState('');
  const [message, setMessage] = useState('');

  const handleAddItem = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const item = { name, quantity: parseInt(quantity, 10), threshold: parseInt(threshold, 10) };
      const data = await addInventoryItem(item);
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage('Item added successfully!');
        setName('');
        setQuantity('');
        setThreshold('');
        if (onNewItem) onNewItem(data.item);
      }
    } catch (error) {
      setMessage('Error adding item.');
    }
  };

  return (
    <div>
      <h3>Add New Inventory Item</h3>
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Threshold"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          required
        />
        <button type="submit">Add Item</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default InventoryManager;
