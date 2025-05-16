
import VideoFeed from '@/components/VideoFeed';
import AppNavbar from '@/components/AppNavbar';

const Index = () => {
  return (
    <div className="h-screen bg-app-background text-app-foreground">
      <VideoFeed />
      <AppNavbar />
    </div>
  );
};

export default Index;
