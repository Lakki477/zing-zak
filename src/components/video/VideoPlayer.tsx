
import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  handleDoubleTap: () => void;
}

const VideoPlayer = ({ videoUrl, thumbnailUrl, videoRef, handleDoubleTap }: VideoPlayerProps) => {
  return (
    <video
      ref={videoRef}
      className="video-player"
      src={videoUrl}
      loop
      playsInline
      onClick={handleDoubleTap}
      poster={thumbnailUrl || "https://via.placeholder.com/1080x1920/000000/ffffff?text=Loading..."}
    />
  );
};

export default VideoPlayer;
