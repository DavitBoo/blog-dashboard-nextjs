"use client";

import React, { useEffect, useState } from "react";
import { ChangeEvent } from "react";
import { createPost, fetchLabels } from "../../../../utils/api";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("../../../components/RichTextEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});
import BackButton from "../../../components/BackButton";
import DisplayLabelsAdd from "./DisplayLabelsAdd/DisplayLabelsAdd";

import { ILabel } from "../../../../interfaces/Label";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [labelList, setLabelList] = useState<ILabel[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLabels();
      setLabelList(data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    try {      
      await createPost({
        title,
        content,
        labels: selectedLabels,
        isPublished,
        cover, 
      });
      setTitle("");
      setContent("");
      setSelectedLabels([]);
      setIsPublished(false);
      setCover(null);
      setError("");
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to create post. Please try again.");
    }
  };

  const handleIsPublishedCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsPublished(event.target.checked);
  };

  return (
    <div className="creator-container">
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Post created successfully!</p>}
      <form onSubmit={handleSubmit}>
        <BackButton />
        <header className="add-article-header">
          <h1 className="add-article-heading">Añadir artículo</h1>
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
          <h2>Contentenido</h2>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
        <div className="create-article-publish-options">
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="publishArticle"
              name="publishArticle"
              onChange={handleIsPublishedCheckboxChange}
            />
            <label htmlFor="publishArticle">Publicar artículo</label>
          </div>
        </div>
        <button type="submit" className="button">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default NewPost;
