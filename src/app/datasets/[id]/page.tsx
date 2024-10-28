// app/datasets/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function DatasetDetail() {
  const { id } = useParams();
  const [dataset, setDataset] = useState<any>(null);
  const [dummyData, setDummyData] = useState<string[][]>([]);

  // Fetch and set dummy data based on dataset ID
  useEffect(() => {
    if (id) {
      const data = getDummyDataById(id);
      setDummyData(data.table);
      setDataset(data);
    }
  }, [id]);

  if (!dataset) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <header>
        <h1>{dataset.title}</h1>
        <p>{dataset.description}</p>
      </header>

      {/* Show Dummy Data */}
      <section className="dataset-preview">
        <h2>Data Preview</h2>
        <table className="data-table">
          <thead>
            <tr>
              {dummyData[0]?.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dummyData.slice(1).map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Blurred Message */}
      <div className="blur-message">
        <p>The remaining data is blurred. Purchase the dataset to view all data.</p>
      </div>

      {/* Styling */}
      <style jsx>{`
        .container {
          max-width: 800px;
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
          font-size: 1.5rem;
          margin-bottom: 20px;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .data-table th,
        .data-table td {
          border: 1px solid #ccc;
          padding: 10px;
          text-align: left;
        }

        .blur-message {
          text-align: center;
          background-color: #f0f0f0;
          padding: 20px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

// Helper function to return dummy data based on dataset ID
function getDummyDataById(id: string) {
  switch (id) {
    case '16':
      return {
        title: 'Dataset 16: Home Insurance Policy',
        description: 'Detailed information on home insurance policies.',
        table: [
          ['Policy ID', 'Policy Holder', 'Coverage', 'Premium'],
          ['H123', 'Alice Johnson', '$250,000', '$1200/year'],
          ['H456', 'Bob Smith', '$300,000', '$1500/year'],
          ['Blurred Data', '*****', '*****', '*****'],
        ],
      };
      case '15':
        return {
          title: 'Dataset 15: Loan Data 2023',
          description: 'Detailed loan information dataset for 2023, covering interest rates, loan amounts, and repayment terms.',
          table: [
            ['Loan ID', 'Borrower', 'Loan Amount', 'Interest Rate', 'Repayment Term'],
            ['L001', 'Alice Brown', '$100,000', '4.5%', '15 years'],
            ['L002', 'Michael Johnson', '$150,000', '3.8%', '30 years'],
            ['L003', 'Jessica Lee', '$80,000', '5.2%', '10 years'],
            ['Blurred Data', '*****', '*****', '*****', '*****'],
          ],
        };
    case '17':
      return {
        title: 'Dataset 17: Loan Information',
        description: 'Detailed dataset on personal and home loans.',
        table: [
          ['Loan ID', 'Borrower', 'Loan Amount', 'Interest Rate'],
          ['L111', 'John Doe', '$200,000', '3.5%'],
          ['L222', 'Jane Smith', '$150,000', '4.0%'],
          ['Blurred Data', '*****', '*****', '*****'],
        ],
      };
    case '14':
      return {
        title: 'Dataset 14: Tax Records',
        description: 'Various tax records for different entities.',
        table: [
          ['Record ID', 'Entity', 'Tax Year', 'Amount'],
          ['T333', 'ACME Corp.', '2021', '$15,000'],
          ['T444', 'Beta Inc.', '2020', '$12,000'],
          ['Blurred Data', '*****', '*****', '*****'],
        ],
      };
    default:
      return {
        title: 'Dataset Not Found',
        description: 'No data available for this dataset.',
        table: [],
      };
  }
}
