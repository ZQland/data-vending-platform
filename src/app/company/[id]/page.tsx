'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link'; // Import Link
import axios from 'axios';

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [sellingDatasets, setSellingDatasets] = useState<any[]>([]);
  const [purchasedDatasets, setPurchasedDatasets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const companyResult = await axios.get(`/api/companies/${id}`);
        setCompany(companyResult.data);

        const sellingResult = await axios.get(`/api/companies/${id}/selling`);
        setSellingDatasets(sellingResult.data);

        const purchasedResult = await axios.get(`/api/companies/${id}/purchased`);
        setPurchasedDatasets(purchasedResult.data);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch company data');
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyData();
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      {error && <p className="error">{error}</p>}
      {company ? (
        <>
          <header>
            <h1>{company.name}</h1>
            <p>{company.description}</p>
          </header>

          {/* Datasets Being Sold */}
          <section className="datasets">
            <h2>Datasets for Sale</h2>
            {sellingDatasets.length > 0 ? (
              <ul className="dataset-list">
                {sellingDatasets.map((dataset) => (
                  <li key={dataset.id} className="dataset-card">
                    <Link href={`/datasets/${dataset.id}`}>
                        <h3>{dataset.title}</h3>
                        <p>{dataset.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No datasets being sold.</p>
            )}
          </section>

          <hr />

          {/* Datasets Purchased */}
          <section className="datasets">
            <h2>Purchased Datasets</h2>
            {purchasedDatasets.length > 0 ? (
              <ul className="dataset-list">
                {purchasedDatasets.map((dataset) => (
                  <li key={dataset.id} className="dataset-card">
                    <Link href={`/datasets/${dataset.id}`}>
                        <h3>{dataset.title}</h3>
                        <p>{dataset.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No datasets purchased.</p>
            )}
          </section>
        </>
      ) : (
        <p>Loading...</p>
      )}

      {/* Styling */}
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

        a {
          text-decoration: none;
          color: inherit;
        }

        .error {
          color: red;
          text-align: center;
          margin-bottom: 20px;
        }

        hr {
          margin: 40px 0;
        }
      `}</style>
    </div>
  );
}
