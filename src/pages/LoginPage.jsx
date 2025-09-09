import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import ugetmeLogo from '../assets/ugetme_logo.png'
import apiService from '../services/api'

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await apiService.login({
        email: formData.email,
        password: formData.password
      })

      // Call the onLogin callback to update app state
      onLogin(response.user)
      
      // Check if user has completed profile
      if (response.user.hasCompletedProfile) {
        navigate('/home')
      } else {
        navigate('/profile-creation')
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="ugetme-logo mb-2">UGETME</div>
          <p className="text-primary text-lg font-medium">Connect. Share. Discover.</p>
        </div>

        {/* Login Form */}
        <div className="card-ucme">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <div>
              <Input
                type="email"
                name="email"
                placeholder="Username or Email"
                value={formData.email}
                onChange={handleChange}
                className="input-sames w-full h-12"
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input-sames w-full h-12 pr-12"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1 h-12"
              >
                {isLoading ? 'Logging in...' : 'LOGIN'}
              </Button>
              <Link to="/signup" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="btn-signup w-full h-12"
                >
                  SIGNUP
                </Button>
              </Link>
            </div>

            <div className="text-center space-y-2">
              <Link to="/forgot-password" className="text-primary hover:underline text-sm">
                Forgot Password?
              </Link>
              <br />
              <Link to="/help" className="text-primary hover:underline text-sm">
                Trouble Logging In?
              </Link>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-4">or log in with</p>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  className="w-12 h-12 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <span className="text-lg">f</span>
                </button>
                <button
                  type="button"
                  className="w-12 h-12 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <span className="text-lg">G</span>
                </button>
                <button
                  type="button"
                  className="w-12 h-12 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M17.417 11.213c-.85-.97-2.112-1.636-3.614-1.636-1.93 0-3.354 1.093-4.143 2.653-.143.28-.273.6-.39.93-.01.026-.02.05-.03.076-.01-.026-.02-.05-.03-.076-.78-1.55-2.203-2.643-4.133-2.643-1.502 0-2.764.666-3.614 1.636-1.618 1.85-2.58 4.22-2.58 6.91 0 2.69 1.01 5.06 2.58 6.91.85.97 2.112 1.636 3.614 1.636 1.93 0 3.354-1.093 4.143-2.653.143-.28.273-.6.39-.93.01-.026.02-.05.03-.076.01.026.02.05.03.076.78 1.55 2.203 2.643 4.133 2.643 1.502 0 2.764-.666 3.614-1.636 1.618-1.85 2.58-4.22 2.58-6.91 0-2.69-1.01-5.06-2.58-6.91zM12 2.08c-.01.026-.02.05-.03.076-.78 1.55-2.203 2.643-4.133 2.643-1.502 0-2.764-.666-3.614-1.636C2.638 1.29 1.676-1.08 1.676-3.77c0-2.69 1.01-5.06 2.58-6.91.85-.97 2.112-1.636 3.614-1.636 1.93 0 3.354 1.093 4.143 2.653.143.28.273-.6.39-.93.01-.026.02-.05.03-.076.78 1.55 2.203 2.643 4.133 2.643 1.502 0 2.764-.666 3.614-1.636 1.618-1.85 2.58-4.22 2.58-6.91 0-2.69-1.01-5.06-2.58-6.91z" transform="translate(0 10)" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

