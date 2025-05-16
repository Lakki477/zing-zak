
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import ProfileHeader from '@/components/Profile/ProfileHeader';
import ProfileInfo from '@/components/Profile/ProfileInfo';
import ProfileTabs from '@/components/Profile/ProfileTabs';
import { UserProfile } from '@/types/profile';

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
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUsers['me']);
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
        <ProfileHeader 
          username={userProfile.username} 
          isCurrentUser={isCurrentUser}
          handleMenuAction={handleMenuAction}
        />
        
        <ProfileInfo 
          userProfile={userProfile}
          isCurrentUser={isCurrentUser}
        />
      </div>

      <ProfileTabs 
        videos={userProfile.videos}
        isCurrentUser={isCurrentUser}
      />
    </div>
  );
};

export default ProfilePage;
