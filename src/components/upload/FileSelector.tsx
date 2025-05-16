
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Upload } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface FileSelectorProps {
  onFileSelected: (file: File, preview: string) => void;
  onCameraActivate: () => void;
}

const FileSelector = ({ onFileSelected, onCameraActivate }: FileSelectorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        onFileSelected(file, url);
      } else {
        toast({
          title: "Invalid file",
          description: "Please select a video file",
          variant: "destructive",
        });
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className="w-full max-w-md aspect-[9/16] bg-app-muted rounded-lg flex flex-col items-center justify-center cursor-pointer gap-4"
    >
      <Button 
        variant="outline" 
        className="border-dashed border-app-accent text-app-accent"
        onClick={onCameraActivate}
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
      
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default FileSelector;
