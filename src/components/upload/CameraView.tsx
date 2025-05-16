
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Video } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface CameraViewProps {
  onVideoRecorded: (file: File, previewUrl: string) => void;
  selectedFilter: string;
}

const CameraView = ({ onVideoRecorded, selectedFilter }: CameraViewProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
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
      
      const file = new File([blob], `recording-${Date.now()}.mp4`, { 
        type: 'video/mp4' 
      });
      
      onVideoRecorded(file, videoURL);
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
    activateCamera();
  }, []);

  return (
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
  );
};

export default CameraView;
