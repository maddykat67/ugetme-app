import { Link, useLocation } from 'react-router-dom'
import { Home, Users, MessageCircle, User, Settings, LogOut } from 'lucide-react'

const Navigation = ({ user, onLogout }) => {
  const location = useLocation()

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/matching', icon: Users, label: 'Discover' },
    { path: '/groups', icon: MessageCircle, label: 'Groups' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon 
                size={24} 
                className={`mb-1 ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,68,68,0.6)]' : ''}`} 
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
        
        <button
          onClick={onLogout}
          className="flex flex-col items-center p-3 rounded-lg transition-all duration-300 text-muted-foreground hover:text-destructive"
        >
          <LogOut size={24} className="mb-1" />
          <span className="text-xs font-medium">Logout</span>
        </button>
      </div>
    </nav>
  )
}

export default Navigation

