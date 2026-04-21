'use client';

import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

export default function FileUpload({ onAnalyze, isLoading }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  return (
    <div className="upload-container animate-fade">
      <div
        className={`upload-drop-zone glass ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          onChange={handleChange}
          accept="*"
          hidden
        />

        {!file ? (
          <label htmlFor="file-upload" className="upload-label">
            <Upload className="upload-icon" size={48} color="#10b981" />
            <h3>Drop your energy dataset here</h3>
            <p>Upload any data table format (CSV, TXT, Excel, etc.)</p>
            <span className="btn-browse">Browse Files</span>
          </label>
        ) : (
          <div className="selected-file">
            <div className="file-info-header">
              <FileText size={32} color="#10b981" />
              <div>
                <h4>{file.name}</h4>
                <p>{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <button className="clear-btn" onClick={clearFile} disabled={isLoading}>
                <X size={20} />
              </button>
            </div>
            <button
              className={`btn-primary ${isLoading ? 'loading' : ''}`}
              onClick={() => onAnalyze(file)}
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing...' : 'Analyze My Usage'}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .upload-container {
          margin: 4rem auto;
          max-width: 600px;
          text-align: center;
        }

        .upload-drop-zone {
          padding: 3rem 2rem;
          border: 2px dashed var(--card-border);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 280px;
        }

        .upload-drop-zone.active {
          border-color: var(--primary);
          background: rgba(16, 185, 129, 0.05);
          transform: scale(1.02);
        }

        .upload-label {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .upload-icon {
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.4));
        }

        .upload-label h3 {
          font-size: 1.25rem;
          color: var(--text);
        }

        .upload-label p {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .btn-browse {
          padding: 0.6rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--card-border);
          border-radius: 8px;
          font-weight: 500;
          color: var(--text);
        }

        .selected-file {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .file-info-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
        }

        .file-info-header div {
          flex: 1;
        }

        .file-info-header h4 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
          word-break: break-all;
        }

        .file-info-header p {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .clear-btn {
          background: none;
          color: var(--text-muted);
          padding: 0.5rem;
        }

        .clear-btn:hover {
          color: var(--error);
        }

        .btn-primary {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          font-weight: 600;
          border-radius: 12px;
          font-size: 1.125rem;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading {
          position: relative;
          color: transparent !important;
        }

        .loading::after {
          content: "";
          position: absolute;
          width: 24px;
          height: 24px;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
