'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function DatasetList() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [companies, setCompanies] = useState<{ id: number; name: string }[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>('');
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const datasetResult = await axios.get('/api/datasets');
      setDatasets(datasetResult.data);

      const companyResult = await axios.get('/api/companies');
      setCompanies(companyResult.data);
    };
    fetchData();
  }, []);

  const handleInquire = (datasetId: number) => {
    setSelectedDatasetId(datasetId);
    setIsModalOpen(true);
  };

  const handleCompanyChange = (companyId: number) => {
    setSelectedCompanyId(companyId);
    const selectedCompany = companies.find(company => company.id === companyId);
    if (selectedCompany) {
      setSelectedCompanyName(selectedCompany.name);
    }
  };

  const handleInquirySubmit = async () => {
    if (!selectedCompanyId || !selectedCompanyName || !selectedDatasetId) {
      setMessage('Please select a company.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to inquire about a dataset.');
        return;
      }

      await axios.post('/api/purchase', {
        datasetId: selectedDatasetId,
        buyerId: selectedCompanyId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('Inquiry successful!');
      setIsModalOpen(false);
      setSelectedCompanyId(null);
      setSelectedDatasetId(null);
    } catch (error) {
      setMessage('Failed to inquire about the dataset.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedCompanyId || !selectedCompanyName) {
      setMessage('Please select a company.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to submit a dataset for sale.');
        return;
      }

      await axios.post('/api/selling', {
        seller_company_id: selectedCompanyId,
        seller_company_name: selectedCompanyName,
        title,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Dataset successfully listed for sale!');
      setTitle('');
      setDescription('');
      setSelectedCompanyId(null);
      setSelectedCompanyName('');

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

      <section className="datasets">
        <h2>Available Datasets</h2>
        {datasets.length > 0 ? (
          <ul className="dataset-list">
            {datasets.map((dataset) => (
              <li key={dataset.id} className="dataset-card">
                {/* Clickable link to dataset details page */}
                <Link href={`/datasets/${dataset.id}`} className="dataset-link">
                  <h3>{dataset.title}</h3>
                  <p><strong>Seller:</strong> {dataset.seller_company_name}</p>
                  <p>{dataset.description}</p>
                </Link>
                <button onClick={() => handleInquire(dataset.id)}>Inquire</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No datasets available for sale.</p>
        )}
      </section>

      {isModalOpen && (
        <div className="modal">
          <h3>Select Your Company</h3>
          <select onChange={(e) => handleCompanyChange(Number(e.target.value))}>
            <option value="" disabled>Select a company</option>
            {companies
              .filter(company => company.name !== datasets.find(ds => ds.id === selectedDatasetId)?.seller_company_name)
              .map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
          </select>
          <button onClick={handleInquirySubmit}>Submit Inquiry</button>
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </div>
      )}

      <section className="sell-dataset">
        <h2>Sell Your Dataset</h2>
        <form onSubmit={handleSubmit} className="dataset-form">
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
          <div>
            <label htmlFor="company">Seller Company:</label>
            <select
              id="company"
              value={selectedCompanyId || ''}
              onChange={(e) => handleCompanyChange(Number(e.target.value))}
              required
            >
              <option value="" disabled>Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Submit Dataset</button>
        </form>
      </section>

      <style jsx>{`
        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
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
          list-style: none; /* Remove the list-style dot */
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
        }

        .dataset-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}
