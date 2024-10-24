'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <Link href="/">
            Data Exchange
          </Link>
        </div>

        {/* Hamburger Icon for mobile */}
        <div className="hamburger" onClick={toggleMenu}>
          <span className={`bar ${isOpen ? 'change' : ''}`}></span>
          <span className={`bar ${isOpen ? 'change' : ''}`}></span>
          <span className={`bar ${isOpen ? 'change' : ''}`}></span>
        </div>

        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li>
            <Link href="/">
              Home
            </Link>
          </li>
          <li>
            <Link href="/datasets">
             Datasets
            </Link>
          </li>
          <li>
            <Link href="/dashboard">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/login">
              Login
            </Link>
          </li>
        </ul>
      </div>

      <style jsx>{`
        .navbar {
          background-color: lightgreen;
          padding: 20px 0;
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: bold;
          color: #fff;
          text-decoration: none;
          letter-spacing: 1px;
        }

        .nav-links {
          list-style: none;
          display: flex;
          gap: 30px;
          transition: all 0.3s ease;
        }

        .nav-links li {
          font-size: 1rem;
          color: #fff;
          text-decoration: none;
          font-weight: 500;
          padding: 10px 15px;
          border-radius: 30px;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .nav-links li:hover {
          background-color: white;
          color: #fff;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
        }

        .hamburger .bar {
          width: 25px;
          height: 3px;
          background-color: #fff;
          transition: all 0.3s ease;
        }

        /* Hamburger Icon Change Animation */
        .hamburger .bar.change:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }

        .hamburger .bar.change:nth-child(2) {
          opacity: 0;
        }

        .hamburger .bar.change:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* Responsive Navigation */
        @media (max-width: 768px) {
          .nav-links {
            position: absolute;
            top: 100%;
            right: 0;
            background-color: #1a1a1a;
            flex-direction: column;
            gap: 15px;
            padding: 20px;
            border-radius: 0 0 8px 8px;
            display: none;
          }

          .nav-links.open {
            display: flex;
          }

          .hamburger {
            display: flex;
          }
        }

        @media (max-width: 576px) {
          .nav-links li a {
            font-size: 1.1rem;
          }

          .logo {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </nav>
  );
}
