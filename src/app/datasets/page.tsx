'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DatasetList() {
  const [datasets, setDatasets] = useState<{ id: number; title: string; seller_name: string; description: string }[]>([]);
  const [sellerName, setSellerName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Fetch datasets when the component loads
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/api/datasets');
      setDatasets(result.data);
    };
    fetchData();
  }, []);

  // Handle buying a dataset
  const handleBuy = async (datasetId: number) => {
    try {
      const token = localStorage.getItem('token'); // Get JWT token from localStorage
      if (!token) {
        setMessage('You must be logged in to purchase a dataset');
        return;
      }

      // Call the purchase API to buy the dataset
      await axios.post('/api/purchase', { datasetId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Purchase successful!');
    } catch (error) {
      setMessage('Purchase failed. Please try again.');
    }
  };

  // Handle form submission to add a new dataset
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Get the JWT token from localStorage
      if (!token) {
        setMessage('You must be logged in to submit a dataset for sale.');
        return;
      }
      await axios.post('/api/selling', {
        seller_name: sellerName,
        title,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
        },
      });

      setMessage('Dataset successfully listed for sale!');
      setSellerName('');
      setTitle('');
      setDescription('');

      // Refresh the dataset list after submission
      const result = await axios.get('/api/datasets');
      setDatasets(result.data);
    } catch (error) {
      setMessage('Failed to list dataset for sale');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Data for Sale</h1>
        {message && <p className="message">{message}</p>}
      </header>

      {/* Dataset List */}
      <section className="datasets">
        <h2>Available Datasets</h2>
        {datasets.length > 0 ? (
          <ul className="dataset-list">
            {datasets.map((dataset) => (
              <li key={dataset.id} className="dataset-card">
                <h3>{dataset.title}</h3>
                <p><strong>Seller:</strong> {dataset.seller_name}</p>
                <p>{dataset.description}</p>
                <button onClick={() => handleBuy(dataset.id)}>Inquire</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No datasets available for sale.</p>
        )}
      </section>

      <hr />

      {/* Dataset Submission Form */}
      <section className="sell-dataset">
        <h2>Sell Your Dataset</h2>
        <form onSubmit={handleSubmit} className="dataset-form">
          <div>
            <label htmlFor="sellerName">Your Name:</label>
            <input
              type="text"
              id="sellerName"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="title">Dataset Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit Dataset</button>
        </form>
      </section>

      {/* CSS Styles */}
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        header {
          text-align: center;
          margin-bottom: 40px;
        }

        h1 {
          font-size: 2.5rem;
          color: #007bff;
        }

        h2 {
          font-size: 2rem;
          margin-bottom: 20px;
          color: #333;
          border-bottom: 2px solid #007bff;
          padding-bottom: 10px;
        }

        .message {
          background-color: #f0f0f0;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          margin-bottom: 20px;
        }

        .datasets {
          margin-bottom: 40px;
        }

        .dataset-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          list-style-type: none;
          padding: 0;
        }

        .dataset-card {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .dataset-card:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
          transform: translateY(-5px);
        }

        h3 {
          font-size: 1.5rem;
          color: #007bff;
          margin-bottom: 10px;
        }

        button {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #218838;
        }

        .sell-dataset {
          margin-top: 40px;
        }

        .dataset-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        label {
          font-size: 1.1rem;
          margin-bottom: 5px;
          color: #333;
        }

        input,
        textarea {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 1rem;
          width: 100%;
        }

        textarea {
          min-height: 120px;
        }

        input:focus,
        textarea:focus {
          outline: none;
          border-color: #007bff;
        }
      `}</style>
    </div>
  );
}
