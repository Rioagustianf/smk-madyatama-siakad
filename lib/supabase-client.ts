import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage helper functions
export const storage = {
  // Upload file to Supabase Storage
  uploadFile: async (
    bucket: string,
    path: string,
    file: File,
    options?: {
      cacheControl?: string;
      contentType?: string;
      upsert?: boolean;
    }
  ) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: options?.cacheControl || "3600",
        upsert: options?.upsert || false,
        contentType: options?.contentType || file.type,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    return data;
  },

  // Get public URL for file
  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  // Delete file from storage
  deleteFile: async (bucket: string, path: string) => {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  },

  // List files in bucket
  listFiles: async (bucket: string, path?: string) => {
    const { data, error } = await supabase.storage.from(bucket).list(path);
    if (error) {
      throw new Error(`List failed: ${error.message}`);
    }
    return data;
  },
};

// File upload utilities
export const fileUpload = {
  // Validate file type
  validateFileType: (file: File, allowedTypes: string[]) => {
    return allowedTypes.includes(file.type);
  },

  // Validate file size
  validateFileSize: (file: File, maxSize: number) => {
    return file.size <= maxSize;
  },

  // Generate unique filename
  generateFileName: (originalName: string) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split(".").pop();
    return `${timestamp}_${randomString}.${extension}`;
  },

  // Upload image with validation
  uploadImage: async (
    file: File,
    bucket: string = "madyatama",
    path: string = "uploads"
  ) => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!fileUpload.validateFileType(file, allowedTypes)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG, and WebP are allowed."
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (!fileUpload.validateFileSize(file, maxSize)) {
      throw new Error("File size too large. Maximum size is 5MB.");
    }

    // Generate unique filename
    const fileName = fileUpload.generateFileName(file.name);
    const fullPath = `${path}/${fileName}`;

    // Upload file
    const uploadData = await storage.uploadFile(bucket, fullPath, file);

    // Get public URL
    const publicUrl = storage.getPublicUrl(bucket, fullPath);

    return {
      path: fullPath,
      url: publicUrl,
      fileName,
      size: file.size,
      type: file.type,
    };
  },

  // Upload document with validation
  uploadDocument: async (
    file: File,
    bucket: string = "documents",
    path: string = "uploads"
  ) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!fileUpload.validateFileType(file, allowedTypes)) {
      throw new Error(
        "Invalid file type. Only PDF and Word documents are allowed."
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (!fileUpload.validateFileSize(file, maxSize)) {
      throw new Error("File size too large. Maximum size is 10MB.");
    }

    // Generate unique filename
    const fileName = fileUpload.generateFileName(file.name);
    const fullPath = `${path}/${fileName}`;

    // Upload file
    const uploadData = await storage.uploadFile(bucket, fullPath, file);

    // Get public URL
    const publicUrl = storage.getPublicUrl(bucket, fullPath);

    return {
      path: fullPath,
      url: publicUrl,
      fileName,
      size: file.size,
      type: file.type,
    };
  },
};
