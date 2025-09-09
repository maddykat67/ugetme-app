import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Settings, Edit, Share, MapPin, Calendar, Crown, Star } from 'lucide-react'

const ProfilePage = ({ user }) => {
  const { userId } = useParams()
  const isOwnProfile = !userId || userId === user.id.toString()
  
  const [profileData] = useState({
    id: isOwnProfile ? user.id : userId,
    name: isOwnProfile ? user.username : 'Alex K',
    age: 28,
    location: 'New York, USA',
    joinDate: 'March 2024',
    bio: isOwnProfile 
      ? 'Creative soul who loves art, technology, and deep conversations. Always looking for new adventures and meaningful connections.'
      : 'Creative soul who loves art, technology, and deep conversations. Always looking for new adventures and meaningful connections.',
    image: isOwnProfile ? '👤' : '👨‍💻',
    isPremium: false,
    stats: {
      matches: 156,
      groups: 12,
      connections: 89,
      profileViews: 1240
    },
    commonalities: {
      personalityTraits: ['Creative', 'Introverted', 'Curious', 'Empathetic'],
      likes: ['Art', 'Technology', 'Coffee', 'Reading', 'Photography', 'Music'],
      dislikes: ['Crowds', 'Small talk', 'Loud noises', 'Rushed decisions'],
      fears: ['Heights', 'Public speaking', 'Failure', 'Being misunderstood'],
      habits: ['Morning coffee ritual', 'Late night coding', 'Weekend art projects', 'Daily journaling']
    },
    recentActivity: [
      { type: 'match', text: 'Matched with Sarah M', time: '2 hours ago' },
      { type: 'group', text: 'Joined "Coffee Connoisseurs"', time: '1 day ago' },
      { type: 'update', text: 'Updated profile bio', time: '3 days ago' }
    ]
  })

  const renderCommonalitySection = (title, items, variant = 'secondary') => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Badge key={index} variant={variant} className={`
            ${variant === 'secondary' ? 'bg-secondary/20 text-secondary border-secondary/30' : ''}
            ${variant === 'destructive' ? 'bg-primary/20 text-primary border-primary/30' : ''}
            ${variant === 'outline' ? 'border-muted-foreground/30 text-muted-foreground' : ''}
          `}>
            {item}
          </Badge>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {isOwnProfile ? 'My Profile' : 'Profile'}
          </h1>
          <div className="flex space-x-2">
            {isOwnProfile ? (
              <>
                <Button variant="outline" size="sm">
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Settings size={16} />
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm">
                <Share size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <Card className="card-sames mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-4xl mx-auto mb-4 relative">
                {profileData.image}
                {profileData.isPremium && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                    <Crown size={12} className="text-secondary-foreground" />
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-1">{profileData.name}</h2>
              <div className="flex items-center justify-center text-muted-foreground mb-2">
                <span>{profileData.age}</span>
                <span className="mx-2">•</span>
                <MapPin size={14} className="mr-1" />
                <span>{profileData.location}</span>
              </div>
              
              <div className="flex items-center justify-center text-muted-foreground text-sm mb-4">
                <Calendar size={14} className="mr-1" />
                <span>Joined {profileData.joinDate}</span>
              </div>

              <p className="text-foreground leading-relaxed">{profileData.bio}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{profileData.stats.matches}</p>
                <p className="text-xs text-muted-foreground">Matches</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">{profileData.stats.groups}</p>
                <p className="text-xs text-muted-foreground">Groups</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{profileData.stats.connections}</p>
                <p className="text-xs text-muted-foreground">Connections</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">{profileData.stats.profileViews}</p>
                <p className="text-xs text-muted-foreground">Profile Views</p>
              </div>
            </div>

            {!isOwnProfile && (
              <div className="flex space-x-3">
                <Button className="btn-primary flex-1">
                  Message
                </Button>
                <Button className="btn-secondary flex-1">
                  Connect
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Commonalities */}
        <Card className="card-sames mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <Star className="mr-2 text-primary" size={24} />
              Commonalities
            </h2>

            {renderCommonalitySection('Personality Traits', profileData.commonalities.personalityTraits, 'secondary')}
            {renderCommonalitySection('Likes', profileData.commonalities.likes, 'secondary')}
            {renderCommonalitySection('Dislikes', profileData.commonalities.dislikes, 'destructive')}
            {renderCommonalitySection('Fears', profileData.commonalities.fears, 'outline')}
            {renderCommonalitySection('Habits', profileData.commonalities.habits, 'outline')}
          </CardContent>
        </Card>

        {/* Recent Activity (only for own profile) */}
        {isOwnProfile && (
          <Card className="card-sames mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
              
              <div className="space-y-4">
                {profileData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'match' ? 'bg-primary' :
                      activity.type === 'group' ? 'bg-secondary' :
                      'bg-muted-foreground'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Premium Upgrade (only for own profile if not premium) */}
        {isOwnProfile && !profileData.isPremium && (
          <Card className="card-sames bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center">
                <Crown className="mx-auto text-primary mb-3" size={32} />
                <h3 className="text-lg font-bold text-foreground mb-2">Upgrade to Premium</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Unlock advanced matching, exclusive groups, and premium features
                </p>
                <Button className="btn-primary">
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ProfilePage

