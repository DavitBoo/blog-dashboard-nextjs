"use client";

import React, { useEffect, useState } from "react";
import { ChangeEvent } from "react";
import { editProject, fetchProjectById, fetchProjectCategories } from "../../../../../utils/api";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("../../../../components/RichTextEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});
import BackButton from "../../../../components/BackButton";
import { useParams } from "next/navigation";

interface IProjectCategory {
  id: string;
  name: string;
}

const EditProject = () => {
  const { id } = useParams() as { id: string };

  const [title, setTitle] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [categoryList, setCategoryList] = useState<IProjectCategory[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catData = await fetchProjectCategories();
        setCategoryList(catData);
        
        if (id) {
          const projectData = await fetchProjectById(parseInt(id, 10));
          setTitle(projectData.title);
          setContent(projectData.content);
          setCategoryId(projectData.categoryId ? String(projectData.categoryId) : "");
          setIsPublished(projectData.published);
        }
      } catch (e) {
        console.error(e);
        setError("Error loading project information");
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    try {
      await editProject(id, {
        title,
        content,
        categoryId: categoryId || null,
        isPublished,
        cover,
      });
      setError("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to update project. Please try again.");
    }
  };

  const handleIsPublishedCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsPublished(event.target.checked);
  };

  return (
    <div className="creator-container">
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Project updated successfully!</p>}
      <form onSubmit={handleSubmit}>
        <BackButton />
        <header className="add-article-header">
          <h1 className="add-article-heading">Editar Proyecto</h1>
        </header>

        <div className="form-field">
          <h2>Categoría</h2>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">-- Selecciona una categoría (Opcional) --</option>
            {categoryList.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <h2>Imagen destacada (Opcional)</h2>
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
          <RichTextEditor value={content} onChange={setContent} />
        </div>
        
        <div className="create-article-publish-options">
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="publishProject"
              name="publishProject"
              checked={isPublished}
              onChange={handleIsPublishedCheckboxChange}
            />
            <label htmlFor="publishProject">Publicar proyecto</label>
          </div>
        </div>
        <button type="submit" className="button">
          Update Project
        </button>
      </form>
    </div>
  );
};

export default EditProject;
