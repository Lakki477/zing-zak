
export interface UserProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  followers: number;
  following: number;
  coins: number;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  likes: number;
  views: number;
  comments: number;
  created_at: string;
  user?: UserProfile;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: 'deposit' | 'withdrawal' | 'reward';
  status: 'pending' | 'completed' | 'failed';
  payment_method: 'bank' | 'paytm' | null;
  payment_details: any;
  created_at: string;
  updated_at: string;
}
