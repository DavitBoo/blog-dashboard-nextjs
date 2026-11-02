'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChangeEvent } from 'react';
import { editPost, fetchLabels, fetchPostById } from '../../../../../utils/api';
import { downloadPostAsMarkdown, type ExportablePost } from '../../../../../utils/postToMarkdown';
import dynamic from 'next/dynamic';
const RichTextEditor = dynamic(() => import('../../../../components/RichTextEditor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});
import BackButton from '../../../../components/BackButton';
import DisplayLabelsAdd from '../../new/DisplayLabelsAdd/DisplayLabelsAdd';

import { ILabel } from '../../../../../interfaces/Label';

const EditPost = () => {
  const params = useParams();
  const postId = params?.id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string | null>(null);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [labelList, setLabelList] = useState<ILabel[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedPost, setSavedPost] = useState<ExportablePost | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const labels = await fetchLabels();
        const post = await fetchPostById(parseInt(postId as string));

        setLabelList(labels);
        if (post) {
          setSavedPost(post);
          setTitle(post.title);
          setContent(post.content);
          setMetaTitle(post.metaTitle);
          setMetaDescription(post.metaDescription);
          setSelectedLabels(post.labels.map((label: ILabel) => label.id.toString()));
          setIsPublished(post.published);
          setCurrentCoverUrl(post.coverUrl ?? null);
        }
      } catch (error) {
        console.error('Error fetching post data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (postId) {
      fetchData();
    }
  }, [postId]);

  useEffect(() => {
    if (!cover) {
      setCoverPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(cover);
    setCoverPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [cover]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Title and content are required.');
      return;
    }

    try {
      const postData = {
        title,
        content,
        metaTitle,
        metaDescription,
        labels: selectedLabels,
        isPublished,
        cover,
      };

      if (!postId || typeof postId !== 'string') {
        throw new Error('Invalid post ID');
      }
      setSavedPost(await editPost(postData, postId));
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to update post. Please try again.');
    }
  };

  // Exporta lo que hay en el formulario, incluidos los cambios sin guardar. Una portada nueva aún no
  // tiene URL hasta que se guarda, así que se exporta la última guardada.
  const handleExport = () => {
    if (!savedPost) return;
    downloadPostAsMarkdown({
      ...savedPost,
      title,
      content,
      metaTitle,
      metaDescription,
      published: isPublished,
      labels: labelList.filter((label) => selectedLabels.includes(label.id.toString())),
    });
  };

  const handleIsPublishedCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsPublished(event.target.checked);
  };

  return (
    <div className="creator-container">
      <BackButton />
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Post updated successfully!</p>}
      <form onSubmit={handleSubmit}>
        <header className="add-article-header">
          <h1 className="add-article-heading">Editar artículo</h1>
        </header>
        <div className="labels-container">
          <DisplayLabelsAdd
            labelList={labelList}
            selectedLabels={selectedLabels}
            setSelectedLabels={setSelectedLabels}
          />
        </div>
        <div className="form-field">
          <h2>Imagen destacada</h2>
          {coverPreview ? (
            <img
              src={coverPreview}
              alt="Vista previa de la nueva portada"
              style={{ maxWidth: '200px', display: 'block', marginBottom: '0.5rem' }}
            />
          ) : (
            currentCoverUrl && (
              <img
                src={currentCoverUrl}
                alt="Portada actual"
                style={{ maxWidth: '200px', display: 'block', marginBottom: '0.5rem' }}
              />
            )
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setCover(e.target.files[0]);
              }
            }}
          />
        </div>
        <div className="add-article-title-container">
          <h2>Título</h2>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-field">
          <h2>Contenido</h2>
          {loading ? (
            <p>Cargando contenido...</p>
          ) : (
            <RichTextEditor value={content} onChange={setContent} />
          )}
        </div>
        <div className="form-field">
          <h2>Meta título (SEO)</h2>
          <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
        </div>

        <div className="form-field">
          <h2>Meta descripción</h2>
          <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
        </div>
        <div className="create-article-publish-options">
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="publishArticle"
              name="publishArticle"
              checked={isPublished}
              onChange={handleIsPublishedCheckboxChange}
            />
            <label htmlFor="publishArticle">Publicar artículo</label>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="submit" className="button">
            Update Post
          </button>
          <button type="button" className="button" onClick={handleExport} disabled={!savedPost}>
            Exportar .md
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
