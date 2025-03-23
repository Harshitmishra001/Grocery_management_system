import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const BulkImport = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus('Please select a file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/inventory/bulk-import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatus(response.data.message);
      setFile(null);
      // Reset the file input
      e.target.reset();
      // Trigger page refresh to show new items
      window.location.reload();
    } catch (err) {
      console.error('Upload error:', err);
      setStatus(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bulk-import">
      <h2>Import Inventory from CSV</h2>
      <form onSubmit={handleUpload}>
        <div className="file-input">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={!file || loading}>
          {loading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </form>
      {status && (
        <div className={`status ${status.includes('failed') ? 'error' : 'success'}`}>
          {status}
        </div>
      )}
      <div className="instructions">
        <h3>CSV Format:</h3>
        <p>Your CSV file should have the following columns:</p>
        <ul>
          <li>name (required)</li>
          <li>description</li>
          <li>price (required)</li>
          <li>quantity (required)</li>
          <li>unit</li>
          <li>category</li>
          <li>minStockLevel</li>
        </ul>
      </div>
    </div>
  );
};

export default BulkImport; 