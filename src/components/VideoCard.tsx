
import { useNavigate } from 'react-router-dom';
import { Video } from '@/types/supabase';
import { useVideoControls } from '@/hooks/useVideoControls';
import VideoPlayer from './video/VideoPlayer';
import VideoInfo from './video/VideoInfo';
import VideoActions from './video/VideoActions';

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const navigate = useNavigate();
  const { 
    isPlaying, 
    liked, 
    saved, 
    videoRef, 
    handleDoubleTap,
    toggleLike,
    toggleSave,
    shareVideo
  } = useVideoControls(video.id);

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.user_id) {
      navigate(`/profile/${video.user_id}`);
    }
  };

  const goToComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/comments/${video.id}`);
  };

  return (
    <div className="video-container">
      <VideoPlayer 
        videoUrl={video.video_url}
        thumbnailUrl={video.thumbnail_url}
        videoRef={videoRef}
        handleDoubleTap={handleDoubleTap}
      />
      
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <div className="flex items-end justify-between">
          <VideoInfo 
            username={video.user?.username || "user"}
            avatarUrl={video.user?.avatar_url || "https://i.pravatar.cc/300"}
            description={video.description || ""}
            goToProfile={goToProfile}
          />
          
          <VideoActions 
            likes={video.likes}
            comments={video.comments}
            liked={liked}
            saved={saved}
            toggleLike={toggleLike}
            toggleSave={toggleSave}
            shareVideo={shareVideo}
            goToComments={goToComments}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
