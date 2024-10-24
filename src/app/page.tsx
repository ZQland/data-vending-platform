// app/page.tsx
'use client'
import Link from 'next/link';

export default function Home() {
  return (
    <div className='container'>
      <main>
      <h1>Welcome to the Data Vending Platform</h1>
      <p>Browse and purchase data from trusted providers.</p>

      

      <style jsx>{`
        /* Container for full-page centering */
        .container {
          height: 100vh; /* Full viewport height */
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f4f4f4; /* Light gray background */
        }

        main {
          text-align: center;
          padding: 20px;
        }

        h1 {
          font-size: 3rem;
          color: green;
          font-weight: bold;
          margin-bottom: 20px;
          letter-spacing: 1px;
        }

        p {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 40px;
        }

        a {
          color: blue;
          text-decoration: underline;
          cursor: pointer;
        }
      `}</style>
      </main>
    </div>
  );
}
