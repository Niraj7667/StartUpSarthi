import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analysisAPI, authUtils, sessionUtils } from '../services/api'
import LoginModal from './Auth/LoginModal'
import SignupModal from './Auth/SignupModal'

function Home() {
  const [idea, setIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already logged in
    const { user: savedUser } = authUtils.getAuthData()
    if (savedUser) {
      setUser(savedUser)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!idea.trim()) {
      setError('Please enter your business idea')
      return
    }

    if (idea.length > 1000) {
      setError('Please limit your business idea to 1000 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Get session ID for guest users
      const sessionId = user ? null : sessionUtils.getSessionId()
      
      const result = await analysisAPI.analyzeIdea(idea, sessionId)
      
      // Navigate to enhanced dashboard
      navigate('/dashboard', { 
        state: { 
          analysisResult: result.analysis, 
          originalIdea: idea,
          searchId: result.searchId,
          sessionId: result.sessionId
        } 
      })
    } catch (err) {
      setError(err.message || 'Failed to analyze your business idea. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    authUtils.clearAuthData()
    sessionUtils.clearSessionId()
    setUser(null)
  }

  const switchToSignup = () => {
    setShowLoginModal(false)
    setShowSignupModal(true)
  }

  const switchToLogin = () => {
    setShowSignupModal(false)
    setShowLoginModal(true)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>
          StartupSaarthi
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              <span style={{ color: '#6b7280' }}>Welcome, {user.name}</span>
              <button
                onClick={() => navigate('/history')}
                className="btn"
                style={{ 
                  background: '#6b7280', 
                  padding: '8px 16px',
                  fontSize: '0.9rem'
                }}
              >
                My History
              </button>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowLoginModal(true)}
                style={{
                  background: 'none',
                  border: '1px solid #3b82f6',
                  color: '#3b82f6',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Login
              </button>
              <button
                onClick={() => setShowSignupModal(true)}
                className="btn"
                style={{ 
                  padding: '8px 16px',
                  fontSize: '0.9rem'
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#1e40af' }}>
              AI Co-Pilot for Indian Entrepreneurs
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '32px' }}>
              Get comprehensive business analysis, compliance guidance, and strategic insights powered by AI
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
                  placeholder="e.g., I want to start a cloud kitchen in Mumbai serving authentic South Indian cuisine with online delivery..."
                  disabled={loading}
                  maxLength={1000}
                />
                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>
                  {idea.length}/1000 characters
                </div>
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
                  'Get Comprehensive Analysis'
                )}
              </button>
            </form>

            <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                Your comprehensive analysis will include:
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '8px' }}>
                <div>
                  <div style={{ marginBottom: '4px', color: '#6b7280' }}>✓ Viability assessment with scores</div>
                  <div style={{ marginBottom: '4px', color: '#6b7280' }}>✓ Target audience analysis</div>
                  <div style={{ marginBottom: '4px', color: '#6b7280' }}>✓ Competitive landscape review</div>
                  <div style={{ marginBottom: '4px', color: '#6b7280' }}>✓ Required licenses & registrations</div>
                </div>
                <div>
                  <div style={{ marginBottom: '4px', color: '#6b7280' }}>✓ Implementation roadmap</div>
                  <div style={{ marginBottom: '4px', color: '#6b7280' }}>✓ Financial projections</div>
                  <div style={{ marginBottom: '4px', color: '#6b7280' }}>✓ Risk assessment & mitigation</div>
                  <div style={{ marginBottom: '4px', color: '#6b7280' }}>✓ Government schemes & funding</div>
                </div>
              </div>
            </div>

            {!user && (
              <div style={{ 
                marginTop: '24px', 
                padding: '12px', 
                backgroundColor: '#eff6ff', 
                borderRadius: '8px',
                border: '1px solid #3b82f6'
              }}>
                <p style={{ fontSize: '0.9rem', color: '#1e40af', margin: 0 }}>
                  💡 <strong>Tip:</strong> Sign up to save your analysis history and access advanced features!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleAuthSuccess}
        switchToSignup={switchToSignup}
      />
      
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSuccess={handleAuthSuccess}
        switchToLogin={switchToLogin}
      />
    </div>
  )
}

export default Home