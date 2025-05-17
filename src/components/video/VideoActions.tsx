
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

interface VideoActionsProps {
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  toggleLike: (e: React.MouseEvent) => void;
  toggleSave: (e: React.MouseEvent) => void;
  shareVideo: (e: React.MouseEvent) => void;
  goToComments: (e: React.MouseEvent) => void;
}

const VideoActions = ({ 
  likes, 
  comments, 
  liked, 
  saved, 
  toggleLike, 
  toggleSave, 
  shareVideo, 
  goToComments 
}: VideoActionsProps) => {
  return (
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
        <span className="text-white text-xs mt-1">{liked ? likes + 1 : likes}</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full bg-app-muted bg-opacity-50"
        onClick={goToComments}
      >
        <MessageCircle className="text-white" size={28} />
        <span className="text-white text-xs mt-1">{comments}</span>
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
  );
};

export default VideoActions;
