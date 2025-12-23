import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import EnhancedDashboard from './components/EnhancedDashboard'
import SearchHistory from './components/SearchHistory'
import TestAPI from './components/TestAPI'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<EnhancedDashboard />} />
          <Route path="/dashboard-legacy" element={<Dashboard />} />
          <Route path="/history" element={<SearchHistory />} />
          <Route path="/test" element={<TestAPI />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App