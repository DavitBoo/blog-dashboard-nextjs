'use client'

import React, {useState} from 'react'

import InfoText from '@/app/components/InfoText'


import IPost  from '../../../../interfaces/Post'


const EditPost = () => {
    const [article, setArticle] = useState<IPost>();
    const [showInfoText, setShowInfoText] = useState<boolean>(false);
    const [infoTextMessage, setInfoTextMessage] = useState<string | null>(null);

  return (
    <main className="edit-article-page">
        <div className="edit-article-container">
        {showInfoText ? (
          <InfoText message={infoTextMessage} />
        ) : (
            article  && (
            <form>
                <h1>Editar artículo</h1>
                <label htmlFor="title">Título</label>
                <input type="text" id="title" name="title" value={article.title} />
                <label htmlFor="content">Contenido</label>
                <textarea id="content" name="content" value={article.content} />
                <button type="submit">Guardar cambios</button>
            </form>
            )
         ) }

        </div>
    </main>
  )
}

export default EditPost