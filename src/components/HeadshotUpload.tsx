import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeadshotUploadProps {
  onUpload: (file: File, base64: string, mimeType: 'image/jpeg' | 'image/png') => void;
  onRemove: () => void;
  currentFile: File | null;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png'];

export default function HeadshotUpload({
  onUpload,
  onRemove,
  currentFile,
  disabled = false,
}: HeadshotUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (data:image/jpeg;base64,)
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return 'Please upload a JPG or PNG file';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  const handleFile = async (file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Create preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Convert to base64
      const base64 = await fileToBase64(file);
      const mimeType = file.type as 'image/jpeg' | 'image/png';

      onUpload(file, base64, mimeType);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Error processing file:', err);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <motion.div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={!disabled && !currentFile ? { scale: 1.01 } : {}}
        whileTap={!disabled && !currentFile ? { scale: 0.99 } : {}}
        className={cn(
          'relative rounded-card border-2 border-dashed p-8 transition-all duration-300 cursor-pointer',
          'flex flex-col items-center justify-center gap-4',
          !currentFile && !disabled && 'hover:border-accent-green hover:shadow-lg hover:shadow-accent-green/20',
          currentFile && 'border-accent-purple bg-accent-purple/5',
          !currentFile && isDragging && 'border-accent-green bg-accent-green/5 scale-105',
          !currentFile && !isDragging && 'border-text-muted',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
          aria-label="Upload headshot photo"
        />

        {currentFile && previewUrl ? (
          // Preview State
          <div className="relative w-full flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Headshot preview"
                className="w-32 h-32 object-cover rounded-lg border-2 border-accent-purple shadow-lg"
              />
              {!disabled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className={cn(
                    'absolute -top-2 -right-2 p-1.5 rounded-full',
                    'bg-red-500 hover:bg-red-600 text-white',
                    'transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-background'
                  )}
                  aria-label="Remove headshot"
                  title="Remove headshot"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="text-center">
              <p className="text-text-primary font-medium">{currentFile.name}</p>
              <p className="text-text-muted text-sm">
                {(currentFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          // Upload State
          <>
            <div className="p-4 rounded-full bg-background-input">
              {isDragging ? (
                <Upload className="w-8 h-8 text-accent-green" />
              ) : (
                <Camera className="w-8 h-8 text-text-secondary" />
              )}
            </div>
            <div className="text-center">
              <p className="text-text-primary font-medium mb-1">
                {isDragging ? 'Drop your photo here' : 'Upload your headshot (optional)'}
              </p>
              <p className="text-text-muted text-sm">
                Click to browse or drag and drop
              </p>
              <p className="text-text-muted text-xs mt-2">
                JPG or PNG • Max 5MB
              </p>
            </div>
          </>
        )}
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
        >
          <p className="text-red-400 text-sm text-center">{error}</p>
        </motion.div>
      )}
    </div>
  );
}
