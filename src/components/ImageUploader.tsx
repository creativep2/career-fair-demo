
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  isLoading: boolean;
}

const ImageUploader = ({ onImageUpload, isLoading }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.match('image.*')) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error("File is too large. Please select an image smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        onImageUpload(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragging ? 'border-accent bg-accent/5' : 'border-border'}
          hover:border-accent hover:bg-accent/5
        `}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <div>
            <p className="text-base font-medium text-foreground">
              Drag and drop your image here
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Or click to browse (JPG, PNG, up to 5MB)
            </p>
          </div>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <div className="relative h-4 overflow-hidden mt-4 rounded-full bg-secondary">
        {isLoading && (
          <div className="absolute inset-0 w-1/2 bg-accent animate-[progress-bar_1.5s_ease-in-out_infinite]"></div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
