
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface UploadFormProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  onUpload: () => void;
  isUploading: boolean;
  disabled: boolean;
}

const UploadForm = ({ 
  description, 
  onDescriptionChange, 
  onUpload, 
  isUploading, 
  disabled 
}: UploadFormProps) => {
  return (
    <div className="w-full max-w-md space-y-4">
      <Textarea
        placeholder="Write a description..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="w-full bg-app-muted border-app-muted text-app-foreground"
      />
      
      <Button 
        className="w-full bg-gradient-to-r from-app-accent to-app-secondary hover:opacity-90"
        disabled={disabled || isUploading}
        onClick={onUpload}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  );
};

export default UploadForm;
