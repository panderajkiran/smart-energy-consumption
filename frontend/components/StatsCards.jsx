import React from 'react';
import { Zap, TrendingDown, Clock, Activity, TrendingUp, ArrowDown } from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cardData = [
    {
      title: 'Total Consumption',
      icon: <Zap size={24} color="#10b981" />,
      value: `${stats.total_consumption?.toFixed(2) || 0} kWh`,
      color: '#10b981',
      sub: 'All readings combined'
    },
    {
      title: 'Average Usage',
      icon: <Activity size={24} color="#34d399" />,
      value: `${stats.average_usage?.toFixed(2) || 0} kWh`,
      color: '#34d399',
      sub: 'Per reading'
    },
    {
      title: 'Max Usage',
      icon: <TrendingUp size={24} color="#f87171" />,
      value: `${stats.max_usage?.toFixed(2) || 0} kWh`,
      color: '#f87171',
      sub: 'Highest single reading'
    },
    {
      title: 'Min Usage',
      icon: <ArrowDown size={24} color="#60a5fa" />,
      value: `${stats.min_usage?.toFixed(2) || 0} kWh`,
      color: '#60a5fa',
      sub: 'Lowest single reading'
    },
    {
      title: 'Wastage Detected',
      icon: <TrendingDown size={24} color="#f59e0b" />,
      value: `${stats.wastage_percentage?.toFixed(1) || 0}%`,
      color: '#f59e0b',
      sub: 'Readings above threshold'
    },
    {
      title: 'Peak Usage Time',
      icon: <Clock size={24} color="#a78bfa" />,
      value: `${stats.peak_usage || 'N/A'}`,
      color: '#a78bfa',
      sub: 'Highest consumption point'
    }
  ];

  return (
    <div className="stats-grid animate-fade">
      {cardData.map((data, index) => (
        <div key={index} className="glass stat-card">
          <div className="stat-header">
            <span className="stat-icon-wrapper" style={{ background: `${data.color}20` }}>
              {data.icon}
            </span>
            <span className="stat-title">{data.title}</span>
          </div>
          <p className="stat-value">{data.value}</p>
          {data.sub && <p className="stat-sub">{data.sub}</p>}
        </div>
      ))}

      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .stat-card {
          padding: 1.5rem;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
        }

        .stat-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .stat-icon-wrapper {
          padding: 8px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
        }

        .stat-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}
