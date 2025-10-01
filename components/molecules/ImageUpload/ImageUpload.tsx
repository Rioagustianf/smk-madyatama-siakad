"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { fileUpload } from "@/lib/supabase-client";
import { useToast } from "@/lib/contexts/toast-context";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  maxSizeMB?: number;
}

export function ImageUpload({
  value,
  onChange,
  label = "Gambar",
  placeholder = "Pilih gambar atau masukkan URL",
  disabled = false,
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate size (default 5 MB)
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      addToast({
        type: "error",
        title: "Ukuran gambar terlalu besar",
        description: `Maksimal ${maxSizeMB}MB. File saat ini ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB`,
      });
      // reset input value to allow re-selecting same file
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setIsUploading(true);

      // Upload to Supabase
      const uploadResult = await fileUpload.uploadImage(
        file,
        "madyatama", // bucket name
        "majors" // path
      );

      // Update form with new URL
      onChange(uploadResult.url);
      setPreview(uploadResult.url);

      addToast({
        type: "success",
        title: "Gambar berhasil diupload",
        description: "Gambar telah disimpan ke Supabase Storage.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      addToast({
        type: "error",
        title: "Gagal mengupload gambar",
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengupload.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    onChange(url);
    setPreview(url);
  };

  const handleRemoveImage = () => {
    onChange("");
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image">{label}</Label>

      {/* Preview */}
      {preview && (
        <div className="relative w-full h-48 border rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleUploadClick}
          disabled={disabled || isUploading}
          className="flex-1"
        >
          {isUploading ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-spin" />
              Mengupload...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Gambar
            </>
          )}
        </Button>

        {!preview && (
          <Button
            type="button"
            variant="outline"
            onClick={handleUploadClick}
            disabled={disabled || isUploading}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* URL Input */}
      <div className="space-y-1">
        <Label htmlFor="image-url" className="text-sm text-muted-foreground">
          Atau masukkan URL gambar
        </Label>
        <Input
          id="image-url"
          type="url"
          value={value}
          onChange={handleUrlChange}
          placeholder={placeholder}
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          • Maksimal ukuran file {maxSizeMB}MB • Format umum: JPG, PNG, WEBP
        </p>
      </div>
    </div>
  );
}
