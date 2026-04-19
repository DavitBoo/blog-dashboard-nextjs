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

  // Prevenir que el clic en el backdrop cierre incorrectamente si no se maneja bien,
  // pero mantendremos un botón explicito de cierre.
  
  if (!isOpen) return null;

  return (
    <dialog ref={dialogRef} className="media-picker-modal" style={{ width: "90%", maxWidth: "800px", padding: 0, borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)" }}>
      <div style={{ padding: "16px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Mediateca</h2>
        <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text-color)" }}><FaTimes /></button>
      </div>

      <div style={{ padding: "16px", maxHeight: "60vh", overflowY: "auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <ImageUpload onSuccess={handleUploadSuccess} />
        </div>

        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <FaSpinner className="animate-spin" style={{ fontSize: "2rem" }} />
          </div>
        ) : images.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-color)", opacity: 0.7 }}>
            <FaImage style={{ fontSize: "3rem", marginBottom: "10px" }} />
            <p>No hay imágenes disponibles.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
             {images.map(img => (
                <div 
                  key={img.name} 
                  style={{ border: "1px solid var(--border-color)", borderRadius: "4px", overflow: "hidden", cursor: "pointer", position: "relative" }}
                  onClick={() => onSelectImage(img.url)}
                  title="Click para insertar"
                >
                  <img src={img.url} alt={img.name} style={{ width: "100%", height: "150px", objectFit: "cover", display: "block" }} />
                </div>
             ))}
          </div>
        )}
      </div>
    </dialog>
  );
}

export default MediaPickerModal;
