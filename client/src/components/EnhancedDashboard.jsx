import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function EnhancedDashboard() {
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
    switch (status?.toLowerCase()) {
      case 'required': return 'status-required'
      case 'conditional': return 'status-conditional'
      case 'optional': return 'status-optional'
      default: return ''
    }
  }

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'confidence-low' // Red for high priority
      case 'medium': return 'confidence-medium' // Yellow for medium priority
      case 'low': return 'confidence-high' // Green for low priority
      default: return 'confidence-medium'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981' // Green
    if (score >= 60) return '#f59e0b' // Yellow
    return '#ef4444' // Red
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '8px' }}>
            Business Analysis Report
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

      {/* Viability Score */}
      {analysisResult.viabilityScore && (
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Viability Assessment
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: getScoreColor(analysisResult.viabilityScore.overall),
                marginBottom: '4px'
              }}>
                {analysisResult.viabilityScore.overall}%
              </div>
              <div style={{ color: '#6b7280' }}>Overall</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: getScoreColor(analysisResult.viabilityScore.market),
                marginBottom: '4px'
              }}>
                {analysisResult.viabilityScore.market}%
              </div>
              <div style={{ color: '#6b7280' }}>Market</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: getScoreColor(analysisResult.viabilityScore.financial),
                marginBottom: '4px'
              }}>
                {analysisResult.viabilityScore.financial}%
              </div>
              <div style={{ color: '#6b7280' }}>Financial</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: getScoreColor(analysisResult.viabilityScore.regulatory),
                marginBottom: '4px'
              }}>
                {analysisResult.viabilityScore.regulatory}%
              </div>
              <div style={{ color: '#6b7280' }}>Regulatory</div>
            </div>
          </div>
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
            {analysisResult.viabilityScore.explanation}
          </p>
        </div>
      )}

      {/* Target Audience */}
      {analysisResult.targetAudience && (
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Target Audience
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <strong>Primary Audience:</strong>
              <p style={{ marginTop: '4px', color: '#6b7280' }}>{analysisResult.targetAudience.primary}</p>
            </div>
            <div>
              <strong>Secondary Audience:</strong>
              <p style={{ marginTop: '4px', color: '#6b7280' }}>{analysisResult.targetAudience.secondary}</p>
            </div>
            <div>
              <strong>Market Size:</strong>
              <p style={{ marginTop: '4px', color: '#6b7280' }}>{analysisResult.targetAudience.marketSize}</p>
            </div>
          </div>
          {analysisResult.targetAudience.demographics && analysisResult.targetAudience.demographics.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <strong>Key Demographics:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {analysisResult.targetAudience.demographics.map((demo, index) => (
                  <span key={index} style={{
                    background: '#e0e7ff',
                    color: '#3730a3',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '0.9rem'
                  }}>
                    {demo}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Competitor Landscape */}
      {analysisResult.competitorLandscape && (
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Competitive Analysis
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <strong>Direct Competitors:</strong>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                {analysisResult.competitorLandscape.directCompetitors?.map((competitor, index) => (
                  <li key={index} style={{ color: '#6b7280', marginBottom: '4px' }}>{competitor}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Indirect Competitors:</strong>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                {analysisResult.competitorLandscape.indirectCompetitors?.map((competitor, index) => (
                  <li key={index} style={{ color: '#6b7280', marginBottom: '4px' }}>{competitor}</li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <strong>Market Opportunity:</strong>
            <p style={{ marginTop: '4px', color: '#6b7280' }}>{analysisResult.competitorLandscape.marketGap}</p>
          </div>
          <div style={{ marginTop: '12px' }}>
            <strong>Competitive Advantage:</strong>
            <p style={{ marginTop: '4px', color: '#6b7280' }}>{analysisResult.competitorLandscape.competitiveAdvantage}</p>
          </div>
        </div>
      )}

      {/* Mandatory Licenses */}
      {analysisResult.mandatoryLicenses && analysisResult.mandatoryLicenses.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Required Licenses & Registrations
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {analysisResult.mandatoryLicenses.map((license, index) => (
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
                  <span className={getPriorityClass(license.priority)}>
                    {license.priority} Priority
                  </span>
                </div>
                <p style={{ color: '#6b7280', marginBottom: '12px' }}>
                  {license.description}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', fontSize: '0.9rem' }}>
                  <div>
                    <strong>Authority:</strong>
                    <p style={{ marginTop: '2px', color: '#6b7280' }}>{license.authority}</p>
                  </div>
                  <div>
                    <strong>Timeline:</strong>
                    <p style={{ marginTop: '2px', color: '#6b7280' }}>{license.timeline}</p>
                  </div>
                  <div>
                    <strong>Cost:</strong>
                    <p style={{ marginTop: '2px', color: '#6b7280' }}>{license.cost}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Projections */}
      {analysisResult.financialProjection && (
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Financial Projections
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <strong>Initial Investment:</strong>
              <p style={{ marginTop: '4px', color: '#6b7280', fontSize: '1.1rem', fontWeight: '500' }}>
                {analysisResult.financialProjection.initialInvestment}
              </p>
            </div>
            <div>
              <strong>Monthly Operating Cost:</strong>
              <p style={{ marginTop: '4px', color: '#6b7280', fontSize: '1.1rem', fontWeight: '500' }}>
                {analysisResult.financialProjection.monthlyOperatingCost}
              </p>
            </div>
            <div>
              <strong>Break-even Timeline:</strong>
              <p style={{ marginTop: '4px', color: '#6b7280', fontSize: '1.1rem', fontWeight: '500' }}>
                {analysisResult.financialProjection.breakEvenTimeline}
              </p>
            </div>
          </div>
          {analysisResult.financialProjection.revenueStreams && (
            <div style={{ marginTop: '16px' }}>
              <strong>Revenue Streams:</strong>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                {analysisResult.financialProjection.revenueStreams.map((stream, index) => (
                  <li key={index} style={{ color: '#6b7280', marginBottom: '4px' }}>{stream}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Roadmap */}
      {analysisResult.roadmap && analysisResult.roadmap.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Implementation Roadmap
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {analysisResult.roadmap.map((phase, index) => (
              <div key={index} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '16px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#374151' }}>
                    {phase.phase}
                  </h3>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    Duration: {phase.duration}
                  </span>
                </div>
                
                {phase.tasks && phase.tasks.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Key Tasks:</strong>
                    <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                      {phase.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} style={{ color: '#6b7280', marginBottom: '2px' }}>{task}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {phase.milestones && phase.milestones.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Milestones:</strong>
                    <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                      {phase.milestones.map((milestone, milestoneIndex) => (
                        <li key={milestoneIndex} style={{ color: '#6b7280', marginBottom: '2px' }}>{milestone}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {phase.estimatedCost && (
                  <div>
                    <strong>Estimated Cost:</strong>
                    <span style={{ marginLeft: '8px', color: '#6b7280', fontWeight: '500' }}>
                      {phase.estimatedCost}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Assessment */}
      {analysisResult.riskAssessment && (
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Risk Assessment
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {analysisResult.riskAssessment.high && analysisResult.riskAssessment.high.length > 0 && (
              <div>
                <strong style={{ color: '#dc2626' }}>High Risk Factors:</strong>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  {analysisResult.riskAssessment.high.map((risk, index) => (
                    <li key={index} style={{ color: '#6b7280', marginBottom: '4px' }}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}
            {analysisResult.riskAssessment.medium && analysisResult.riskAssessment.medium.length > 0 && (
              <div>
                <strong style={{ color: '#f59e0b' }}>Medium Risk Factors:</strong>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  {analysisResult.riskAssessment.medium.map((risk, index) => (
                    <li key={index} style={{ color: '#6b7280', marginBottom: '4px' }}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}
            {analysisResult.riskAssessment.low && analysisResult.riskAssessment.low.length > 0 && (
              <div>
                <strong style={{ color: '#10b981' }}>Low Risk Factors:</strong>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  {analysisResult.riskAssessment.low.map((risk, index) => (
                    <li key={index} style={{ color: '#6b7280', marginBottom: '4px' }}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {analysisResult.riskAssessment.mitigation && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
              <strong>Risk Mitigation Strategy:</strong>
              <p style={{ marginTop: '4px', color: '#6b7280' }}>{analysisResult.riskAssessment.mitigation}</p>
            </div>
          )}
        </div>
      )}

      {/* Government Schemes */}
      {analysisResult.governmentSchemes && analysisResult.governmentSchemes.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Relevant Government Schemes
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {analysisResult.governmentSchemes.map((scheme, index) => (
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
                <div style={{ marginBottom: '8px' }}>
                  <strong>Eligibility:</strong>
                  <p style={{ marginTop: '2px', color: '#6b7280' }}>{scheme.eligibility}</p>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Benefits:</strong>
                  <p style={{ marginTop: '2px', color: '#6b7280' }}>{scheme.benefits}</p>
                </div>
                <div>
                  <strong>How to Apply:</strong>
                  <p style={{ marginTop: '2px', color: '#6b7280' }}>{scheme.applicationProcess}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {analysisResult.nextSteps && (
        <div className="next-action">
          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '16px' }}>
            🎯 Your Action Plan
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <strong style={{ color: '#dc2626' }}>Immediate (Next 1-2 weeks):</strong>
              <p style={{ marginTop: '4px', color: '#1e40af' }}>{analysisResult.nextSteps.immediate}</p>
            </div>
            <div>
              <strong style={{ color: '#f59e0b' }}>Short-term (1-3 months):</strong>
              <p style={{ marginTop: '4px', color: '#1e40af' }}>{analysisResult.nextSteps.shortTerm}</p>
            </div>
            <div>
              <strong style={{ color: '#10b981' }}>Long-term (6+ months):</strong>
              <p style={{ marginTop: '4px', color: '#1e40af' }}>{analysisResult.nextSteps.longTerm}</p>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ 
        marginTop: '32px', 
        padding: '16px', 
        backgroundColor: '#fef3c7', 
        borderRadius: '8px',
        border: '1px solid #f59e0b'
      }}>
        <p style={{ fontSize: '0.9rem', color: '#92400e' }}>
          <strong>Disclaimer:</strong> This analysis is for guidance purposes only and does not constitute legal, financial, or business advice. 
          Please consult with relevant authorities, legal experts, and business advisors before making business decisions. 
          Requirements and market conditions may vary based on specific circumstances, location, and time.
        </p>
      </div>
    </div>
  )
}

export default EnhancedDashboard