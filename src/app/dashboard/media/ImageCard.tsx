import { FaTrash, FaCopy } from "react-icons/fa";
import { Image } from "@/interfaces/Image";
import { useState } from "react";
import styles from "./ImageCard.module.css";

interface ImageCardProps {
  image: Image;
  isSelected: boolean;
  onToggleSelect: (fileName: string) => void;
  onDelete: (fileName: string) => void;
}

export function ImageCard({ image, isSelected, onToggleSelect, onDelete }: ImageCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(image.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
      // Fallback para navegadores antiguos
      const textArea = document.createElement('textarea');
      textArea.value = image.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image.url} alt={image.name} className={styles.image} />
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(image.name)}
          className={styles.checkbox}
        />
      </div>
      <div className={styles.cardFooter}>
        <span className={styles.imageName}>{image.name}</span>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.actionButton} ${
              copied ? styles.copyButtonSuccess : styles.copyButton
            }`}
            onClick={handleCopyUrl}
            title="Copiar URL"
          >
            <FaCopy style={{ width: '14px', height: '14px' }} />
            {copied && <span className={styles.copyText}>¡Copiado!</span>}
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(image.name)}
            title="Eliminar imagen"
          >
            <FaTrash style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}