import { useState } from "react";
import { Download, Trash2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageCardProps {
  image: {
    id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    created_at: string;
  };
  onDelete: () => void;
}

export const ImageCard = ({ image, onDelete }: ImageCardProps) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getImageUrl = () => {
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(image.file_path);
    return data.publicUrl;
  };

  const handleDownload = async () => {
    const url = getImageUrl();
    const link = document.createElement('a');
    link.href = url;
    link.download = image.file_name;
    link.click();
  };

  const handleView = () => {
    setImageUrl(getImageUrl());
    setIsViewerOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <>
      <div className="group relative bg-card rounded-lg overflow-hidden border border-border shadow-soft hover:shadow-hover transition-all duration-300">
        <div className="aspect-square bg-muted overflow-hidden">
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <img
            src={getImageUrl()}
            alt={image.file_name}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
              isLoading ? 'hidden' : 'block'
            }`}
            onLoad={() => setIsLoading(false)}
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-foreground truncate mb-1">
            {image.file_name}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span>{formatFileSize(image.file_size)}</span>
            <span>{formatDate(image.created_at)}</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleView}
              size="sm"
              variant="secondary"
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              onClick={handleDownload}
              size="sm"
              variant="secondary"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              onClick={onDelete}
              size="sm"
              variant="destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{image.file_name}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full max-h-[70vh] overflow-auto">
            <img
              src={imageUrl}
              alt={image.file_name}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
