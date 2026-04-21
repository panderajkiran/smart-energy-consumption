import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

export default function PredictionCard({ predictions }) {
  if (!predictions) return null;

  return (
    <div className="prediction-container animate-fade">
      <div className="glass prediction-card">
        <div className="prediction-header">
          <div className="icon-badge">
            <Lightbulb size={28} color="#10b981" />
          </div>
          <div className="header-info">
            <h2 className="title">AI Insights & Recommendations</h2>
            <p className="subtitle">Powered by historical consumption analysis</p>
          </div>
        </div>

        <div className="analysis-summary">
          <div className="summary-section">
            <h3 className="section-subtitle">Summary</h3>
            <p className="summary-text">{predictions.summary}</p>
          </div>

          <div className="recommendations-section">
            <h3 className="section-subtitle">Suggestions</h3>
            <ul className="recommendation-list">
              {(Array.isArray(predictions.recommendations)
                ? predictions.recommendations
                : (predictions.recommendations?.split('. ') || [])
              ).filter(s => s && s.length > 5).map((recommendation, index) => (
                <li key={index} className="recommendation-item">
                  <span className="dot">
                    <CheckCircle2 size={18} color="#10b981" />
                  </span>
                  <p>{recommendation.trim().replace(/\.$/, '')}.</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .prediction-container {
          margin: 3rem 0 5rem;
        }

        .prediction-card {
          padding: 2.5rem;
          border-left: 4px solid var(--primary);
        }

        .prediction-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--card-border);
        }

        .icon-badge {
          background: rgba(16, 185, 129, 0.1);
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 0.25rem;
        }

        .subtitle {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .analysis-summary {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section-subtitle {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .summary-text {
          font-size: 1.125rem;
          line-height: 1.6;
          color: var(--text);
        }

        .recommendation-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .recommendation-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .recommendation-item:hover {
          background: rgba(255, 255, 255, 0.04);
          transform: translateX(4px);
        }

        .dot {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .recommendation-item p {
          font-size: 1rem;
          line-height: 1.5;
          color: var(--text);
        }
      `}</style>
    </div>
  );
}
