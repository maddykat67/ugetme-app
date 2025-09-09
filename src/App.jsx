import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'

// Import pages
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProfileCreationPage from './pages/ProfileCreationPage'
import HomePage from './pages/HomePage'
import MatchingPage from './pages/MatchingPage'
import GroupsPage from './pages/GroupsPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'

// Import components
import Navigation from './components/Navigation'

function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (from localStorage or API)
    const savedUser = localStorage.getItem("ugetme_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("ugetme_user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ucme_user")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="ucme-logo mb-4">UGETME</div>
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {user && <Navigation user={user} onLogout={logout} />}
        
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={!user ? <LoginPage onLogin={login} /> : <Navigate to="/home" />} 
          />
          <Route 
            path="/signup" 
            element={!user ? <SignupPage onLogin={login} /> : <Navigate to="/home" />} 
          />
          
          {/* Protected routes */}
          <Route 
            path="/profile-creation" 
            element={user ? <ProfileCreationPage user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/home" 
            element={user ? <HomePage user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/matching" 
            element={user ? <MatchingPage user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/groups" 
            element={user ? <GroupsPage user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/chat/:userId?" 
            element={user ? <ChatPage user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile/:userId?" 
            element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />} 
          />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={<Navigate to={user ? "/home" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

