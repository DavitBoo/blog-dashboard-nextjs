"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChangeEvent } from 'react';
import { createPost, fetchLabels, fetchPostById } from "../../../../../utils/api";
import dynamic from 'next/dynamic';
const RichTextEditor = dynamic(
  () => import('../../../../components/RichTextEditor'),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>
  }
);
import BackButton from "../../../../components/BackButton";
import DisplayLabelsAdd from "../../new/DisplayLabelsAdd/DisplayLabelsAdd";

import { ILabel } from "../../../../../interfaces/Label";

const EditPost = () => {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [labelList, setLabelList] = useState<ILabel[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const labels = await fetchLabels();
        const post = await fetchPostById(parseInt(postId as string));
        
        setLabelList(labels);
        if (post) {
          setTitle(post.title);
          setContent(post.content);
          setSelectedLabels(post.labels.map((label: any) => label.id.toString()));
          setIsPublished(post.published);
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (postId) {
      fetchData();
    }
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    try {
      const postData = {
        title,
        content,
        labels: selectedLabels,
        isPublished,
      };

      await createPost(postData);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to update post. Please try again.");
    }
  };

  const handleIsPublishedCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsPublished(event.target.checked);
  };

  return (
    <div className="creator-container">
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Post updated successfully!</p>}
      <form onSubmit={handleSubmit}>
        <BackButton />
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
        <div className="add-article-title-container">
          <h2>Título</h2>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-field">
          <h2>Contenido</h2>
          {loading ? <p>Cargando contenido...</p> : <RichTextEditor value={content} onChange={setContent} />}
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
        <button type="submit" className="button">
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
