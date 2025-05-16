
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Heart, MessageCircle } from 'lucide-react';

interface VideoCardProps {
  video: {
    id: string;
    url: string;
    user: {
      username: string;
      avatar: string;
    };
    description: string;
    likes: number;
    comments: number;
  };
}

const VideoCard = ({ video }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        className="video-player"
        src={video.url}
        loop
        playsInline
        onClick={togglePlay}
        poster="https://via.placeholder.com/1080x1920/000000/ffffff?text=Loading..."
      />
      
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <div className="flex items-end justify-between">
          <div className="flex-1 pr-16">
            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="w-10 h-10 border-2 border-app-accent">
                <img src={video.user.avatar} alt={video.user.username} />
              </Avatar>
              <span className="font-semibold text-white">@{video.user.username}</span>
            </div>
            <p className="text-white text-sm">{video.description}</p>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleLike} 
              className="rounded-full bg-app-muted bg-opacity-50"
            >
              <Heart 
                className={liked ? "fill-app-accent text-app-accent" : "text-white"} 
                size={28} 
              />
              <span className="text-white text-xs mt-1">{liked ? video.likes + 1 : video.likes}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-app-muted bg-opacity-50"
            >
              <MessageCircle className="text-white" size={28} />
              <span className="text-white text-xs mt-1">{video.comments}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
