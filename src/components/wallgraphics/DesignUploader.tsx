import { useState, useCallback } from 'react';
import { Upload, FileImage, Check, AlertTriangle, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UploadedDesign {
  file: File;
  preview: string;
  width: number;
  height: number;
}

interface DesignUploaderProps {
  onUpload: (design: UploadedDesign | null) => void;
  wallWidth: number;
  wallHeight: number;
}

const resolutionGuide = [
  { size: "4' × 4'", pixels: '2400 × 2400 px', minDpi: 50 },
  { size: "4' × 8'", pixels: '2400 × 4800 px', minDpi: 50 },
  { size: "8' × 8'", pixels: '4800 × 4800 px', minDpi: 50 },
  { size: "8' × 10'", pixels: '4800 × 6000 px', minDpi: 50 },
  { size: "10' × 12'", pixels: '6000 × 7200 px', minDpi: 50 },
];

const DesignUploader = ({ onUpload, wallWidth, wallHeight }: DesignUploaderProps) => {
  const [uploadedDesign, setUploadedDesign] = useState<UploadedDesign | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateResolutionStatus = useCallback(() => {
    if (!uploadedDesign || !wallWidth || !wallHeight) return null;

    const widthInches = wallWidth;
    const heightInches = wallHeight;
    const requiredWidthPx = widthInches * 50; // 50 DPI minimum
    const requiredHeightPx = heightInches * 50;
    
    const widthDpi = uploadedDesign.width / widthInches;
    const heightDpi = uploadedDesign.height / heightInches;
    const effectiveDpi = Math.min(widthDpi, heightDpi);

    if (effectiveDpi >= 100) {
      return {
        status: 'excellent',
        dpi: Math.round(effectiveDpi),
        message: 'Excellent resolution for crisp print quality',
        requiredPx: null
      };
    } else if (effectiveDpi >= 50) {
      return {
        status: 'acceptable',
        dpi: Math.round(effectiveDpi),
        message: 'Acceptable resolution for standard viewing distance',
        requiredPx: null
      };
    } else {
      return {
        status: 'low',
        dpi: Math.round(effectiveDpi),
        message: 'Resolution too low - image may appear pixelated',
        requiredPx: { width: Math.round(requiredWidthPx), height: Math.round(requiredHeightPx) }
      };
    }
  }, [uploadedDesign, wallWidth, wallHeight]);

  const resolutionStatus = calculateResolutionStatus();

  const handleFile = useCallback((file: File) => {
    setError(null);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/tiff'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PNG, JPG, or TIFF file');
      return;
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be under 50MB');
      return;
    }

    // Read image dimensions
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const design: UploadedDesign = {
          file,
          preview: e.target?.result as string,
          width: img.width,
          height: img.height,
        };
        setUploadedDesign(design);
        onUpload(design);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setUploadedDesign(null);
    onUpload(null);
  }, [onUpload]);

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Your Own Design
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          PNG, JPG, or TIFF files up to 50MB
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Upload Zone */}
        {!uploadedDesign ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'
            }`}
          >
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.tiff,.tif"
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">Drag & drop your design here</p>
            <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative rounded-xl overflow-hidden border border-border">
              <img
                src={uploadedDesign.preview}
                alt="Uploaded design"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full hover:bg-destructive/90 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* File Info */}
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="font-medium text-sm truncate">{uploadedDesign.file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {uploadedDesign.width} × {uploadedDesign.height} pixels • {(uploadedDesign.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {/* Resolution Status */}
            {resolutionStatus && (
              <div
                className={`rounded-lg p-3 flex items-start gap-3 ${
                  resolutionStatus.status === 'excellent'
                    ? 'bg-green-500/10 border border-green-500/30'
                    : resolutionStatus.status === 'acceptable'
                    ? 'bg-yellow-500/10 border border-yellow-500/30'
                    : 'bg-destructive/10 border border-destructive/30'
                }`}
              >
                {resolutionStatus.status === 'excellent' ? (
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : resolutionStatus.status === 'acceptable' ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium text-sm">
                    {resolutionStatus.status === 'excellent'
                      ? 'Excellent Quality'
                      : resolutionStatus.status === 'acceptable'
                      ? 'Acceptable Quality'
                      : 'Resolution Too Low'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {resolutionStatus.dpi} DPI at your wall size • {resolutionStatus.message}
                  </p>
                  {resolutionStatus.requiredPx && (
                    <p className="text-xs text-destructive mt-1">
                      Minimum recommended: {resolutionStatus.requiredPx.width} × {resolutionStatus.requiredPx.height} px
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Resolution Guide */}
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium text-sm">Minimum Resolution Guide</h4>
          </div>
          <div className="space-y-2">
            {resolutionGuide.map((item) => (
              <div key={item.size} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.size}</span>
                <span className="font-mono text-xs">{item.pixels}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
            💡 Vector files (AI, EPS, PDF) can be scaled to any size without quality loss
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesignUploader;
