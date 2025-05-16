
export interface Video {
  id: string;
  thumbnail: string;
  views: number;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  followers: number;
  following: number;
  bio: string;
  videos: Video[];
}
