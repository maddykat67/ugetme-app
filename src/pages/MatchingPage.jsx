import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, X, Star, MapPin, Users, Filter } from 'lucide-react'

const MatchingPage = ({ user }) => {
  const [currentMatch, setCurrentMatch] = useState(0)
  const [matches, setMatches] = useState([
    {
      id: 1,
      name: 'Alex K',
      age: 28,
      location: 'New York, USA',
      bio: 'Creative soul who loves art, technology, and deep conversations. Always looking for new adventures and meaningful connections.',
      commonalities: {
        likes: ['Art', 'Technology', 'Coffee', 'Reading'],
        dislikes: ['Crowds', 'Small talk'],
        fears: ['Heights', 'Public speaking'],
        traits: ['Creative', 'Introverted', 'Curious']
      },
      matchScore: 92,
      mutualFriends: 5,
      image: '👨‍💻'
    },
    {
      id: 2,
      name: 'Sarah M',
      age: 25,
      location: 'Brooklyn, NY',
      bio: 'Book lover and coffee enthusiast. Enjoys quiet evenings and meaningful conversations about life, philosophy, and everything in between.',
      commonalities: {
        likes: ['Books', 'Coffee', 'Philosophy', 'Cats'],
        dislikes: ['Loud music', 'Parties'],
        fears: ['Spiders', 'Failure'],
        traits: ['Thoughtful', 'Empathetic', 'Quiet']
      },
      matchScore: 88,
      mutualFriends: 3,
      image: '👩‍🎨'
    },
    {
      id: 3,
      name: 'Mike R',
      age: 30,
      location: 'Manhattan, NY',
      bio: 'Gaming enthusiast and music producer. Love creating beats and exploring virtual worlds. Always up for a good gaming session.',
      commonalities: {
        likes: ['Gaming', 'Music Production', 'Pizza', 'Late nights'],
        dislikes: ['Early mornings', 'Formal events'],
        fears: ['Commitment', 'Losing creativity'],
        traits: ['Creative', 'Night owl', 'Passionate']
      },
      matchScore: 85,
      mutualFriends: 8,
      image: '🎮'
    }
  ])

  const [dailyMatches] = useState(12)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleLike = () => {
    if (isAnimating) return
    setIsAnimating(true)
    
    setTimeout(() => {
      if (currentMatch < matches.length - 1) {
        setCurrentMatch(currentMatch + 1)
      } else {
        setCurrentMatch(0) // Loop back to first match
      }
      setIsAnimating(false)
    }, 300)
  }

  const handleDislike = () => {
    if (isAnimating) return
    setIsAnimating(true)
    
    setTimeout(() => {
      if (currentMatch < matches.length - 1) {
        setCurrentMatch(currentMatch + 1)
      } else {
        setCurrentMatch(0) // Loop back to first match
      }
      setIsAnimating(false)
    }, 300)
  }

  const currentUser = matches[currentMatch]

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No More Matches Today!</h2>
          <p className="text-muted-foreground mb-6">Check back tomorrow for new potential connections.</p>
          <Button className="btn-primary">Upgrade for More Matches</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center">
              <Heart className="text-primary mr-2" size={28} />
              Discover
            </h1>
            <p className="text-muted-foreground">Matches today: {dailyMatches - currentMatch}/12</p>
          </div>
          <Button variant="outline" size="sm" className="border-border">
            <Filter size={16} className="mr-2" />
            Filters
          </Button>
        </div>

        {/* Match Card */}
        <div className={`relative mb-6 transition-all duration-300 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
          <Card className="card-sames overflow-hidden">
            <CardContent className="p-0">
              {/* Profile Image Area */}
              <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                <div className="text-8xl">{currentUser.image}</div>
                
                {/* Match Score */}
                <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-bold flex items-center">
                  <Star size={14} className="mr-1" />
                  {currentUser.matchScore}%
                </div>
                
                {/* Mutual Friends */}
                {currentUser.mutualFriends > 0 && (
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Users size={14} className="mr-1" />
                    {currentUser.mutualFriends}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{currentUser.name}</h2>
                  <span className="text-muted-foreground">{currentUser.age}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">{currentUser.location}</span>
                </div>

                <p className="text-foreground mb-6 leading-relaxed">{currentUser.bio}</p>

                {/* Commonalities */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-secondary mb-2">Shared Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.commonalities.likes.map((like, index) => (
                        <Badge key={index} variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
                          {like}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-primary mb-2">Common Dislikes</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.commonalities.dislikes.map((dislike, index) => (
                        <Badge key={index} variant="destructive" className="bg-primary/20 text-primary border-primary/30">
                          {dislike}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Similar Traits</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.commonalities.traits.map((trait, index) => (
                        <Badge key={index} variant="outline" className="border-muted-foreground/30 text-muted-foreground">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Shared Fears</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.commonalities.fears.map((fear, index) => (
                        <Badge key={index} variant="outline" className="border-muted text-muted-foreground bg-muted/20">
                          {fear}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-8">
          <Button
            onClick={handleDislike}
            disabled={isAnimating}
            className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <X size={28} />
          </Button>
          
          <Button
            onClick={handleLike}
            disabled={isAnimating}
            className="w-16 h-16 rounded-full btn-secondary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <Heart size={28} />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2 mb-2">
            {matches.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentMatch ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {currentMatch + 1} of {matches.length} matches
          </p>
        </div>
      </div>
    </div>
  )
}

export default MatchingPage

