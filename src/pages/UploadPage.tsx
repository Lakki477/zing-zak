
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import CameraView from "@/components/upload/CameraView";
import VideoPreview from "@/components/upload/VideoPreview";
import UploadForm from "@/components/upload/UploadForm";
import FileSelector from "@/components/upload/FileSelector";

const UploadPage = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("normal");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVideoRecorded = (file: File, previewUrl: string) => {
    setVideoFile(file);
    setVideoPreview(previewUrl);
    setIsCameraActive(false);
  };

  const handleFileSelected = (file: File, previewUrl: string) => {
    setVideoFile(file);
    setVideoPreview(previewUrl);
  };

  const handleUpload = () => {
    if (!videoFile) {
      toast({
        title: "No video selected",
        description: "Please select a video to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded",
      });
      navigate('/');
    }, 2000);
  };

  const activateCamera = () => {
    setIsCameraActive(true);
  };

  const renderContent = () => {
    if (videoPreview) {
      return (
        <>
          <VideoPreview 
            videoUrl={videoPreview} 
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
          
          <UploadForm
            description={description}
            onDescriptionChange={setDescription}
            onUpload={handleUpload}
            isUploading={isUploading}
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
