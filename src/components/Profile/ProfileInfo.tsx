
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface ProfileInfoProps {
  userProfile: {
    avatar: string;
    displayName: string;
    bio: string;
    videos: Array<any>;
    followers: number;
    following: number;
  };
  isCurrentUser: boolean;
}

const ProfileInfo = ({ userProfile, isCurrentUser }: ProfileInfoProps) => {
  const navigate = useNavigate();

  return (
    <>
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
    </>
  );
};

export default ProfileInfo;
