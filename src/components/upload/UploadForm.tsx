
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface UploadFormProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onUpload: () => void;
  isUploading: boolean;
  progress?: number;
  disabled: boolean;
}

const UploadForm = ({ 
  title,
  description, 
  onTitleChange,
  onDescriptionChange, 
  onUpload, 
  isUploading,
  progress = 0,
  disabled 
}: UploadFormProps) => {
  return (
    <div className="w-full max-w-md space-y-4">
      <Input 
        placeholder="Add a title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full bg-app-muted border-app-muted text-app-foreground"
      />
      
      <Textarea
        placeholder="Write a description..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="w-full bg-app-muted border-app-muted text-app-foreground"
      />
      
      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-center">{progress}% Uploaded</p>
        </div>
      )}
      
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
