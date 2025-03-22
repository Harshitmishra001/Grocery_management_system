// src/components/PreorderManager.js
import React, { useState } from 'react';
import { fetchPriceComparison } from '../api';

function PreorderManager({ inventory, onUpdateInventory }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [deals, setDeals] = useState([]);
  const [message, setMessage] = useState('');

  // Identify low-stock items (below threshold)
  const lowStockItems = inventory.filter(
    (item) => item.quantity < item.threshold
  );

  // Handle selection of an item for price comparison
  const handleSelectItem = async (item) => {
    setMessage('');
    setSelectedItem(item);
    const data = await fetchPriceComparison(item.name);
    setDeals(data.deals);
  };

  // Simulate ordering from the best deal
  const handlePreorder = () => {
    if (!selectedItem || deals.length === 0) return;

    // For demonstration, choose the cheapest deal
    const bestDeal = deals.reduce((prev, curr) =>
      prev.price < curr.price ? prev : curr
    );
    // In a real app, trigger an order API here and update inventory accordingly
    setMessage(
      `Preordered ${selectedItem.name} from ${bestDeal.platform} at $${bestDeal.price}.`
    );
    // Simulate updating inventory: here we'll just increase quantity by a fixed amount
    const updatedInventory = inventory.map((item) => {
      if (item.id === selectedItem.id) {
        return { ...item, quantity: item.quantity + 10 }; // Assume 10 units added
      }
      return item;
    });
    onUpdateInventory(updatedInventory);
    setSelectedItem(null);
    setDeals([]);
  };

  return (
    <div>
      <h3>Preorder Manager</h3>
      <h4>Low Stock Items</h4>
      {lowStockItems.length === 0 ? (
        <p>All items are well stocked.</p>
      ) : (
        <ul>
          {lowStockItems.map((item) => (
            <li key={item.id}>
              {item.name} - Quantity: {item.quantity} (Threshold: {item.threshold})
              <button onClick={() => handleSelectItem(item)}>Compare Prices</button>
            </li>
          ))}
        </ul>
      )}
      {selectedItem && (
        <div>
          <h4>Price Comparison for {selectedItem.name}</h4>
          {deals.length === 0 ? (
            <p>Loading deals...</p>
          ) : (
            <ul>
              {deals.map((deal, index) => (
                <li key={index}>
                  {deal.platform}: ${deal.price} - Delivery in {deal.deliveryTime}
                </li>
              ))}
            </ul>
          )}
          <button onClick={handlePreorder}>Preorder from Best Deal</button>
        </div>
      )}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
}

export default PreorderManager;
