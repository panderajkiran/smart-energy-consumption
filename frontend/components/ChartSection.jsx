import React from 'react';

export default function ChartSection({ charts }) {
  if (!charts || charts.length === 0) return null;

  return (
    <div className="charts-container animate-fade">
      <h2 className="section-title">Visual Analysis</h2>
      <div className="charts-grid">
        {charts.filter(c => c.image).map((chart, index) => (
          <div key={index} className="glass chart-card">
            <h3 className="chart-title">{chart.title}</h3>
            <div className="chart-wrapper">
              <img 
                src={`data:image/png;base64,${chart.image}`} 
                alt={chart.title} 
                className="chart-img"
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .charts-container {
          margin: 3rem 0;
        }

        .section-title {
          font-size: 1.5rem;
          margin-bottom: 2rem;
          color: var(--primary);
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 2rem;
        }

        .chart-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .chart-title {
          font-size: 1.125rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .chart-wrapper {
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.02);
          aspect-ratio: 4 / 3;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chart-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .chart-card:hover .chart-img {
          transform: scale(1.02);
        }

        @media (max-width: 480px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
