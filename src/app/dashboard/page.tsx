'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Dashboard() {
  const [companies, setCompanies] = useState<{ id: number; name: string; description: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch companies managed by the admin
  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/companies', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(response.data);
    } catch (err) {
      setError('Failed to fetch companies');
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>

      {error && <p className="error">{error}</p>}

      {/* Companies Managed by Admin */}
      <section>
        <h2>Companies</h2>
        {companies.length > 0 ? (
          <div className="company-grid">
            {companies.map((company) => (
              <Link href={`/company/${company.id}`} key={company.id}>
                <div className="company-card">
                  <h3>{company.name}</h3>
                  <p>{company.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No companies managed yet.</p>
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

        .company-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .company-card {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }

        .company-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: #007bff;
        }

        .error {
          color: red;
          text-align: center;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
