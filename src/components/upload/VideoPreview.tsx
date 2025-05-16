
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VideoPreviewProps {
  videoUrl: string;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
}

const filters = [
  { name: "Normal", class: "normal", value: "normal" },
  { name: "Grayscale", class: "grayscale", value: "grayscale" },
  { name: "Sepia", class: "sepia", value: "sepia" },
  { name: "Blur", class: "blur-sm", value: "blur" },
  { name: "Brightness", class: "brightness-125", value: "brightness" },
];

const VideoPreview = ({ videoUrl, selectedFilter, onFilterChange }: VideoPreviewProps) => {
  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="relative w-full max-w-md aspect-[9/16] bg-app-muted rounded-lg overflow-hidden">
        <video 
          src={videoUrl} 
          className={`w-full h-full object-cover ${selectedFilter}`}
          controls 
          autoPlay={false}
        />
      </div>
      
      <Select onValueChange={onFilterChange} value={selectedFilter}>
        <SelectTrigger className="w-full max-w-md bg-app-muted">
          <SelectValue placeholder="Select a filter" />
        </SelectTrigger>
        <SelectContent>
          {filters.map((filter) => (
            <SelectItem key={filter.name} value={filter.value}>
              {filter.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VideoPreview;
