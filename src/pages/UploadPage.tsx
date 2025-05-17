
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import CameraView from "@/components/upload/CameraView";
import VideoPreview from "@/components/upload/VideoPreview";
import UploadForm from "@/components/upload/UploadForm";
import FileSelector from "@/components/upload/FileSelector";
import { useAuth } from "@/lib/auth";
import { videoService } from "@/services/videoService";

const UploadPage = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("normal");
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleVideoRecorded = (file: File, previewUrl: string) => {
    setVideoFile(file);
    setVideoPreview(previewUrl);
    setIsCameraActive(false);
  };

  const handleFileSelected = (file: File, previewUrl: string) => {
    setVideoFile(file);
    setVideoPreview(previewUrl);
  };

  const handleUpload = async () => {
    if (!videoFile || !user?.id) {
      toast({
        title: "No video selected",
        description: "Please select a video to upload",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please add a title for your video",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);
      
      const { videoId, error } = await videoService.uploadVideo(
        videoFile,
        title,
        description,
        user.id
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (error) {
        throw new Error(error);
      }
      
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded",
      });
      
      // Navigate to the user's profile after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "An error occurred while uploading your video",
      });
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const activateCamera = () => {
    setIsCameraActive(true);
  };

  const renderContent = () => {
    if (!user) {
      return (
        <div className="text-center p-8">
          <p className="mb-4">You need to be logged in to upload videos</p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-app-accent hover:bg-app-accent/90"
          >
            Sign In
          </Button>
        </div>
      );
    }
    
    if (videoPreview) {
      return (
        <>
          <VideoPreview 
            videoUrl={videoPreview} 
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
          
          <UploadForm
            title={title}
            description={description}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onUpload={handleUpload}
            isUploading={isUploading}
            progress={uploadProgress}
            disabled={!videoFile}
          />
        </>
      );
    } else if (isCameraActive) {
      return (
        <CameraView 
          onVideoRecorded={handleVideoRecorded}
          selectedFilter={selectedFilter}
        />
      );
    } else {
      return (
        <FileSelector 
          onFileSelected={handleFileSelected} 
          onCameraActivate={activateCamera}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-app-background text-app-foreground p-4">
      <header className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="text-app-foreground"
        >
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-xl font-bold">Upload Reel</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex flex-col items-center space-y-6 mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default UploadPage;
