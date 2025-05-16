
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Send } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Mock comments data
const mockComments = {
  '1': [
    {
      id: 'c1',
      username: 'commenter1',
      avatar: 'https://i.pravatar.cc/150?img=11',
      text: 'Amazing video! Love the vibes.',
      timestamp: '2h ago',
      likes: 23
    },
    {
      id: 'c2',
      username: 'commenter2',
      avatar: 'https://i.pravatar.cc/150?img=12',
      text: 'You always have the best content!',
      timestamp: '3h ago',
      likes: 15
    }
  ],
  '2': [
    {
      id: 'c3',
      username: 'commenter3',
      avatar: 'https://i.pravatar.cc/150?img=13',
      text: 'Your dance moves are incredible!',
      timestamp: '5h ago',
      likes: 42
    }
  ],
  '3': [
    {
      id: 'c4',
      username: 'commenter4',
      avatar: 'https://i.pravatar.cc/150?img=14',
      text: 'That view is breathtaking! Where is this?',
      timestamp: '1d ago',
      likes: 67
    },
    {
      id: 'c5',
      username: 'commenter5',
      avatar: 'https://i.pravatar.cc/150?img=15',
      text: 'I need to visit this place!',
      timestamp: '1d ago',
      likes: 28
    },
    {
      id: 'c6',
      username: 'commenter6',
      avatar: 'https://i.pravatar.cc/150?img=16',
      text: 'How long did that run take you?',
      timestamp: '2d ago',
      likes: 9
    }
  ]
};

const CommentsPage = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [comments, setComments] = useState(videoId && mockComments[videoId as keyof typeof mockComments] || []);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: `c${Date.now()}`,
      username: 'me',
      avatar: 'https://i.pravatar.cc/150?img=8',
      text: newComment,
      timestamp: 'Just now',
      likes: 0
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
    
    toast({
      title: "Comment added",
      description: "Your comment has been posted",
    });
  };
  
  return (
    <div className="min-h-screen bg-app-background text-app-foreground">
      <header className="sticky top-0 z-10 bg-app-background border-b border-app-muted flex items-center p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-lg font-semibold">Comments</h1>
      </header>
      
      <div className="p-4 pb-24">
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <img src={comment.avatar} alt={comment.username} className="object-cover" />
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">@{comment.username}</span>
                    <span className="text-xs text-gray-400">{comment.timestamp}</span>
                  </div>
                  <p className="mt-1">{comment.text}</p>
                  <div className="mt-1 text-xs text-gray-400">
                    {comment.likes} likes · Reply
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No comments yet</p>
            <p className="text-sm mt-1">Be the first to comment!</p>
          </div>
        )}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-app-background border-t border-app-muted p-2">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <img src="https://i.pravatar.cc/150?img=8" alt="You" />
          </Avatar>
          <div className="flex-1 bg-app-muted rounded-full px-4 py-2 flex items-center">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent outline-none text-app-foreground"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter' && newComment.trim()) {
                  handleAddComment();
                }
              }}
            />
            <Button 
              variant="ghost" 
              size="icon"
              className={`${!newComment.trim() ? 'text-gray-400' : 'text-app-accent'}`}
              disabled={!newComment.trim()}
              onClick={handleAddComment}
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsPage;
