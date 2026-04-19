"use client";

import BackButton from "@/app/components/BackButton";
import InfoText from "@/app/components/InfoText";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { createProjectCategory, deleteProjectCategory, fetchProjectCategories, updateProjectCategory } from "@/utils/api";
import { FaEdit, FaTimes, FaCheck, FaTimesCircle, FaFolder, FaPlus } from "react-icons/fa";

interface IProjectCategory {
  id: string;
  name: string;
  slug: string;
}

const ProjectCategoriesPage = () => {
  const router = useRouter();

  const [showInfoText, setShowInfoText] = useState<boolean>(false);
  const [infoTextMessage, setInfoTextMessage] = useState<string | null>(null);
  const [categoryList, setCategoryList] = useState<IProjectCategory[]>();
  const [newCategory, setNewCategory] = useState<string>("");

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState<string>("");

  const fetchCategoryList = async () => {
    try {
      const data = await fetchProjectCategories();
      setCategoryList(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const successfulSubmit = () => {
    setInfoTextMessage("Categorías actualizadas correctamente");
    setShowInfoText(true);
    setTimeout(() => {
      setShowInfoText(false);
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const newCatData = await createProjectCategory({ name: newCategory });
      setNewCategory("");
      setCategoryList((prev) => [...(prev ?? []), newCatData]);
      successfulSubmit();
    } catch (error) {
      console.error("Error creating category:", error);
      setInfoTextMessage("Error al crear la categoría");
      setShowInfoText(true);
      setTimeout(() => setShowInfoText(false), 3000);
    }
  };

  const handleEditClick = (id: string, name: string) => {
    setEditingCategoryId(id);
    setEditingCategoryName(name);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingCategoryName(e.target.value);
  };

  const handleEditSave = async () => {
    if (!editingCategoryId || !editingCategoryName.trim()) return;

    try {
      await updateProjectCategory(editingCategoryId, { name: editingCategoryName });
      setCategoryList((prev) => prev?.map(cat => cat.id === editingCategoryId ? { ...cat, name: editingCategoryName } : cat));
      setEditingCategoryId(null);
      setInfoTextMessage("Categoría actualizada");
      setShowInfoText(true);
      setTimeout(() => setShowInfoText(false), 3000);
    } catch (error) {
      console.error("Error updating category:", error);
      setInfoTextMessage("Error al actualizar la categoría");
      setShowInfoText(true);
      setTimeout(() => setShowInfoText(false), 3000);
    }
  };

  const handleEditCancel = () => {
    setEditingCategoryId(null);
  };

  const handleCategoryDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      try {
        const res = await deleteProjectCategory(id);
        if (res.ok) {
          fetchCategoryList();
          setInfoTextMessage("Categoría eliminada");
          setShowInfoText(true);
          setTimeout(() => setShowInfoText(false), 3000);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        setInfoTextMessage("Error al eliminar la categoría");
        setShowInfoText(true);
        setTimeout(() => setShowInfoText(false), 3000);
      }
    }
  };

  return (
    <main className="manage-labels-page">
      <BackButton />
      
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-header-icon">
            <FaFolder />
          </div>
          <div>
            <h1 className="page-title">Gestión de Categorías de Proyecto</h1>
            <p className="page-subtitle">Organiza los tipos de proyectos que realizas (Ejs. Guitarras, Restauraciones)</p>
          </div>
        </div>
      </div>

      {showInfoText && (
        <div className="info-message">
          <InfoText message={infoTextMessage} />
        </div>
      )}

      <div className="manage-labels-grid">
        {/* Existing Section */}
        <div className="labels-section">
          <div className="section-header">
            <h2 className="section-title">Categorías Existentes</h2>
            <span className="labels-count">{categoryList?.length || 0} categorías</span>
          </div>

          {categoryList && categoryList.length > 0 ? (
            <ul className="labels-list">
              {categoryList.map((cat) => (
                <li key={cat.id} className="label-item">
                  {editingCategoryId === cat.id ? (
                    <input
                      type="text"
                      value={editingCategoryName}
                      onChange={handleEditChange}
                      className="label-edit-input"
                      autoFocus
                    />
                  ) : (
                    <div className="label-content">
                      <FaFolder className="label-icon" />
                      <span className="label-name">{cat.name}</span>
                    </div>
                  )}
                  
                  <div className="label-actions">
                    {editingCategoryId === cat.id ? (
                      <>
                        <button 
                          className="btn-icon btn-success" 
                          onClick={handleEditSave}
                          title="Guardar"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          className="btn-icon btn-secondary" 
                          onClick={handleEditCancel}
                          title="Cancelar"
                        >
                          <FaTimesCircle />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="btn-icon btn-edit" 
                          onClick={() => handleEditClick(cat.id, cat.name)}
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-icon btn-danger" 
                          onClick={() => handleCategoryDelete(cat.id)}
                          title="Eliminar"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-labels">
              <FaFolder className="empty-icon" />
              <p>No hay categorías creadas todavía</p>
            </div>
          )}
        </div>

        {/* Create New Section */}
        <div className="create-label-section">
          <div className="section-header">
            <h2 className="section-title">Nueva Categoría</h2>
          </div>

          <form onSubmit={handleSubmit} className="create-label-form">
            <div className="form-group">
              <label htmlFor="newCategory">Nombre de la categoría</label>
              <input
                type="text"
                id="newCategory"
                name="newCategory"
                className="label-input"
                placeholder="Ej: Luthier, Muebles..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-create">
              <FaPlus />
              Crear Categoría
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ProjectCategoriesPage;
