
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Send } from 'lucide-react';

// Mock messages data
const mockUsers = {
  'user1': {
    id: 'user1',
    username: 'user1',
    displayName: 'Regular User',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastSeen: 'online'
  },
  'dancer123': {
    id: 'dancer123',
    username: 'dancer123',
    displayName: 'Dancing Star',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastSeen: '2m ago'
  },
  'runner_girl': {
    id: 'runner_girl',
    username: 'runner_girl',
    displayName: 'Running Girl',
    avatar: 'https://i.pravatar.cc/150?img=9',
    lastSeen: '1h ago'
  }
};

const mockMessages = {
  'user1': [
    { id: 'm1', senderId: 'user1', text: 'Hey, loved your recent video!', timestamp: '10:30 AM' },
    { id: 'm2', senderId: 'me', text: 'Thanks! Glad you liked it', timestamp: '10:32 AM' },
    { id: 'm3', senderId: 'user1', text: 'How do you edit your videos?', timestamp: '10:33 AM' },
    { id: 'm4', senderId: 'me', text: 'I use a mobile app called CapCut', timestamp: '10:35 AM' },
  ],
  'dancer123': [
    { id: 'm5', senderId: 'me', text: 'Hi! Your dance was amazing', timestamp: '09:14 AM' },
    { id: 'm6', senderId: 'dancer123', text: 'Thank you so much!', timestamp: '09:20 AM' },
  ],
  'runner_girl': [
    { id: 'm7', senderId: 'runner_girl', text: 'Where was that running trail?', timestamp: 'Yesterday' },
    { id: 'm8', senderId: 'me', text: 'It\'s Central Park in NYC', timestamp: 'Yesterday' },
  ]
};

// List of all chats for inbox
const mockChats = [
  {
    userId: 'user1',
    lastMessage: 'How do you edit your videos?',
    unread: 0,
    timestamp: '10:33 AM'
  },
  {
    userId: 'dancer123',
    lastMessage: 'Thank you so much!',
    unread: 2,
    timestamp: '09:20 AM'
  },
  {
    userId: 'runner_girl',
    lastMessage: 'It\'s Central Park in NYC',
    unread: 0,
    timestamp: 'Yesterday'
  }
];

// Chat Inbox Component
export const InboxPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-app-background text-app-foreground pb-16">
      <header className="sticky top-0 z-10 bg-app-background border-b border-app-muted p-4">
        <h1 className="text-lg font-semibold">Messages</h1>
      </header>
      
      <div className="divide-y divide-app-muted">
        {mockChats.map((chat) => {
          const user = mockUsers[chat.userId as keyof typeof mockUsers];
          return (
            <div 
              key={chat.userId}
              className="flex items-center p-4 cursor-pointer"
              onClick={() => navigate(`/messages/${chat.userId}`)}
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <img src={user.avatar} alt={user.username} className="object-cover" />
                </Avatar>
                {user.lastSeen === 'online' && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-app-background"></span>
                )}
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold">@{user.username}</span>
                  <span className="text-xs text-gray-400">{chat.timestamp}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-sm text-gray-400 truncate max-w-[200px]">
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="bg-app-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Chat Messages Component
const MessagingPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(
    userId && mockMessages[userId as keyof typeof mockMessages] || []
  );
  const navigate = useNavigate();
  const user = userId ? mockUsers[userId as keyof typeof mockUsers] : null;
  
  const handleSendMessage = () => {
    if (!messageText.trim() || !userId) return;
    
    const newMessage = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text: messageText,
      timestamp: 'Just now'
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
  };
  
  if (!user) {
    navigate('/inbox');
    return null;
  }
  
  return (
    <div className="h-screen bg-app-background text-app-foreground flex flex-col">
      <header className="sticky top-0 z-10 bg-app-background border-b border-app-muted flex items-center p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/inbox')}
          className="mr-2"
        >
          <ChevronLeft size={24} />
        </Button>
        
        <Avatar className="w-8 h-8 mr-2">
          <img src={user.avatar} alt={user.username} className="object-cover" />
        </Avatar>
        
        <div className="flex-1">
          <div className="font-semibold">@{user.username}</div>
          <div className="text-xs text-gray-400">{user.lastSeen}</div>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            {message.senderId !== 'me' && (
              <Avatar className="w-8 h-8 mr-2 self-end">
                <img src={user.avatar} alt={user.username} className="object-cover" />
              </Avatar>
            )}
            
            <div 
              className={`
                max-w-[70%] px-4 py-2 rounded-2xl
                ${message.senderId === 'me' 
                  ? 'bg-app-accent text-white rounded-br-none' 
                  : 'bg-app-muted text-app-foreground rounded-bl-none'}
              `}
            >
              <p>{message.text}</p>
              <p className="text-xs opacity-70 text-right mt-1">
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-app-muted p-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-app-muted rounded-full px-4 py-2 flex items-center">
            <input
              type="text"
              placeholder="Message..."
              className="flex-1 bg-transparent outline-none text-app-foreground"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter' && messageText.trim()) {
                  handleSendMessage();
                }
              }}
            />
            <Button 
              variant="ghost" 
              size="icon"
              className={`${!messageText.trim() ? 'text-gray-400' : 'text-app-accent'}`}
              disabled={!messageText.trim()}
              onClick={handleSendMessage}
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
