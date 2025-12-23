import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Dashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { analysisResult, originalIdea } = location.state || {}

  if (!analysisResult) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="error">
          No analysis data found. Please go back and analyze your business idea first.
        </div>
        <button 
          className="btn" 
          onClick={() => navigate('/')}
          style={{ marginTop: '16px' }}
        >
          Go Back to Home
        </button>
      </div>
    )
  }

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'required': return 'status-required'
      case 'conditional': return 'status-conditional'
      case 'optional': return 'status-optional'
      default: return ''
    }
  }

  const getConfidenceClass = (confidence) => {
    switch (confidence.toLowerCase()) {
      case 'high': return 'confidence-high'
      case 'medium': return 'confidence-medium'
      case 'low': return 'confidence-low'
      default: return 'confidence-medium'
    }
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '8px' }}>
            StartupSaarthi Dashboard
          </h1>
          <p style={{ color: '#64748b' }}>
            Analysis for: "{originalIdea}"
          </p>
        </div>
        <button 
          className="btn" 
          onClick={() => navigate('/')}
          style={{ background: '#6b7280' }}
        >
          New Analysis
        </button>
      </div>

      {/* Business Summary */}
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          Business Overview
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <strong>Business Type:</strong>
            <p style={{ marginTop: '4px', color: '#6b7280' }}>{analysisResult.business_summary.business_type}</p>
          </div>
          <div>
            <strong>State:</strong>
            <p style={{ marginTop: '4px', color: '#6b7280' }}>{analysisResult.business_summary.state}</p>
          </div>
          <div>
            <strong>Scale:</strong>
            <p style={{ marginTop: '4px', color: '#6b7280' }}>{analysisResult.business_summary.scale}</p>
          </div>
        </div>
      </div>

      {/* Licenses Checklist */}
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          Licenses & Registrations
        </h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {analysisResult.licenses.map((license, index) => (
            <div key={index} style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              padding: '16px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#374151' }}>
                  {license.name}
                </h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className={getStatusClass(license.status)}>
                    {license.status}
                  </span>
                  <span className={getConfidenceClass(license.confidence)}>
                    {license.confidence}
                  </span>
                </div>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '8px' }}>
                {license.why_applies}
              </p>
              <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                <strong>Source:</strong> {license.source}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          Step-by-Step Roadmap
        </h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {analysisResult.roadmap.map((step, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              gap: '16px', 
              padding: '16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ 
                minWidth: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: '600'
              }}>
                {step.step}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                  {step.action}
                </h3>
                <p style={{ color: '#6b7280' }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schemes & Programmes */}
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          Relevant Schemes & Programmes
        </h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {analysisResult.schemes.map((scheme, index) => (
            <div key={index} style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              padding: '16px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#374151' }}>
                  {scheme.name}
                </h3>
                <span style={{ 
                  background: scheme.type === 'Government' ? '#dcfce7' : '#e0e7ff',
                  color: scheme.type === 'Government' ? '#166534' : '#3730a3',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {scheme.type}
                </span>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '8px' }}>
                {scheme.why_relevant}
              </p>
              <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                <strong>Source:</strong> {scheme.source}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Action */}
      <div className="next-action">
        <h3 style={{ fontSize: '1.3rem', fontWeight: '600' }}>
          🎯 Your Next Action
        </h3>
        <p style={{ fontSize: '1.1rem', color: '#1e40af', fontWeight: '500' }}>
          {analysisResult.next_action}
        </p>
      </div>

      {/* Disclaimer */}
      <div style={{ 
        marginTop: '32px', 
        padding: '16px', 
        backgroundColor: '#fef3c7', 
        borderRadius: '8px',
        border: '1px solid #f59e0b'
      }}>
        <p style={{ fontSize: '0.9rem', color: '#92400e' }}>
          <strong>Disclaimer:</strong> This analysis is for guidance purposes only and does not constitute legal advice. 
          Please consult with relevant authorities and legal experts before making business decisions. 
          Requirements may vary based on specific circumstances and location.
        </p>
      </div>
    </div>
  )
}

export default Dashboard