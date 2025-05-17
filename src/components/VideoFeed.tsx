
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import VideoCard from './VideoCard';
import { videoService } from '@/services/videoService';
import { Spinner } from '@/components/ui/spinner';

const VideoFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: videoService.getVideos,
  });

  const handleScroll = () => {
    if (feedRef.current) {
      const scrollTop = feedRef.current.scrollTop;
      const videoHeight = feedRef.current.clientHeight;
      const index = Math.round(scrollTop / videoHeight);
      
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  };

  useEffect(() => {
    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener('scroll', handleScroll);
      return () => {
        feedElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  if (isLoading) {
    return (
      <div className="feed-container flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-container flex items-center justify-center">
        <p className="text-app-accent">Error loading videos</p>
      </div>
    );
  }

  return (
    <div 
      ref={feedRef}
      className="feed-container no-scrollbar"
    >
      {videos && videos.length > 0 ? (
        videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))
      ) : (
        <div className="feed-container flex items-center justify-center">
          <p>No videos available. Upload one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
