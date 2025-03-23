// src/components/Dashboard.js
import React from 'react';
import AddItem from './AddItem';
import CurrentInventory from './CurrentInventory';
import BulkImport from './BulkImport';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard-section">
        <AddItem />
      </div>

      <hr className="divider" />

      <div className="dashboard-section">
        <BulkImport />
      </div>

      <hr className="divider" />

      <div className="dashboard-section">
        <h2>Current Inventory</h2>
        <CurrentInventory />
      </div>
    </div>
  );
};

export default Dashboard;
