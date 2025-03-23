import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const BulkImport = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus('Please select a file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvContent = event.target.result;
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const items = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(v => v.trim());
            const item = {};
            headers.forEach((header, index) => {
              item[header] = values[index];
            });
            return item;
          });

        const response = await axios.post(`${API_URL}/inventory/bulk-import`, items);
        setStatus(response.data.message);
        setFile(null);
        window.location.reload();
      } catch (err) {
        setStatus(err.response?.data?.error || 'Upload failed');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <h3>Import Inventory from CSV</h3>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginRight: '10px' }}
        />
        <button type="submit" disabled={!file}>
          Upload CSV
        </button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default BulkImport; 