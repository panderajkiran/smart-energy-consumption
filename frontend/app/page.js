'use client';

import React, { useState, useRef } from 'react';
import FileUpload from '../components/FileUpload';
import StatsCards from '../components/StatsCards';
import ChartSection from '../components/ChartSection';
import PredictionCard from '../components/PredictionCard';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadRef = useRef(null);
  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnalyze = async (file) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to analyze file');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.warn('[Analyze] Fetch failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <nav className="navbar animate-fade">
        <div className="nav-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px', color: '#10b981' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span style={{ fontWeight: 'bold' }}>ECOBRIGHT<br /><small style={{ fontSize: '0.5em', fontWeight: 'normal', color: 'var(--text-muted)' }}>ENERGY SOLUTIONS</small></span>
        </div>

      </nav>

      <header className="header animate-fade">
        <h1 className="main-title">SMART ENERGY<br />CONSUMPTION</h1>
        <p className="subtitle">Optimize your home's power usage, reduce your carbon footprint, and save<br />money with intelligent energy management solutions for a brighter future.</p>
        <button className="btn-discover" onClick={scrollToUpload}>DISCOVER SOLUTIONS</button>
      </header>

      <section className="hero" ref={uploadRef}>
        <FileUpload onAnalyze={handleAnalyze} isLoading={loading} />
      </section>

      {error && (
        <div className="glass error-message animate-fade">
          <p>{error}</p>
        </div>
      )}

      {data && (
        <div className="dashboard-results">
          <StatsCards stats={data.stats} />

          <div className="main-content-grid">
            <ChartSection charts={data.charts} />
            <PredictionCard predictions={data.predictions} />
          </div>
        </div>
      )}

      <footer className="footer">
        <p>&copy; 2024 EcoBright Energy Solutions. All rights reserved.</p>
      </footer>

      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;
          margin-bottom: 4rem;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          line-height: 1.2;
          font-size: 1.2rem;
          color: white;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 2rem;
        }

        .nav-links a {
          text-decoration: none;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-links a:hover {
          color: white;
        }

        .btn-get-started {
          padding: 0.6rem 1.5rem;
          background: white;
          color: black;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .btn-get-started:hover {
          background: #f1f5f9;
        }

        .header {
          text-align: center;
          padding-top: 5rem;
          padding-bottom: 8rem;
        }

        .main-title {
          font-size: 5.5rem;
          font-weight: 900;
          color: white;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
          text-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .subtitle {
          font-size: 1.2rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 3rem;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .btn-discover {
          padding: 1rem 2.5rem;
          background: #2d6a4f;
          color: white;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1rem;
          transition: background 0.2s, transform 0.2s;
        }

        .btn-discover:hover {
          background: #1b4332;
          transform: translateY(-2px);
        }

        .hero {
          margin-bottom: 4rem;
          padding-top: 2rem;
        }

        .error-message {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1.5rem;
          border-left: 4px solid var(--error);
          background: rgba(239, 68, 68, 0.05);
          color: #ff8a8a;
          text-align: center;
        }

        .dashboard-results {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .main-content-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .footer {
          margin-top: 6rem;
          padding: 2rem 0;
          border-top: 1px solid var(--card-border);
          text-align: center;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        @media (max-width: 900px) {
          .nav-links {
            display: none;
          }
          .main-title {
            font-size: 3.5rem;
          }
        }
      `}</style>
    </main>
  );
}
