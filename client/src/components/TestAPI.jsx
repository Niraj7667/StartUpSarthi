import React, { useState } from 'react'
import { authAPI, analysisAPI, authUtils } from '../services/api'

function TestAPI() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const addResult = (test, result, success = true) => {
    setResults(prev => [...prev, { test, result, success, timestamp: new Date().toLocaleTimeString() }])
  }

  const testHealthCheck = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/health')
      const data = await response.json()
      addResult('Health Check', `Server status: ${data.status}`, true)
    } catch (error) {
      addResult('Health Check', `Error: ${error.message}`, false)
    }
    setLoading(false)
  }

  const testGuestAnalysis = async () => {
    setLoading(true)
    try {
      const result = await analysisAPI.analyzeIdea('Test cloud kitchen business in Mumbai')
      addResult('Guest Analysis', `Analysis completed. Search ID: ${result.searchId}`, true)
    } catch (error) {
      addResult('Guest Analysis', `Error: ${error.message}`, false)
    }
    setLoading(false)
  }

  const testSignup = async () => {
    setLoading(true)
    try {
      const result = await authAPI.signup({
        name: 'Test User Frontend',
        email: `test${Date.now()}@example.com`,
        password: 'test123'
      })
      authUtils.setAuthData(result.token, result.user)
      addResult('Signup', `User created: ${result.user.name}`, true)
    } catch (error) {
      addResult('Signup', `Error: ${error.message}`, false)
    }
    setLoading(false)
  }

  const testAuthenticatedAnalysis = async () => {
    setLoading(true)
    try {
      const result = await analysisAPI.analyzeIdea('Authenticated test: E-commerce platform for handmade crafts')
      addResult('Authenticated Analysis', `Analysis completed. User: ${result.user?.name || 'Guest'}`, true)
    } catch (error) {
      addResult('Authenticated Analysis', `Error: ${error.message}`, false)
    }
    setLoading(false)
  }

  const testSearchHistory = async () => {
    setLoading(true)
    try {
      const result = await analysisAPI.getSearchHistory()
      addResult('Search History', `Found ${result.searches.length} searches`, true)
    } catch (error) {
      addResult('Search History', `Error: ${error.message}`, false)
    }
    setLoading(false)
  }

  const clearResults = () => {
    setResults([])
  }

  const clearAuth = () => {
    authUtils.clearAuthData()
    addResult('Clear Auth', 'Authentication data cleared', true)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px', color: '#1e40af' }}>API Integration Test</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        <button className="btn" onClick={testHealthCheck} disabled={loading}>
          Test Health Check
        </button>
        <button className="btn" onClick={testGuestAnalysis} disabled={loading}>
          Test Guest Analysis
        </button>
        <button className="btn" onClick={testSignup} disabled={loading}>
          Test Signup
        </button>
        <button className="btn" onClick={testAuthenticatedAnalysis} disabled={loading}>
          Test Auth Analysis
        </button>
        <button className="btn" onClick={testSearchHistory} disabled={loading}>
          Test Search History
        </button>
        <button className="btn" onClick={clearAuth} disabled={loading} style={{ background: '#6b7280' }}>
          Clear Auth
        </button>
        <button className="btn" onClick={clearResults} disabled={loading} style={{ background: '#ef4444' }}>
          Clear Results
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Running test...</p>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h2 style={{ marginBottom: '10px' }}>Test Results:</h2>
        {results.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No tests run yet. Click a button above to test the API.</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {results.map((result, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: result.success ? '#dcfce7' : '#fee2e2',
                  border: `1px solid ${result.success ? '#bbf7d0' : '#fecaca'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: result.success ? '#166534' : '#991b1b' }}>
                    {result.success ? '✅' : '❌'} {result.test}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    {result.timestamp}
                  </span>
                </div>
                <p style={{ 
                  marginTop: '4px', 
                  color: result.success ? '#166534' : '#991b1b',
                  fontSize: '0.9rem'
                }}>
                  {result.result}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
        <h3 style={{ color: '#1e40af', marginBottom: '8px' }}>Current Auth Status:</h3>
        <p style={{ color: '#6b7280' }}>
          {authUtils.isAuthenticated() ? (
            <>Authenticated as: {authUtils.getAuthData().user?.name || 'Unknown'}</>
          ) : (
            'Not authenticated (Guest mode)'
          )}
        </p>
      </div>
    </div>
  )
}

export default TestAPI