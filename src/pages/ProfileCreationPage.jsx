import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'

const ProfileCreationPage = ({ user }) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    sex: "",
    location: "",
    bio: "",
    personalityTraits: [],
    likes: [],
    dislikes: [],
    fears: [],
    habits: [],
    isPrivate: false,
    allowMatching: true
  })

  const commonalitiesExamples = {
    personalityTraits: ["Introverted", "Creative", "Curious", "Empathetic", "Adventurous", "Analytical"],
    likes: ["Reading", "Hiking", "Cooking", "Gaming", "Movies", "Music"],
    dislikes: ["Spiders", "Crowds", "Public Speaking", "Loud Noises", "Waking Up Early", "Slow Walkers"],
    fears: ["Heights", "Failure", "The Dark", "Clowns", "Snakes", "Being Alone"],
    habits: ["Biting Nails", "Procrastinating", "Exercising Daily", "Drinking Coffee", "Singing in the Shower", "Leaving the cap off the toothpaste"]
  }

  const [inputValues, setInputValues] = useState({
    personalityTraits: '',
    likes: '',
    dislikes: '',
    fears: '',
    habits: ''
  })

  const steps = [
    { id: 1, title: 'Basic Info', subtitle: 'Tell us about yourself' },
    { id: 2, title: 'Personality', subtitle: 'What makes you unique?' },
    { id: 3, title: 'Interests', subtitle: 'What do you love?' },
    { id: 4, title: 'Dislikes', subtitle: 'What do you avoid?' },
    { id: 5, title: 'Fears & Habits', subtitle: 'Your honest self' }
  ]

  const addTag = (category, value) => {
    if (value.trim() && !profileData[category].includes(value.trim())) {
      setProfileData({
        ...profileData,
        [category]: [...profileData[category], value.trim()]
      })
      setInputValues({
        ...inputValues,
        [category]: ''
      })
    }
  }

  const removeTag = (category, tagToRemove) => {
    setProfileData({
      ...profileData,
      [category]: profileData[category].filter(tag => tag !== tagToRemove)
    })
  }

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete profile creation
      try {
        await apiService.createProfile(profileData)
        navigate("/home")
      } catch (error) {
        console.error("Error creating profile:", error)
        // Optionally, display an error message to the user
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="input-ucme"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <Input
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                  className="input-ucme"
                  placeholder="28"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Sex</label>
                <Input
                  type="text"
                  value={profileData.sex}
                  onChange={(e) => setProfileData({...profileData, sex: e.target.value})}
                  className="input-ucme"
                  placeholder="Male/Female/Other"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  className="input-ucme"
                  placeholder="New York, USA"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <Textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                className="input-sames min-h-[100px]"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Personality Traits</label>
              <div className="flex space-x-2 mb-3">
                <Input
                  value={inputValues.personalityTraits}
                  onChange={(e) => setInputValues({...inputValues, personalityTraits: e.target.value})}
                  className="input-sames flex-1"
                  placeholder="Creative, Curious, Introvert..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag('personalityTraits', inputValues.personalityTraits)
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => addTag('personalityTraits', inputValues.personalityTraits)}
                  className="btn-secondary px-4"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {commonalitiesExamples.personalityTraits.map((trait, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                    onClick={() => addTag('personalityTraits', trait)}
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.personalityTraits.map((trait, index) => (
                  <Badge key={index} variant="secondary" className="bg-secondary text-secondary-foreground">
                    {trait}
                    <button
                      onClick={() => removeTag('personalityTraits', trait)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Things You Like</label>
              <div className="flex space-x-2 mb-3">
                <Input
                  value={inputValues.likes}
                  onChange={(e) => setInputValues({...inputValues, likes: e.target.value})}
                  className="input-sames flex-1"
                  placeholder="Books, Coffee, Rain..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag('likes', inputValues.likes)
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => addTag('likes', inputValues.likes)}
                  className="btn-secondary px-4"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {commonalitiesExamples.likes.map((like, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                    onClick={() => addTag('likes', like)}
                  >
                    {like}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.likes.map((like, index) => (
                  <Badge key={index} variant="secondary" className="bg-secondary text-secondary-foreground">
                    {like}
                    <button
                      onClick={() => removeTag('likes', like)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Things You Dislike</label>
              <div className="flex space-x-2 mb-3">
                <Input
                  value={inputValues.dislikes}
                  onChange={(e) => setInputValues({...inputValues, dislikes: e.target.value})}
                  className="input-sames flex-1"
                  placeholder="Loud noises, Crowds, Spicy food..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag('dislikes', inputValues.dislikes)
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => addTag('dislikes', inputValues.dislikes)}
                  className="btn-secondary px-4"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {commonalitiesExamples.dislikes.map((dislike, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => addTag('dislikes', dislike)}
                  >
                    {dislike}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.dislikes.map((dislike, index) => (
                  <Badge key={index} variant="destructive" className="bg-primary text-primary-foreground">
                    {dislike}
                    <button
                      onClick={() => removeTag('dislikes', dislike)}
                      className="ml-2 hover:text-primary-foreground/70"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Fears</label>
              <div className="flex space-x-2 mb-3">
                <Input
                  value={inputValues.fears}
                  onChange={(e) => setInputValues({...inputValues, fears: e.target.value})}
                  className="input-sames flex-1"
                  placeholder="Heights, Failure, Enclosed spaces..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag('fears', inputValues.fears)
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => addTag('fears', inputValues.fears)}
                  className="btn-secondary px-4"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {commonalitiesExamples.fears.map((fear, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => addTag('fears', fear)}
                  >
                    {fear}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {profileData.fears.map((fear, index) => (
                  <Badge key={index} variant="outline" className="border-primary text-primary">
                    {fear}
                    <button
                      onClick={() => removeTag('fears', fear)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Habits (Good or Bad)</label>
              <div className="flex space-x-2 mb-3">
                <Input
                  value={inputValues.habits}
                  onChange={(e) => setInputValues({...inputValues, habits: e.target.value})}
                  className="input-sames flex-1"
                  placeholder="Biting nails, Morning runs, Late sleeper..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag('habits', inputValues.habits)
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => addTag("habits", inputValues.habits)}
                  className="btn-secondary px-4"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {commonalitiesExamples.habits.map((habit, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                    onClick={() => addTag("habits", habit)}
                  >
                    {habit}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {profileData.habits.map((habit, index) => (
                  <Badge key={index} variant="secondary" className="bg-muted text-foreground">
                    {habit}
                    <button
                      onClick={() => removeTag("habits", habit)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Private Profile</label>
                <Switch
                  checked={profileData.isPrivate}
                  onCheckedChange={(checked) => setProfileData({...profileData, isPrivate: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Allow Matching</label>
                <Switch
                  checked={profileData.allowMatching}
                  onCheckedChange={(checked) => setProfileData({...profileData, allowMatching: checked})}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="sames-logo text-2xl mb-2">SAMES</div>
          <p className="text-secondary text-sm font-medium mb-4">BUILD YOUR TRUE SELF</p>
          
          {/* Progress */}
          <div className="flex justify-center space-x-2 mb-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  step.id <= currentStep ? 'bg-primary' : 'bg-muted'
                } ${step.id === currentStep ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
              />
            ))}
          </div>
          
          <div className="text-center">
            <h2 className="text-primary text-lg font-semibold">
              STEP {currentStep}/{steps.length}: {steps[currentStep - 1]?.title.toUpperCase()}
            </h2>
            <p className="text-muted-foreground text-sm">{steps[currentStep - 1]?.subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="card-sames mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex space-x-4">
          {currentStep > 1 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1 h-12 border-border hover:bg-muted"
            >
              BACK
            </Button>
          )}
          <Button
            onClick={handleNext}
            className={`${currentStep === 1 ? 'w-full' : 'flex-1'} h-12 ${
              currentStep === steps.length ? 'btn-secondary' : 'btn-primary'
            }`}
          >
            {currentStep === steps.length ? 'COMPLETE PROFILE' : 'NEXT'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProfileCreationPage

