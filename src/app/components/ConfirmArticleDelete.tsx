'use client'

import React, { useState } from 'react'
import InfoText from './InfoText'

const ConfirmArticleDelete = () => {
    const [infoTextMessage, setInfoTextMessage] = useState<string | null>(null);

    const successfulSubmit = () => {
        setInfoTextMessage('¡Se ha borrado el artículo!');
    }

    return (
    <div className="confirm-article-delete">
        <InfoText message={infoTextMessage} />
    </div>
  )
}

export default ConfirmArticleDelete