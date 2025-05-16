
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockUserProfile = {
  username: "creator123",
  displayName: "Creative Creator",
  avatar: "https://i.pravatar.cc/300?img=8",
  followers: 1520,
  following: 245,
  bio: "Digital creator | Making everyday videos | Follow for more content!",
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
    },
    {
      id: "v3",
      thumbnail: "https://via.placeholder.com/200x350/111111/ffffff?text=Video+3",
      views: 32100
    },
    {
      id: "v4",
      thumbnail: "https://via.placeholder.com/200x350/111111/ffffff?text=Video+4",
      views: 9800
    },
    {
      id: "v5",
      thumbnail: "https://via.placeholder.com/200x350/111111/ffffff?text=Video+5",
      views: 14300
    },
    {
      id: "v6",
      thumbnail: "https://via.placeholder.com/200x350/111111/ffffff?text=Video+6",
      views: 27600
    }
  ]
};

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-app-background text-app-foreground pb-16">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">@{mockUserProfile.username}</h1>
        </div>

        <div className="flex items-center mb-6">
          <Avatar className="w-20 h-20 border-2 border-app-accent">
            <img src={mockUserProfile.avatar} alt={mockUserProfile.displayName} className="object-cover" />
          </Avatar>
          
          <div className="ml-4 flex-1">
            <h2 className="text-lg font-bold">{mockUserProfile.displayName}</h2>
            
            <div className="flex space-x-4 mt-2 text-sm">
              <div>
                <span className="font-semibold">{mockUserProfile.videos.length}</span>
                <span className="text-gray-400 ml-1">Videos</span>
              </div>
              <div>
                <span className="font-semibold">{mockUserProfile.followers.toLocaleString()}</span>
                <span className="text-gray-400 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-semibold">{mockUserProfile.following.toLocaleString()}</span>
                <span className="text-gray-400 ml-1">Following</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm mb-4">{mockUserProfile.bio}</p>
        
        <Button className="w-full bg-app-accent hover:bg-app-accent/90">
          Edit Profile
        </Button>
      </div>

      <Tabs defaultValue="videos" className="w-full mt-4">
        <TabsList className="w-full bg-app-background border-b border-app-muted rounded-none">
          <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
          <TabsTrigger value="likes" className="flex-1">Likes</TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos" className="p-1">
          <div className="grid grid-cols-3 gap-1">
            {mockUserProfile.videos.map(video => (
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
