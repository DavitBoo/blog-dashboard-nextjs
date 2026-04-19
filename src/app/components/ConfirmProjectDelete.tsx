'use client'

import React, { useState } from 'react'
import InfoText from './InfoText'
import { deleteProject } from '@/utils/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
}

const ConfirmProjectDelete: React.FC<Props> = ({ isOpen, onClose, projectId }) => {
    const [infoTextMessage, setInfoTextMessage] = useState<string | null>(null);
    const [showInfoText, setShowInfoText] = useState<boolean>(false);

    const handleDelete = async () => { 
      await deleteProject(projectId)
        .then(() => {
          successfulSubmit();
          setTimeout(() => {
            onClose();
          }, 2000);
        })
        .catch((error) => {
          console.error('Error deleting project: ', error);
        });
    }

    const successfulSubmit = () => {
        setInfoTextMessage('¡Se ha borrado el proyecto!');
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

export default ConfirmProjectDelete;
