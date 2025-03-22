// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { fetchInventory } from '../api';
import InventoryManager from './InventoryManager';
import MealPlanner from './MealPlanner';
import ChoreManager from './ChoreManager';
import PreorderManager from './PreorderManager';

function Dashboard({ user }) {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');

  const getInventory = async () => {
    try {
      const data = await fetchInventory();
      if (data.error) {
        setError(data.error);
      } else {
        setInventory(data.inventory);
      }
    } catch (err) {
      setError('Failed to fetch inventory.');
    }
  };

  useEffect(() => {
    getInventory();
  }, []);

  const handleNewItem = (newItem) => {
    setInventory((prev) => [...prev, newItem]);
  };

  const handleUpdateInventory = (updatedInventory) => {
    setInventory(updatedInventory);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user.name}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <section>
        <h3>Inventory Management</h3>
        <InventoryManager onNewItem={handleNewItem} />
        <h4>Current Inventory</h4>
        <ul>
          {inventory.map((item) => (
            <li key={item.id}>
              {item.name} - Quantity: {item.quantity} (Threshold: {item.threshold})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Meal Planning</h3>
        <MealPlanner inventory={inventory} onUpdateInventory={handleUpdateInventory} />
      </section>

      <section>
        <h3>Chore Management</h3>
        <ChoreManager />
      </section>

      <section>
        <h3>Preorder Management</h3>
        <PreorderManager inventory={inventory} onUpdateInventory={handleUpdateInventory} />
      </section>
    </div>
  );
}

export default Dashboard;
