import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Send, MoreVertical, Phone, Video } from 'lucide-react'

const ChatPage = ({ user }) => {
  const { userId } = useParams()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)

  // Mock chat data
  const [chatUser] = useState({
    id: userId || '1',
    name: 'Alex K',
    image: '👨‍💻',
    isOnline: true,
    lastSeen: 'Online now'
  })

  const [initialMessages] = useState([
    {
      id: 1,
      senderId: chatUser.id,
      text: "Hey! I saw we have a lot in common, especially our love for art and technology!",
      timestamp: new Date(Date.now() - 3600000),
      type: 'text'
    },
    {
      id: 2,
      senderId: user.id,
      text: "Yes! I noticed that too. Your profile mentioned you're into creative coding?",
      timestamp: new Date(Date.now() - 3500000),
      type: 'text'
    },
    {
      id: 3,
      senderId: chatUser.id,
      text: "Exactly! I love creating interactive art installations. What kind of art do you create?",
      timestamp: new Date(Date.now() - 3400000),
      type: 'text'
    },
    {
      id: 4,
      senderId: user.id,
      text: "I'm more into digital illustration and UI design. But I've always been fascinated by interactive installations!",
      timestamp: new Date(Date.now() - 3300000),
      type: 'text'
    },
    {
      id: 5,
      senderId: chatUser.id,
      text: "That's awesome! We should definitely meet up sometime. I'd love to show you some of my work and see yours too.",
      timestamp: new Date(Date.now() - 3200000),
      type: 'text'
    },
    {
      id: 6,
      senderId: user.id,
      text: "I'd love that! Are you free this weekend?",
      timestamp: new Date(Date.now() - 3100000),
      type: 'text'
    }
  ])

  useEffect(() => {
    setMessages(initialMessages)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage = {
      id: Date.now(),
      senderId: user.id,
      text: message.trim(),
      timestamp: new Date(),
      type: 'text'
    }

    setMessages([...messages, newMessage])
    setMessage('')

    // Simulate response after a delay
    setTimeout(() => {
      const responses = [
        "That sounds great!",
        "I'm looking forward to it!",
        "Absolutely! Let's make it happen.",
        "Perfect! I'll send you the details.",
        "Can't wait to meet you!"
      ]
      
      const responseMessage = {
        id: Date.now() + 1,
        senderId: chatUser.id,
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text'
      }
      
      setMessages(prev => [...prev, responseMessage])
    }, 1000 + Math.random() * 2000)
  }

  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(timestamp)
  }

  const formatDate = (timestamp) => {
    const today = new Date()
    const messageDate = new Date(timestamp)
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today'
    }
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    
    return messageDate.toLocaleDateString()
  }

  const groupMessagesByDate = (messages) => {
    const groups = {}
    messages.forEach(message => {
      const dateKey = formatDate(message.timestamp)
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })
    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/home">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-lg">
            {chatUser.image}
          </div>
          
          <div>
            <h2 className="font-semibold text-foreground">{chatUser.name}</h2>
            <p className="text-xs text-muted-foreground">
              {chatUser.isOnline ? (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-secondary rounded-full mr-1"></span>
                  {chatUser.lastSeen}
                </span>
              ) : (
                chatUser.lastSeen
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Phone size={20} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Video size={20} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <MoreVertical size={20} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                {date}
              </div>
            </div>
            
            {/* Messages for this date */}
            {dateMessages.map((msg, index) => {
              const isOwn = msg.senderId === user.id
              const showAvatar = !isOwn && (index === 0 || dateMessages[index - 1].senderId !== msg.senderId)
              
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  {!isOwn && (
                    <div className="w-8 h-8 mr-2 flex-shrink-0">
                      {showAvatar && (
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-sm">
                          {chatUser.image}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={`max-w-[70%] ${isOwn ? 'ml-auto' : ''}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <p className={`text-xs text-muted-foreground mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-card border-t border-border p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="input-sames flex-1"
          />
          <Button
            type="submit"
            disabled={!message.trim()}
            className="btn-primary p-3 rounded-full"
          >
            <Send size={20} />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ChatPage

