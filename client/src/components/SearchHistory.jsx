import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analysisAPI, authUtils } from '../services/api'

function SearchHistory() {
  const [searches, setSearches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check authentication
    const { user: savedUser } = authUtils.getAuthData()
    if (!savedUser) {
      navigate('/')
      return
    }
    setUser(savedUser)
    
    // Load search history
    loadSearchHistory(1)
  }, [navigate])

  const loadSearchHistory = async (page = 1) => {
    try {
      setLoading(true)
      const response = await analysisAPI.getSearchHistory(page, 10)
      setSearches(response.searches)
      setPagination(response.pagination)
      setCurrentPage(page)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleViewSearch = (search) => {
    navigate('/dashboard', {
      state: {
        analysisResult: search.aiAnalysis,
        originalIdea: search.businessIdea,
        searchId: search.id
      }
    })
  }

  const handleDeleteSearch = async (searchId) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) {
      return
    }

    try {
      await analysisAPI.deleteSearch(searchId)
      // Reload current page
      loadSearchHistory(currentPage)
    } catch (err) {
      setError(err.message)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getViabilityScore = (analysis) => {
    return analysis?.viabilityScore?.overall || 'N/A'
  }

  const getScoreColor = (score) => {
    if (score === 'N/A') return '#6b7280'
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  if (loading && searches.length === 0) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your search history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '8px' }}>
            My Analysis History
          </h1>
          <p style={{ color: '#64748b' }}>
            {user && `Welcome back, ${user.name}`}
          </p>
        </div>
        <button 
          className="btn" 
          onClick={() => navigate('/')}
        >
          New Analysis
        </button>
      </div>

      {error && (
        <div className="error" style={{ marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {searches.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <h3 style={{ color: '#6b7280', marginBottom: '16px' }}>No analysis history found</h3>
          <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
            Start by analyzing your first business idea to see it here.
          </p>
          <button 
            className="btn" 
            onClick={() => navigate('/')}
          >
            Analyze Business Idea
          </button>
        </div>
      ) : (
        <>
          {/* Search Results */}
          <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
            {searches.map((search) => (
              <div key={search.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '8px',
                      lineHeight: '1.4'
                    }}>
                      {search.businessIdea.length > 100 
                        ? search.businessIdea.substring(0, 100) + '...'
                        : search.businessIdea
                      }
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.9rem', color: '#6b7280' }}>
                      <span>📅 {formatDate(search.createdAt)}</span>
                      <span style={{ 
                        color: getScoreColor(getViabilityScore(search.aiAnalysis)),
                        fontWeight: '500'
                      }}>
                        📊 Viability: {getViabilityScore(search.aiAnalysis)}%
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                    <button
                      onClick={() => handleViewSearch(search)}
                      className="btn"
                      style={{ 
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        background: '#6b7280'
                      }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteSearch(search.id)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '0.9rem',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Quick Preview */}
                {search.aiAnalysis?.targetAudience?.primary && (
                  <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#f8fafc', 
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    color: '#6b7280'
                  }}>
                    <strong>Target Audience:</strong> {search.aiAnalysis.targetAudience.primary}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '12px',
              marginTop: '32px'
            }}>
              <button
                onClick={() => loadSearchHistory(currentPage - 1)}
                disabled={!pagination.hasPrevPage || loading}
                className="btn"
                style={{ 
                  background: pagination.hasPrevPage ? '#6b7280' : '#d1d5db',
                  cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed'
                }}
              >
                Previous
              </button>
              
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => loadSearchHistory(currentPage + 1)}
                disabled={!pagination.hasNextPage || loading}
                className="btn"
                style={{ 
                  background: pagination.hasNextPage ? '#6b7280' : '#d1d5db',
                  cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed'
                }}
              >
                Next
              </button>
            </div>
          )}

          {/* Stats */}
          <div style={{ 
            marginTop: '32px', 
            padding: '16px', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#1e40af', margin: 0 }}>
              📈 Total Analyses: {pagination.totalCount || searches.length}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default SearchHistory