
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Video {
  id: string;
  thumbnail: string;
  views: number;
}

interface ProfileTabsProps {
  videos: Video[];
  isCurrentUser: boolean;
}

const ProfileTabs = ({ videos, isCurrentUser }: ProfileTabsProps) => {
  const navigate = useNavigate();

  return (
    <Tabs defaultValue="videos" className="w-full mt-4">
      <TabsList className="w-full bg-app-background border-b border-app-muted rounded-none">
        <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
        <TabsTrigger value="likes" className="flex-1">Likes</TabsTrigger>
        <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
      </TabsList>
      
      <TabsContent value="videos" className="p-1">
        {videos.length > 0 ? (
          <div className="grid grid-cols-3 gap-1">
            {videos.map(video => (
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
  );
};

export default ProfileTabs;
