'use client'

import React, { useState } from 'react'
import InfoText from './InfoText'
import { deletePost } from '@/utils/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
}

const ConfirmArticleDelete: React.FC<Props> = ({ isOpen, onClose, postId }) => {
    const [infoTextMessage, setInfoTextMessage] = useState<string | null>(null);
    const [showInfoText, setShowInfoText] = useState<boolean>(false);

    const handleDelete = async () => { 
      await deletePost(postId)
        .then(() => {
          successfulSubmit();
          // Cerramos el modal después de un borrado exitoso
          setTimeout(() => {
            onClose();
          }, 2000);
        })
        .catch((error) => {
          console.error('Error deleting article: ', error);
        });
    }

    const successfulSubmit = () => {
        setInfoTextMessage('¡Se ha borrado el artículo!');
        setShowInfoText(true);
    }

    if (!isOpen) return null;

    return (
    <div className="confirm-article-delete">
         {showInfoText ? (
        <InfoText message={infoTextMessage} />
      ) : (
        <>
            <h1>¿Estás seguro?</h1> 
            <p>¡Este borrado no podrás deshacerse!</p>
            <div className='confirm-delete-button-container'>
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
  )
}

export default ConfirmArticleDelete
