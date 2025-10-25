"use client";

import BackButton from "@/app/components/BackButton";
import InfoText from "@/app/components/InfoText";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { ILabel } from "../../../interfaces/Label";
import { createLabel, deleteLabel, fetchLabels, updateLabel } from "@/utils/api";
import { FaEdit, FaTimes, FaCheck, FaTimesCircle, FaTag, FaPlus } from "react-icons/fa";

const page = () => {
  const router = useRouter();

  const [showInfoText, setShowInfoText] = useState<boolean>(false);
  const [infoTextMessage, setInfoTextMessage] = useState<string | null>(null);
  const [labelList, setLabelList] = useState<ILabel[]>();
  const [newLabel, setNewLabel] = useState<string>("");

  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [editingLabelName, setEditingLabelName] = useState<string>("");

  const fetchLabelList = async () => {
    const data = await fetchLabels();
    setLabelList(data);
  };

  useEffect(() => {
    fetchLabelList();
  }, []);

  const successfulSubmit = () => {
    setInfoTextMessage("Etiquetas actualizadas correctamente");
    setShowInfoText(true);
    setTimeout(() => {
      setShowInfoText(false);
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    try {
      const newLabelData = await createLabel({ name: newLabel });
      setNewLabel("");
      setLabelList((prev) => [...(prev ?? []), newLabelData]);
      successfulSubmit();
    } catch (error) {
      console.error("Error creating label:", error);
      setInfoTextMessage("Error al crear la etiqueta");
      setShowInfoText(true);
      setTimeout(() => setShowInfoText(false), 3000);
    }
  };

  const handleEditClick = (id: string, name: string) => {
    setEditingLabelId(id);
    setEditingLabelName(name);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingLabelName(e.target.value);
  };

  const handleEditSave = async () => {
    if (!editingLabelId || !editingLabelName.trim()) return;

    try {
      await updateLabel(editingLabelId, { name: editingLabelName });
      setLabelList((prev) => prev?.map(label => label.id === editingLabelId ? { ...label, name: editingLabelName } : label));
      setEditingLabelId(null);
      setInfoTextMessage("Etiqueta actualizada");
      setShowInfoText(true);
      setTimeout(() => setShowInfoText(false), 3000);
    } catch (error) {
      console.error("Error updating label:", error);
      setInfoTextMessage("Error al actualizar la etiqueta");
      setShowInfoText(true);
      setTimeout(() => setShowInfoText(false), 3000);
    }
  };

  const handleEditCancel = () => {
    setEditingLabelId(null);
  };

  const handleTagDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta etiqueta?")) {
      try {
        const res = await deleteLabel(id);
        if (res.ok) {
          fetchLabelList();
          setInfoTextMessage("Etiqueta eliminada");
          setShowInfoText(true);
          setTimeout(() => setShowInfoText(false), 3000);
        }
      } catch (error) {
        console.error("Error deleting label:", error);
        setInfoTextMessage("Error al eliminar la etiqueta");
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
            <FaTag />
          </div>
          <div>
            <h1 className="page-title">Gestión de Etiquetas</h1>
            <p className="page-subtitle">Organiza y administra las etiquetas de tus artículos</p>
          </div>
        </div>
      </div>

      {showInfoText && (
        <div className="info-message">
          <InfoText message={infoTextMessage} />
        </div>
      )}

      <div className="manage-labels-grid">
        {/* Existing Labels Section */}
        <div className="labels-section">
          <div className="section-header">
            <h2 className="section-title">Etiquetas Existentes</h2>
            <span className="labels-count">{labelList?.length || 0} etiquetas</span>
          </div>

          {labelList && labelList.length > 0 ? (
            <ul className="labels-list">
              {labelList.map((label) => (
                <li key={label.id} className="label-item">
                  {editingLabelId === label.id ? (
                    <input
                      type="text"
                      value={editingLabelName}
                      onChange={handleEditChange}
                      className="label-edit-input"
                      autoFocus
                    />
                  ) : (
                    <div className="label-content">
                      <FaTag className="label-icon" />
                      <span className="label-name">{label.name}</span>
                    </div>
                  )}
                  
                  <div className="label-actions">
                    {editingLabelId === label.id ? (
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
                          onClick={() => handleEditClick(label.id, label.name)}
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-icon btn-danger" 
                          onClick={() => handleTagDelete(label.id)}
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
              <FaTag className="empty-icon" />
              <p>No hay etiquetas creadas todavía</p>
            </div>
          )}
        </div>

        {/* Create New Label Section */}
        <div className="create-label-section">
          <div className="section-header">
            <h2 className="section-title">Nueva Etiqueta</h2>
          </div>

          <form onSubmit={handleSubmit} className="create-label-form">
            <div className="form-group">
              <label htmlFor="newLabel">Nombre de la etiqueta</label>
              <input
                type="text"
                id="newLabel"
                name="newLabel"
                className="label-input"
                placeholder="Ej: Tecnología, Diseño, Marketing..."
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-create">
              <FaPlus />
              Crear Etiqueta
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default page;