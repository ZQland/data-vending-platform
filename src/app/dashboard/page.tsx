'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [purchasedDatasets, setPurchasedDatasets] = useState<any[]>([]);
  const [sellingDatasets, setSellingDatasets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch purchased datasets
  const fetchPurchasedDatasets = async () => {
    try {
      const token = localStorage.getItem('token'); // Get JWT from localStorage
      const response = await axios.get('/api/purchase', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchasedDatasets(response.data);
    } catch (err) {
      setError('Failed to fetch purchased datasets');
    }
  };

  // Fetch selling datasets
  const fetchSellingDatasets = async () => {
    try {
      const token = localStorage.getItem('token'); // Get JWT from localStorage
      const response = await axios.get('/api/selling', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSellingDatasets(response.data);
    } catch (err) {
      setError('Failed to fetch selling datasets');
    }
  };

  useEffect(() => {
    fetchPurchasedDatasets();
    fetchSellingDatasets();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      {error && <p className="error">{error}</p>}
      
      {/* Purchased Datasets */}
      <section>
        <h2>Purchased Datasets</h2>
        {purchasedDatasets.length > 0 ? (
          <div className="dataset-grid">
            {purchasedDatasets.map((dataset, index) => (
              <div key={index} className="dataset-card">
                <h3>{dataset.title}</h3>
                <p>{dataset.description}</p>
                <p><strong>Purchased on:</strong> {new Date(dataset.purchase_date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No datasets purchased yet.</p>
        )}
      </section>

      <hr />

      {/* Selling Datasets */}
      <section>
        <h2>Selling Datasets</h2>
        {sellingDatasets.length > 0 ? (
          <div className="dataset-grid">
            {sellingDatasets.map((dataset, index) => (
              <div key={index} className="dataset-card">
                <h3>{dataset.title}</h3>
                <p>{dataset.description}</p>
                <p><strong>Listed on:</strong> {new Date(dataset.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No datasets listed for sale yet.</p>
        )}
      </section>

      <style jsx>{`
        .dashboard-container {
          padding: 40px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        h1 {
          font-size: 2.5rem;
          color: #007bff;
          text-align: center;
          margin-bottom: 40px;
        }

        section {
          margin-bottom: 50px;
        }

        h2 {
          font-size: 2rem;
          margin-bottom: 20px;
          color: #333;
          text-align: left;
          border-bottom: 2px solid #007bff;
          padding-bottom: 10px;
        }

        .dataset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .dataset-card {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .dataset-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .dataset-card h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: #007bff;
        }

        .dataset-card p {
          font-size: 1rem;
          margin-bottom: 10px;
          color: #555;
        }

        .error {
          color: red;
          text-align: center;
          margin-bottom: 20px;
        }

        hr {
          margin: 40px 0;
          border: none;
          height: 1px;
          background-color: #ddd;
        }

        @media (max-width: 768px) {
          .dataset-grid {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 2rem;
          }

          h2 {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
}
