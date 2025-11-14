"use client";

import { useState, useCallback, useRef } from "react";
import { uploadImage } from "@/utils/api";
import { Card } from "./Card";
import { FiUpload, FiLoader, FiCheckCircle } from "react-icons/fi";
import { Progress } from "./Progress";

interface ImageUploadProps {
  onSuccess: () => void;
}

export function ImageUpload({ onSuccess }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection (both from drop and input)
  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      const validImageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];

      // Validate file type
      if (!validImageTypes.includes(file.type)) {
        console.error("Invalid file type");
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        await uploadImage(file);

        clearInterval(progressInterval);
        setUploadProgress(100);

        setTimeout(() => {
          onSuccess();
          setUploadProgress(0);
          setIsUploading(false);
        }, 500);
      } catch (error) {
        console.error("Upload failed:", error);
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [onSuccess]
  );

  // Drag event handlers
  const onDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isUploading) {
        setIsDragActive(true);
      }
    },
    [isUploading]
  );

  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isUploading) {
        setIsDragActive(true);
      }
    },
    [isUploading]
  );

  const onDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isUploading) {
        setIsDragActive(false);
      }
    },
    [isUploading]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isUploading) {
        setIsDragActive(false);
        const files = e.dataTransfer.files;
        handleFiles(files);
      }
    },
    [handleFiles, isUploading]
  );

  // File input change handler
  const onFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      handleFiles(files);
    },
    [handleFiles]
  );

  // Click to open file picker
  const openFilePicker = useCallback(() => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  }, [isUploading]);

  return (
    <Card
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={openFilePicker}
      className={`p-8 border-2 border-dashed cursor-pointer transition-all  ${
        isUploading ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
        onChange={onFileInputChange}
        className="hidden"
        disabled={isUploading}
      />
      <div className="d-flex flex-col align-items-center gap-4 text-center">
        {isUploading ? (
          <>
            <FiLoader className="w-12 h-12 animate-spin" />
            <div>
              <Progress value={uploadProgress} />
              <p>Subiendo... {uploadProgress}%</p>
            </div>
          </>
        ) : uploadProgress === 100 ? (
          <>
            <FiCheckCircle className="w-12 h-12 " />
            <p>¡Imagen subida!</p>
          </>
        ) : (
          <>
            <div className="flex align-items-center justify-content-center w-16 h-16">
              <FiUpload className="w-8 h-8" />
            </div>  
            <div>
              <p>{isDragActive ? "Suelta la imagen aquí" : "Suelta aquí tu imagen o haz clic"}</p>
              <p>Sube la imagen que quieras, pero no te pases, que tengo Supabase versión gratuita... you know.</p>
            </div>
            <button>Seleccionar archivo</button>
          </>
        )}
      </div>
    </Card>
  );
}
