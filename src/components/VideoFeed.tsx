
import { useState, useEffect, useRef } from 'react';
import VideoCard from './VideoCard';

// Mock data for demonstration
const mockVideos = [
  {
    id: '1',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-waving-her-hand-53976-large.mp4',
    user: {
      id: 'user1',
      username: 'user1',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    description: 'Having a great day! #sunshine #vibes',
    likes: 1250,
    comments: 42,
  },
  {
    id: '2',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-happily-in-a-field-of-flowers-4702-large.mp4',
    user: {
      id: 'dancer123',
      username: 'dancer123',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    description: 'Dancing in the field! 💃 #dance #nature',
    likes: 3500,
    comments: 125,
  },
  {
    id: '3',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-city-1765-large.mp4',
    user: {
      id: 'runner_girl',
      username: 'runner_girl',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    description: 'Morning run with amazing views #fitness #citylife',
    likes: 945,
    comments: 67,
  },
];

const VideoFeed = () => {
  const [videos, setVideos] = useState(mockVideos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

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

  return (
    <div 
      ref={feedRef}
      className="feed-container no-scrollbar"
    >
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default VideoFeed;
