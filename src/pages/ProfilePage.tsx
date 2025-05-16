
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, MoreVertical, Settings, LogOut, TrendingUp, Wallet, Shield, HelpCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

// Mock user data
const mockUsers = {
  'user1': {
    id: 'user1',
    username: "user1",
    displayName: "Regular User",
    avatar: "https://i.pravatar.cc/300?img=1",
    followers: 1520,
    following: 245,
    bio: "Just a regular user | Posting random content | Follow for more!",
    videos: [
      {
        id: "v1",
        thumbnail: "https://via.placeholder.com/200x350/111111/ffffff?text=Video+1",
        views: 24500
      },
      {
        id: "v2",
        thumbnail: "https://via.placeholder.com/200x350/111111/ffffff?text=Video+2",
        views: 18700
      }
    ]
  },
  'dancer123': {
    id: 'dancer123',
    username: "dancer123",
    displayName: "Dancing Star",
    avatar: "https://i.pravatar.cc/300?img=5",
    followers: 54200,
    following: 125,
    bio: "Professional dancer | Creating dance content | DM for collaborations!",
    videos: [
      {
        id: "v3",
        thumbnail: "https://via.placeholder.com/200x350/111111/ffffff?text=Dance+1",
        views: 98000
      },
      {
        id: "v4",
        thumbnail: "https://via.placeholder.com/200x350/111111/ffffff?text=Dance+2",
        views: 87600
      },
      {
        id: "v5",
        thumbnail: "https://via.placeholder.com/200x350/111111/ffffff?text=Dance+3",
        views: 45300
      }
    ]
  },
  'runner_girl': {
    id: 'runner_girl',
    username: "runner_girl",
    displayName: "Running Girl",
    avatar: "https://i.pravatar.cc/300?img=9",
    followers: 32800,
    following: 430,
    bio: "Fitness enthusiast | Marathon runner | Sharing my running journey!",
    videos: [
      {
        id: "v6",
        thumbnail: "https://via.placeholder.com/200x350/111111/ffffff?text=Running+1",
        views: 34500
      },
      {
        id: "v7",
        thumbnail: "https://via.placeholder.com/200x350/111111/ffffff?text=Running+2",
        views: 29700
      }
    ]
  },
  'me': {
    id: 'me',
    username: "me",
    displayName: "My Profile",
    avatar: "https://i.pravatar.cc/300?img=8",
    followers: 120,
    following: 450,
    bio: "This is my personal profile | Just getting started!",
    videos: []
  }
};

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState(mockUsers['me']);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (userId && mockUsers[userId as keyof typeof mockUsers]) {
      setUserProfile(mockUsers[userId as keyof typeof mockUsers]);
      setIsCurrentUser(userId === 'me');
    } else if (!userId) {
      // If no userId provided, show current user profile
      setUserProfile(mockUsers['me']);
      setIsCurrentUser(true);
    }
  }, [userId]);

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'settings':
        toast({
          title: "Settings",
          description: "Settings page will be available soon",
        });
        break;
      case 'analytics':
        toast({
          title: "Analytics",
          description: "View your content performance",
        });
        break;
      case 'wallet':
        toast({
          title: "Wallet & Withdrawals",
          description: "Manage your earnings and withdrawals",
        });
        break;
      case 'security':
        toast({
          title: "Privacy & Security",
          description: "Manage your account security",
        });
        break;
      case 'help':
        toast({
          title: "Help & Support",
          description: "Contact our support team",
        });
        break;
      case 'logout':
        toast({
          title: "Logout",
          description: "You have been logged out",
        });
        navigate('/');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-app-background text-app-foreground pb-16">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="text-app-foreground"
          >
            <ChevronLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold">@{userProfile.username}</h1>
          
          {isCurrentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-app-foreground">
                  <MoreVertical size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Profile Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleMenuAction('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuAction('analytics')}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <span>Analytics</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuAction('wallet')}>
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Wallet & Withdrawals</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuAction('security')}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Privacy & Security</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuAction('help')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleMenuAction('logout')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {!isCurrentUser && <div className="w-10"></div>}
        </div>

        <div className="flex items-center mb-6">
          <Avatar className="w-20 h-20 border-2 border-app-accent">
            <img src={userProfile.avatar} alt={userProfile.displayName} className="object-cover" />
          </Avatar>
          
          <div className="ml-4 flex-1">
            <h2 className="text-lg font-bold">{userProfile.displayName}</h2>
            
            <div className="flex space-x-4 mt-2 text-sm">
              <div>
                <span className="font-semibold">{userProfile.videos.length}</span>
                <span className="text-gray-400 ml-1">Videos</span>
              </div>
              <div>
                <span className="font-semibold">{userProfile.followers.toLocaleString()}</span>
                <span className="text-gray-400 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-semibold">{userProfile.following.toLocaleString()}</span>
                <span className="text-gray-400 ml-1">Following</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm mb-4">{userProfile.bio}</p>
        
        {isCurrentUser ? (
          <Button className="w-full bg-app-accent hover:bg-app-accent/90">
            Edit Profile
          </Button>
        ) : (
          <Button className="w-full bg-app-accent hover:bg-app-accent/90">
            Follow
          </Button>
        )}
      </div>

      <Tabs defaultValue="videos" className="w-full mt-4">
        <TabsList className="w-full bg-app-background border-b border-app-muted rounded-none">
          <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
          <TabsTrigger value="likes" className="flex-1">Likes</TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos" className="p-1">
          {userProfile.videos.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {userProfile.videos.map(video => (
                <div key={video.id} className="aspect-[9/16] relative">
                  <img 
                    src={video.thumbnail} 
                    alt={`Video ${video.id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1 text-xs text-white">
                    {(video.views / 1000).toFixed(1)}K
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              <p>No videos posted yet</p>
              {isCurrentUser && (
                <Button 
                  onClick={() => navigate('/upload')}
                  className="mt-4 bg-app-accent hover:bg-app-accent/90"
                >
                  Upload your first video
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="likes" className="p-4 text-center text-gray-400">
          <p>Videos you've liked will appear here</p>
        </TabsContent>
        
        <TabsContent value="saved" className="p-4 text-center text-gray-400">
          <p>Saved videos will appear here</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
