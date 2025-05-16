
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import AppNavbar from '@/components/AppNavbar';

const mockMessages = [
  {
    id: "m1",
    user: {
      username: "sarah.j",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    lastMessage: "Hey, I loved your latest video!",
    time: "2m",
    unread: true
  },
  {
    id: "m2",
    user: {
      username: "mike_creative",
      avatar: "https://i.pravatar.cc/150?img=12"
    },
    lastMessage: "Want to collab on a new project?",
    time: "45m",
    unread: false
  },
  {
    id: "m3",
    user: {
      username: "dance.master",
      avatar: "https://i.pravatar.cc/150?img=20"
    },
    lastMessage: "Thanks for the follow!",
    time: "2h",
    unread: false
  },
  {
    id: "m4",
    user: {
      username: "travel_addict",
      avatar: "https://i.pravatar.cc/150?img=32"
    },
    lastMessage: "Where was that beach video taken?",
    time: "1d",
    unread: false
  }
];

const mockNotifications = [
  {
    id: "n1",
    user: {
      username: "beauty_tips",
      avatar: "https://i.pravatar.cc/150?img=23"
    },
    action: "liked your video",
    time: "5m",
    read: false
  },
  {
    id: "n2",
    user: {
      username: "fitness_pro",
      avatar: "https://i.pravatar.cc/150?img=15"
    },
    action: "started following you",
    time: "30m",
    read: false
  },
  {
    id: "n3",
    user: {
      username: "food_lover",
      avatar: "https://i.pravatar.cc/150?img=18"
    },
    action: "commented on your video",
    time: "3h",
    read: true
  },
  {
    id: "n4",
    user: {
      username: "tech_geek",
      avatar: "https://i.pravatar.cc/150?img=35"
    },
    action: "mentioned you in a comment",
    time: "1d",
    read: true
  }
];

const InboxPage = () => {
  return (
    <div className="min-h-screen bg-app-background text-app-foreground pb-16">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Inbox</h1>
        
        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-app-muted">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="mt-4">
            <div className="space-y-2">
              {mockMessages.map(message => (
                <div 
                  key={message.id}
                  className={`flex items-center p-3 rounded-lg ${message.unread ? 'bg-app-muted' : ''}`}
                >
                  <Avatar className="h-12 w-12">
                    <img src={message.user.avatar} alt={message.user.username} />
                  </Avatar>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">@{message.user.username}</span>
                      <span className="text-xs text-gray-400">{message.time}</span>
                    </div>
                    <p className={`text-sm ${message.unread ? 'text-app-foreground' : 'text-gray-400'}`}>
                      {message.lastMessage}
                    </p>
                  </div>
                  
                  {message.unread && (
                    <div className="h-2 w-2 bg-app-accent rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-4">
            <div className="space-y-2">
              {mockNotifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`flex items-center p-3 rounded-lg ${!notification.read ? 'bg-app-muted' : ''}`}
                >
                  <Avatar className="h-12 w-12">
                    <img src={notification.user.avatar} alt={notification.user.username} />
                  </Avatar>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold">@{notification.user.username}</span>
                        <span className="text-sm ml-1 text-gray-400">{notification.action}</span>
                      </div>
                      <span className="text-xs text-gray-400">{notification.time}</span>
                    </div>
                  </div>
                  
                  {!notification.read && (
                    <div className="h-2 w-2 bg-app-accent rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <AppNavbar />
    </div>
  );
};

export default InboxPage;
