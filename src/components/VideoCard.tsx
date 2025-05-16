
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface VideoCardProps {
  video: {
    id: string;
    url: string;
    user: {
      id: string;
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
  const [saved, setSaved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const doubleTapRef = useRef<NodeJS.Timeout | null>(null);
  const tapCount = useRef(0);
  const observer = useRef<IntersectionObserver | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
          toast({
            title: "Playback Error",
            description: "Could not play the video. Please try again.",
            variant: "destructive",
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDoubleTap = () => {
    tapCount.current += 1;
    
    if (tapCount.current === 1) {
      doubleTapRef.current = setTimeout(() => {
        // Single tap
        togglePlay();
        tapCount.current = 0;
      }, 300);
    } else if (tapCount.current === 2) {
      // Double tap - like the video
      clearTimeout(doubleTapRef.current!);
      tapCount.current = 0;
      if (!liked) {
        setLiked(true);
        showLikeAnimation();
      }
    }
  };
  
  const showLikeAnimation = () => {
    // Animation logic for heart could be added here
    toast({
      title: "Liked!",
      description: "You liked this video",
    });
  };
  
  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    toast({
      title: saved ? "Removed from saved" : "Saved",
      description: saved ? "Video removed from your saved items" : "Video saved to your collection",
    });
  };

  const shareVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Share",
      description: "Sharing options will be available soon",
    });
  };

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${video.user.id}`);
  };

  const goToComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/comments/${video.id}`);
  };

  useEffect(() => {
    // Setup intersection observer for autoplay when video is in view
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (videoRef.current) {
              videoRef.current.play().catch((error) => {
                console.error("Auto-play error:", error);
              });
              setIsPlaying(true);
            }
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.current.observe(videoRef.current);
    }

    return () => {
      if (observer.current && videoRef.current) {
        observer.current.unobserve(videoRef.current);
      }
    };
  }, []);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (doubleTapRef.current) {
        clearTimeout(doubleTapRef.current);
      }
    };
  }, []);

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        className="video-player"
        src={video.url}
        loop
        playsInline
        onClick={handleDoubleTap}
        poster="https://via.placeholder.com/1080x1920/000000/ffffff?text=Loading..."
      />
      
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <div className="flex items-end justify-between">
          <div className="flex-1 pr-16">
            <div 
              className="flex items-center space-x-2 mb-2 cursor-pointer"
              onClick={goToProfile}
            >
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
              onClick={goToComments}
            >
              <MessageCircle className="text-white" size={28} />
              <span className="text-white text-xs mt-1">{video.comments}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-app-muted bg-opacity-50"
              onClick={toggleSave}
            >
              <Bookmark className={saved ? "fill-white text-white" : "text-white"} size={28} />
              <span className="text-white text-xs mt-1">Save</span>
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-app-muted bg-opacity-50"
              onClick={shareVideo}
            >
              <Share2 className="text-white" size={28} />
              <span className="text-white text-xs mt-1">Share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
