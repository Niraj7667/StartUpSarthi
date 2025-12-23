import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeBusinessIdea } from '../services/api'

function Home() {
  const [idea, setIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!idea.trim()) {
      setError('Please enter your business idea')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await analyzeBusinessIdea(idea)
      // Pass the result to dashboard via navigation state
      navigate('/dashboard', { state: { analysisResult: result, originalIdea: idea } })
    } catch (err) {
      setError(err.message || 'Failed to analyze your business idea. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#1e40af' }}>
            StartupSaarthi
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '32px' }}>
            AI Co-Pilot for Indian Entrepreneurs
          </p>
          <p style={{ fontSize: '1rem', color: '#475569', marginBottom: '32px' }}>
            Get personalized guidance on licenses, compliance, and government schemes for your business idea
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px', textAlign: 'left' }}>
              <label htmlFor="business-idea" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Describe your business idea:
              </label>
              <textarea
                id="business-idea"
                className="textarea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g., I want to start a cloud kitchen in Assam serving traditional Assamese cuisine..."
                disabled={loading}
              />
            </div>

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn" 
              disabled={loading || !idea.trim()}
              style={{ width: '100%', fontSize: '1.1rem', padding: '16px' }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid #ffffff40', borderTop: '2px solid #ffffff' }}></div>
                  Analyzing your idea...
                </div>
              ) : (
                'Get Guidance'
              )}
            </button>
          </form>

          <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
              What you'll get:
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '4px', color: '#6b7280' }}>✓ Required licenses and registrations</li>
              <li style={{ marginBottom: '4px', color: '#6b7280' }}>✓ Step-by-step compliance roadmap</li>
              <li style={{ marginBottom: '4px', color: '#6b7280' }}>✓ Relevant government schemes</li>
              <li style={{ marginBottom: '4px', color: '#6b7280' }}>✓ Clear next actions to take</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home