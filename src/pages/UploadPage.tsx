
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Upload, Camera } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const UploadPage = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoPreview(url);
      } else {
        toast({
          title: "Invalid file",
          description: "Please select a video file",
          variant: "destructive",
        });
      }
    }
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
        <div className="w-10"></div> {/* Spacer for alignment */}
      </header>

      <div className="flex flex-col items-center space-y-6 mt-6">
        {videoPreview ? (
          <div className="relative w-full max-w-md aspect-[9/16] bg-app-muted rounded-lg overflow-hidden">
            <video 
              src={videoPreview} 
              className="w-full h-full object-cover" 
              controls 
              autoPlay={false}
            />
          </div>
        ) : (
          <div 
            className="w-full max-w-md aspect-[9/16] bg-app-muted rounded-lg flex flex-col items-center justify-center cursor-pointer"
            onClick={triggerFileInput}
          >
            <Camera size={48} className="text-app-foreground mb-4" />
            <p className="text-center text-app-foreground">Tap to select a video</p>
          </div>
        )}
        
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Button 
          variant="outline" 
          className="w-full max-w-md border-dashed border-app-accent text-app-accent"
          onClick={triggerFileInput}
        >
          <Upload className="mr-2" size={16} />
          Select Video
        </Button>
        
        <Textarea
          placeholder="Write a description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full max-w-md bg-app-muted border-app-muted text-app-foreground"
        />
        
        <Button 
          className="w-full max-w-md bg-gradient-to-r from-app-accent to-app-secondary hover:opacity-90"
          disabled={!videoFile || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </div>
  );
};

export default UploadPage;
