
import React from 'react';
import { Avatar } from "@/components/ui/avatar";

interface VideoInfoProps {
  username: string;
  avatarUrl: string;
  description: string;
  goToProfile: (e: React.MouseEvent) => void;
}

const VideoInfo = ({ username, avatarUrl, description, goToProfile }: VideoInfoProps) => {
  return (
    <div className="flex-1 pr-16">
      <div 
        className="flex items-center space-x-2 mb-2 cursor-pointer"
        onClick={goToProfile}
      >
        <Avatar className="w-10 h-10 border-2 border-app-accent">
          <img src={avatarUrl} alt={username} />
        </Avatar>
        <span className="font-semibold text-white">@{username}</span>
      </div>
      <p className="text-white text-sm">{description}</p>
    </div>
  );
};

export default VideoInfo;
