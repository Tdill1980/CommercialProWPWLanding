import { useState, useCallback } from "react";
import { Upload, FileImage, X, CheckCircle, Building2, Truck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UploadedFile {
  name: string;
  size: string;
  preview?: string;
}

export const ApproveProUploader = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    vehicleType: "",
    projectName: "",
    instructions: "",
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setUploadedFile({
      name: file.name,
      size: `${sizeInMB} MB`,
      preview: URL.createObjectURL(file),
    });
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-success/10 border border-success/30 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Proof Request Submitted!
        </h3>
        <p className="text-muted-foreground mb-4">
          We'll generate your 3D ApprovePro Plus™ proof within 24-48 hours.
        </p>
        <p className="text-sm text-muted-foreground">
          Reference: <span className="font-mono text-foreground">APP-{Date.now().toString().slice(-6)}</span>
        </p>
        <Button 
          variant="outline" 
          className="mt-6"
          onClick={() => {
            setIsSubmitted(false);
            setUploadedFile(null);
            setFormData({ companyName: "", vehicleType: "", projectName: "", instructions: "" });
          }}
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50 hover:bg-muted/30"
          }
        `}
      >
        {uploadedFile ? (
          <div className="flex items-center justify-between bg-background p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              {uploadedFile.preview ? (
                <img 
                  src={uploadedFile.preview} 
                  alt="Preview" 
                  className="w-12 h-12 object-cover rounded-lg"
                />
              ) : (
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileImage className="w-6 h-6 text-primary" />
                </div>
              )}
              <div className="text-left">
                <p className="font-medium text-foreground text-sm">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">{uploadedFile.size}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,.ai,.eps"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-7 h-7 text-primary" />
            </div>
            <p className="font-medium text-foreground mb-1">
              Drop your 2D design here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse • PNG, JPG, PDF, AI, EPS
            </p>
          </>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Company Name
          </Label>
          <Input
            id="companyName"
            placeholder="Your business name"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleType" className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary" />
            Vehicle Type
          </Label>
          <Select
            value={formData.vehicleType}
            onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="van-sprinter">Van / Sprinter</SelectItem>
              <SelectItem value="box-truck">Box Truck</SelectItem>
              <SelectItem value="pickup">Pickup Truck</SelectItem>
              <SelectItem value="sedan">Sedan / Car</SelectItem>
              <SelectItem value="suv">SUV / Crossover</SelectItem>
              <SelectItem value="trailer">Trailer</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          placeholder="e.g., Q1 Fleet Rebrand"
          value={formData.projectName}
          onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Special Instructions
        </Label>
        <Textarea
          id="instructions"
          placeholder="Any specific notes about the wrap or vehicle..."
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          rows={3}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={!uploadedFile}>
        <Upload className="w-5 h-5 mr-2" />
        Request 3D Proof
      </Button>
    </form>
  );
};

export default ApproveProUploader;
