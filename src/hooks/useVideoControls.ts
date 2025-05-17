
import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { videoService } from '@/services/videoService';

export const useVideoControls = (videoId: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
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
        videoService.likeVideo(videoId);
      }
    }
  };
  
  const showLikeAnimation = () => {
    toast({
      title: "Liked!",
      description: "You liked this video",
    });
  };
  
  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedState = !liked;
    setLiked(newLikedState);
    if (newLikedState) {
      videoService.likeVideo(videoId);
    }
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

  return {
    isPlaying,
    liked,
    saved,
    videoRef,
    handleDoubleTap,
    toggleLike,
    toggleSave,
    shareVideo
  };
};
