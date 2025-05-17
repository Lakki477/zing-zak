
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/integrations/supabase/client';

interface ProfileTabsProps {
  userId: string;
  isCurrentUser: boolean;
}

const ProfileTabs = ({ userId, isCurrentUser }: ProfileTabsProps) => {
  const navigate = useNavigate();

  const { data: videos, isLoading } = useQuery({
    queryKey: ['userVideos', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error(error);
        return [];
      }
      
      return data;
    },
  });

  return (
    <Tabs defaultValue="videos" className="w-full mt-4">
      <TabsList className="w-full bg-app-background border-b border-app-muted rounded-none">
        <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
        <TabsTrigger value="likes" className="flex-1">Likes</TabsTrigger>
        <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
      </TabsList>
      
      <TabsContent value="videos" className="p-1">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner size="md" />
          </div>
        ) : videos && videos.length > 0 ? (
          <div className="grid grid-cols-3 gap-1">
            {videos.map(video => (
              <div 
                key={video.id} 
                className="aspect-[9/16] relative cursor-pointer"
                onClick={() => navigate(`/video/${video.id}`)}
              >
                <img 
                  src={video.thumbnail_url || "https://via.placeholder.com/200x350/111111/ffffff?text=Video"} 
                  alt={`Video ${video.title}`}
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
