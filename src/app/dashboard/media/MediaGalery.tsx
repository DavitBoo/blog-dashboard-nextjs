"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { deleteImage, listImages, deleteMultipleImages } from "@/utils/api";
import { Image } from "@/interfaces/Image";
import { Card } from "./Card";
import { ImageCard } from "./ImageCard";
import { FaSpinner, FaImage, FaTrash } from "react-icons/fa";
import styles from "./MediaGallery.module.css";

interface ImageUploadProps {
  onSuccess: () => void;
}

const ImageUpload = dynamic<ImageUploadProps>(
  () => import("./ImageUpload").then((mod) => mod.ImageUpload),
  { ssr: false }
);

export function MediaGallery() {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);


  const loadImages = async () => {
    try {
      setIsLoading(true);
      const data = await listImages();
      setImages(data.images); 
    } catch (error) {
      console.log("Error: No se pudieron cargar las imágenes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleUploadSuccess = () => {
    loadImages();
    console.log("Éxito: Imagen subida correctamente");
  };

  const handleDelete = async (fileName: string) => {
    try {
      await deleteImage(fileName);
      console.log("Éxito: Imagen eliminada correctamente");
      loadImages();
    } catch (error) {
      console.log("Error: No se pudo eliminar la imagen");
    }
  };

  const handleBatchDelete = async () => {
    if (selectedImages.size === 0) return;
    try {
      await deleteMultipleImages(Array.from(selectedImages));
      console.log(`Éxito: ${selectedImages.size} imágenes eliminadas`);
      setSelectedImages(new Set());
      setDeleteDialogOpen(false);
      loadImages();
    } catch (error) {
      console.log("Error: No se pudieron eliminar las imágenes");
    }
  };

  const toggleImageSelection = (fileName: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(fileName)) {
      newSelection.delete(fileName);
    } else {
      newSelection.add(fileName);
    }
    setSelectedImages(newSelection);
  };

  const selectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map((img) => img.name)));
    }
  };

  // Open/close dialog
  useEffect(() => {
    if (deleteDialogOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [deleteDialogOpen]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Galería de Medios</h2>
          <p className={styles.subtitle}>
            {images.length} {images.length === 1 ? "imagen" : "imágenes"} en total
          </p>
        </div>
        <div className={styles.buttonsContainer}>
          {images.length > 0 && (
            <>
              <button className={styles.button} onClick={selectAll}>
                {selectedImages.size === images.length ? "Deseleccionar todo" : "Seleccionar todo"}
              </button>
              {selectedImages.size > 0 && (
                <button 
                  className={styles.deleteButton} 
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <FaTrash style={{ width: '16px', height: '16px' }} />
                  Eliminar ({selectedImages.size})
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <ImageUpload onSuccess={handleUploadSuccess} />

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.spinner} />
        </div>
      ) : images.length === 0 ? (
        <Card className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <div className={styles.emptyStateIcon}>
              <FaImage style={{ width: '32px', height: '32px', color: '#666' }} />
            </div>
            <div className={styles.emptyStateText}>
              <h3 className={styles.emptyStateTitle}>No hay imágenes</h3>
              <p className={styles.emptyStateDescription}>
                Sube tu primera imagen para comenzar
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className={styles.grid}>
          {images.map((image) => (
            <ImageCard
              key={image.name}
              image={image}
              onDelete={handleDelete}
              isSelected={selectedImages.has(image.name)}
              onToggleSelect={toggleImageSelection}
            />
          ))}
        </div>
      )}

      <dialog ref={dialogRef} className={styles.dialog}>
        <div>
          <h3 className={styles.dialogTitle}>Confirmar eliminación</h3>
          <p className={styles.dialogDescription}>
            ¿Estás seguro de que quieres eliminar {selectedImages.size} imágenes? 
            Esta acción no se puede deshacer.
          </p>
          <div className={styles.dialogFooter}>
            <button 
              className={styles.button} 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </button>
            <button 
              className={styles.deleteButton} 
              onClick={handleBatchDelete}
            >
              Eliminar
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}