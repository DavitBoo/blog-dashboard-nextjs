"use client";

import React, { useState } from "react";
import InfoText from "./InfoText";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  successMessage: string;
}

// Modal de confirmación genérico para las entidades de Vida (categorías, ítems, tags, libros).
const ConfirmVidaDelete: React.FC<Props> = ({ isOpen, onClose, onConfirm, successMessage }) => {
  const [infoTextMessage, setInfoTextMessage] = useState<string | null>(null);
  const [showInfoText, setShowInfoText] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      await onConfirm();
      setInfoTextMessage(successMessage);
      setShowInfoText(true);
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="confirm-article-delete">
      {showInfoText ? (
        <InfoText message={infoTextMessage} />
      ) : (
        <>
          <h1>¿Estás seguro?</h1>
          <p>¡Este borrado no podrá deshacerse!</p>
          <div className="confirm-delete-button-container">
            <button className="go-back" onClick={onClose}>
              Volver
            </button>
            <button className="delete-article" onClick={handleDelete}>
              Borrar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ConfirmVidaDelete;
