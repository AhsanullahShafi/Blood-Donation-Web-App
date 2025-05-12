
import React, { useState, useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AvatarUploadProps {
  onImageChange: (file: File) => void;
  initialImage?: string;
}

export function AvatarUpload({ onImageChange, initialImage }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(initialImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onImageChange(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const initials = "U"; // Default user initial

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        className="relative cursor-pointer group"
        onClick={triggerFileInput}
      >
        <Avatar className="h-24 w-24 border-2 border-primary">
          {preview ? (
            <AvatarImage src={preview} alt="Profile" />
          ) : (
            <AvatarFallback className="bg-muted text-2xl">{initials}</AvatarFallback>
          )}
        </Avatar>
        <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-6 w-6 text-white" />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <button 
        type="button"
        onClick={triggerFileInput}
        className="flex items-center gap-1 text-sm text-secondary hover:text-secondary-foreground transition-colors"
      >
        <Upload size={14} />
        Upload Profile Picture
      </button>
    </div>
  );
}
