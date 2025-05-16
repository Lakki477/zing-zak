
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Upload, Camera, Video } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const filters = [
  { name: "Normal", class: "" },
  { name: "Grayscale", class: "grayscale" },
  { name: "Sepia", class: "sepia" },
  { name: "Blur", class: "blur-sm" },
  { name: "Brightness", class: "brightness-125" },
];

const UploadPage = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
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
    if (isCameraActive) {
      stopCamera();
    }
    fileInputRef.current?.click();
  };

  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      toast({
        title: "Camera access error",
        description: "Could not access camera or microphone",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
      const videoURL = URL.createObjectURL(blob);
      setVideoPreview(videoURL);
      
      const file = new File([blob], `recording-${Date.now()}.mp4`, { 
        type: 'video/mp4' 
      });
      setVideoFile(file);
      stopCamera();
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

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
        {videoPreview ? (
          <div className="relative w-full max-w-md aspect-[9/16] bg-app-muted rounded-lg overflow-hidden">
            <video 
              src={videoPreview} 
              className={`w-full h-full object-cover ${selectedFilter}`}
              controls 
              autoPlay={false}
            />
          </div>
        ) : isCameraActive ? (
          <div className="relative w-full max-w-md aspect-[9/16] bg-app-muted rounded-lg overflow-hidden">
            <video 
              ref={videoRef}
              className={`w-full h-full object-cover ${selectedFilter}`}
              autoPlay 
              playsInline
              muted
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              {isRecording ? (
                <Button 
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 rounded-full w-16 h-16"
                >
                  <span className="h-4 w-4 bg-white rounded"></span>
                </Button>
              ) : (
                <Button 
                  onClick={startRecording}
                  className="bg-red-500 hover:bg-red-600 rounded-full w-16 h-16 flex items-center justify-center"
                >
                  <Video size={24} />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div 
            className="w-full max-w-md aspect-[9/16] bg-app-muted rounded-lg flex flex-col items-center justify-center cursor-pointer gap-4"
          >
            <Button 
              variant="outline" 
              className="border-dashed border-app-accent text-app-accent"
              onClick={activateCamera}
            >
              <Camera className="mr-2" size={16} />
              Open Camera
            </Button>
            
            <Button 
              variant="outline" 
              className="border-dashed border-app-accent text-app-accent"
              onClick={triggerFileInput}
            >
              <Upload className="mr-2" size={16} />
              Select Video
            </Button>
          </div>
        )}
        
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {videoPreview && (
          <>
            <Select onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-full max-w-md bg-app-muted">
                <SelectValue placeholder="Select a filter" />
              </SelectTrigger>
              <SelectContent>
                {filters.map((filter) => (
                  <SelectItem key={filter.name} value={filter.class}>
                    {filter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
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
          </>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
