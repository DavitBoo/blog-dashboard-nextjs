"use client";

import React, { useEffect, useState, useRef } from "react";
import { Image } from "@/interfaces/Image";
import { listImages } from "@/utils/api";
import { FaSpinner, FaImage, FaTimes } from "react-icons/fa";
import { ImageUpload } from "../dashboard/media/ImageUpload";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
}

export function MediaPickerModal({ isOpen, onClose, onSelectImage }: MediaPickerModalProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      const data = await listImages();
      setImages(data.images);
    } catch (error) {
      console.error("Error loading images", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadImages();
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleUploadSuccess = () => {
    loadImages();
  };

  if (!isOpen) return null;

  return (
    <dialog ref={dialogRef} className="media-picker-dialog">
      <div className="media-picker-header">
        <h2>Mediateca</h2>
        <button onClick={onClose} className="media-picker-close" title="Cerrar"><FaTimes /></button>
      </div>

      <div className="media-picker-body">
        <div style={{ marginBottom: "20px" }}>
          <ImageUpload onSuccess={handleUploadSuccess} />
        </div>

        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <FaSpinner className="animate-spin" style={{ fontSize: "2rem" }} />
          </div>
        ) : images.length === 0 ? (
          <div className="media-picker-empty">
            <FaImage style={{ fontSize: "3rem", marginBottom: "10px" }} />
            <p>No hay imágenes disponibles.</p>
          </div>
        ) : (
          <div className="media-picker-grid">
             {images.map(img => (
                <div 
                  key={img.name} 
                  className="media-picker-item"
                  onClick={() => onSelectImage(img.url)}
                  title="Click para insertar"
                >
                  <img src={img.url} alt={img.name} />
                </div>
             ))}
          </div>
        )}
      </div>
    </dialog>
  );
}

export default MediaPickerModal;
