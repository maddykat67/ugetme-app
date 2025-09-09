import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Users, Plus, TrendingUp, Clock, Star } from 'lucide-react'

const GroupsPage = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('discover') // discover, my-groups, trending

  const [myGroups] = useState([
    {
      id: 1,
      name: 'Night Owls',
      members: 1200,
      description: 'For those who come alive after midnight',
      icon: '🦉',
      unreadMessages: 5,
      lastActivity: '2 hours ago',
      role: 'member'
    },
    {
      id: 2,
      name: 'Coffee Connoisseurs',
      members: 850,
      description: 'Discussing the perfect brew',
      icon: '☕',
      unreadMessages: 12,
      lastActivity: '30 minutes ago',
      role: 'admin'
    }
  ])

  const [discoverGroups] = useState([
    {
      id: 3,
      name: 'Foodies Unite',
      members: 3200,
      description: 'Share your culinary adventures and discoveries',
      icon: '🍕',
      tags: ['Food', 'Cooking', 'Restaurants'],
      matchScore: 95
    },
    {
      id: 4,
      name: 'Travel Buddies',
      members: 2100,
      description: 'Find travel companions and share experiences',
      icon: '✈️',
      tags: ['Travel', 'Adventure', 'Culture'],
      matchScore: 88
    },
    {
      id: 5,
      name: 'Local Artists',
      members: 750,
      description: 'Connect with creative minds in your area',
      icon: '🎨',
      tags: ['Art', 'Creative', 'Local'],
      matchScore: 92
    },
    {
      id: 6,
      name: 'Gamers Guild',
      members: 4500,
      description: 'Level up together in your favorite games',
      icon: '🎮',
      tags: ['Gaming', 'Esports', 'Community'],
      matchScore: 78
    },
    {
      id: 7,
      name: 'Bookworms',
      members: 1800,
      description: 'Discuss literature and share recommendations',
      icon: '📚',
      tags: ['Books', 'Literature', 'Reading'],
      matchScore: 85
    },
    {
      id: 8,
      name: 'Fitness Fanatics',
      members: 2800,
      description: 'Motivate each other to stay healthy',
      icon: '💪',
      tags: ['Fitness', 'Health', 'Motivation'],
      matchScore: 72
    }
  ])

  const [trendingGroups] = useState([
    {
      id: 9,
      name: 'Crypto Curious',
      members: 5200,
      description: 'Navigate the world of cryptocurrency together',
      icon: '₿',
      growth: '+45%',
      tags: ['Crypto', 'Finance', 'Technology']
    },
    {
      id: 10,
      name: 'Plant Parents',
      members: 3800,
      description: 'Growing green thumbs one plant at a time',
      icon: '🌱',
      growth: '+38%',
      tags: ['Plants', 'Gardening', 'Nature']
    },
    {
      id: 11,
      name: 'Remote Workers',
      members: 6100,
      description: 'Tips and support for working from anywhere',
      icon: '💻',
      growth: '+52%',
      tags: ['Remote Work', 'Productivity', 'Lifestyle']
    }
  ])

  const filteredGroups = (groups) => {
    if (!searchQuery) return groups
    return groups.filter(group => 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (group.tags && group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  }

  const renderGroupCard = (group, showJoinButton = true, showActivity = false) => (
    <Card key={group.id} className="card-sames">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
            {group.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-foreground truncate">{group.name}</h3>
              {group.matchScore && (
                <Badge variant="secondary" className="bg-secondary/20 text-secondary text-xs">
                  <Star size={10} className="mr-1" />
                  {group.matchScore}%
                </Badge>
              )}
              {group.growth && (
                <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                  <TrendingUp size={10} className="mr-1" />
                  {group.growth}
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{group.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                <Users size={12} className="mr-1" />
                <span>{group.members.toLocaleString()} members</span>
                {group.role && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {group.role}
                  </Badge>
                )}
              </div>
              
              {showActivity && group.lastActivity && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock size={12} className="mr-1" />
                  <span>{group.lastActivity}</span>
                </div>
              )}
            </div>

            {group.tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {group.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {group.unreadMessages && group.unreadMessages > 0 && (
              <div className="mt-2">
                <Badge variant="destructive" className="text-xs">
                  {group.unreadMessages} new messages
                </Badge>
              </div>
            )}
          </div>
          
          {showJoinButton && (
            <Button size="sm" className="btn-primary flex-shrink-0">
              Join
            </Button>
          )}
          
          {showActivity && (
            <Button size="sm" variant="outline" className="flex-shrink-0">
              Open
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <Users className="text-secondary mr-2" size={28} />
            Groups
          </h1>
          <Button size="sm" className="btn-secondary">
            <Plus size={16} className="mr-2" />
            Create
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-sames pl-12"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-muted rounded-full p-1">
          {[
            { id: 'discover', label: 'Discover' },
            { id: 'my-groups', label: 'My Groups' },
            { id: 'trending', label: 'Trending' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'discover' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Recommended for You</h2>
                <span className="text-sm text-muted-foreground">
                  {filteredGroups(discoverGroups).length} groups
                </span>
              </div>
              {filteredGroups(discoverGroups).map(group => renderGroupCard(group, true, false))}
            </>
          )}

          {activeTab === 'my-groups' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Your Groups</h2>
                <span className="text-sm text-muted-foreground">
                  {filteredGroups(myGroups).length} groups
                </span>
              </div>
              {filteredGroups(myGroups).length > 0 ? (
                filteredGroups(myGroups).map(group => renderGroupCard(group, false, true))
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto text-muted-foreground mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Groups Yet</h3>
                  <p className="text-muted-foreground mb-4">Join some groups to get started!</p>
                  <Button onClick={() => setActiveTab('discover')} className="btn-primary">
                    Discover Groups
                  </Button>
                </div>
              )}
            </>
          )}

          {activeTab === 'trending' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Trending Groups</h2>
                <span className="text-sm text-muted-foreground">
                  {filteredGroups(trendingGroups).length} groups
                </span>
              </div>
              {filteredGroups(trendingGroups).map(group => renderGroupCard(group, true, false))}
            </>
          )}
        </div>

        {/* Empty State for Search */}
        {searchQuery && (
          activeTab === 'discover' ? filteredGroups(discoverGroups).length === 0 :
          activeTab === 'my-groups' ? filteredGroups(myGroups).length === 0 :
          filteredGroups(trendingGroups).length === 0
        ) && (
          <div className="text-center py-12">
            <Search className="mx-auto text-muted-foreground mb-4" size={48} />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Results Found</h3>
            <p className="text-muted-foreground">Try searching with different keywords</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupsPage

