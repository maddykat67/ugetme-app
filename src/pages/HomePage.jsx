import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, MessageCircle, Heart, TrendingUp, Star, Crown } from 'lucide-react'

const HomePage = ({ user }) => {
  const [stats, setStats] = useState({
    matches: 12,
    groups: 5,
    messages: 23,
    profileViews: 156
  })

  const [recentMatches] = useState([
    { id: 1, name: 'Alex K', commonalities: ['Tech', 'Art'], mutualFriends: 5, image: '👨‍💻' },
    { id: 2, name: 'Sarah M', commonalities: ['Books', 'Coffee'], mutualFriends: 3, image: '👩‍🎨' },
    { id: 3, name: 'Mike R', commonalities: ['Gaming', 'Music'], mutualFriends: 8, image: '🎮' }
  ])

  const [suggestedGroups] = useState([
    { id: 1, name: 'Book Lovers', members: '2.1K', description: 'Discuss your favorite reads', icon: '📚' },
    { id: 2, name: 'Coffee Addicts', members: '1.8K', description: 'Share your coffee experiences', icon: '☕' },
    { id: 3, name: 'Night Owls', members: '956', description: 'For those who love the night', icon: '🦉' }
  ])

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl">
            👋
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="card-ucme p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Heart className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.matches}</p>
                <p className="text-xs text-muted-foreground">New Matches</p>
              </div>
            </div>
          </Card>

          <Card className="card-ucme p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                <Users className="text-secondary" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.groups}</p>
                <p className="text-xs text-muted-foreground">Active Groups</p>
              </div>
            </div>
          </Card>

          <Card className="card-ucme p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <MessageCircle className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.messages}</p>
                <p className="text-xs text-muted-foreground">Unread Messages</p>
              </div>
            </div>
          </Card>

          <Card className="card-ucme p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                <TrendingUp className="text-secondary" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.profileViews}</p>
                <p className="text-xs text-muted-foreground">Profile Views</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link to="/matching">
            <Button className="btn-primary w-full h-16 text-lg">
              <Heart className="mr-2" size={24} />
              Discover
            </Button>
          </Link>
          <Link to="/groups">
            <Button className="btn-secondary w-full h-16 text-lg">
              <Users className="mr-2" size={24} />
              Groups
            </Button>
          </Link>
        </div>

        {/* Recent Matches */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Matches</h2>
            <Link to="/matching" className="text-primary text-sm hover:underline">
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentMatches.map((match) => (
              <Card key={match.id} className="card-ucme">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-xl">
                      {match.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{match.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {match.commonalities.map((common, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {common}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {match.mutualFriends} mutual connections
                      </p>
                    </div>
                    <Button size="sm" className="btn-primary">
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Suggested Groups */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Suggested Groups</h2>
            <Link to="/groups" className="text-primary text-sm hover:underline">
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {suggestedGroups.map((group) => (
              <Card key={group.id} className="card-ucme">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center text-xl">
                      {group.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{group.name}</h3>
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {group.members} members
                      </p>
                    </div>
                    <Button size="sm" className="btn-secondary">
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium Upgrade Banner */}
        <Card className="card-ucme mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Crown className="text-primary" size={24} />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Upgrade to Premium</h3>
                <p className="text-sm text-muted-foreground">Unlock advanced matching and exclusive features</p>
              </div>
              <Button size="sm" className="btn-primary">
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HomePage

