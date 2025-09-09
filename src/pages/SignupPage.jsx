import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'

const SignupPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        email: formData.email,
        username: formData.username,
        hasCompletedProfile: false
      }
      onLogin(userData)
      setIsLoading(false)
    }, 1000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="sames-logo mb-2">SAMES</div>
          <p className="text-primary text-lg font-medium">Join the Community</p>
        </div>

        {/* Signup Form */}
        <div className="card-sames">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="input-sames w-full h-12"
                required
              />
            </div>

            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="input-sames w-full h-12"
                required
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-sames w-full h-12 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="btn-secondary flex-1 h-12"
              >
                {isLoading ? 'Creating Account...' : 'SIGNUP'}
              </Button>
              <Link to="/login" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="btn-primary w-full h-12"
                >
                  LOGIN
                </Button>
              </Link>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-4">or sign up with</p>
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
                  <span className="text-lg">🍎</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignupPage

