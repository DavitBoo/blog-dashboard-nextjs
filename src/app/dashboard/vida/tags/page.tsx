"use client";

import BackButton from "@/app/components/BackButton";
import InfoText from "@/app/components/InfoText";
import React, { useEffect, useState } from "react";
import { IVidaTag } from "@/interfaces/Vida";
import { createVidaTag, deleteVidaTag, fetchVidaTags, updateVidaTag } from "@/utils/api";
import { FaEdit, FaTimes, FaCheck, FaTimesCircle, FaTag, FaPlus } from "react-icons/fa";

const VidaTagsPage = () => {
  const [showInfoText, setShowInfoText] = useState(false);
  const [infoTextMessage, setInfoTextMessage] = useState<string | null>(null);
  const [tagList, setTagList] = useState<IVidaTag[]>([]);
  const [newTag, setNewTag] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const load = async () => {
    const data = await fetchVidaTags();
    setTagList(data);
  };

  useEffect(() => {
    load();
  }, []);

  const notify = (msg: string) => {
    setInfoTextMessage(msg);
    setShowInfoText(true);
    setTimeout(() => setShowInfoText(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    try {
      await createVidaTag(newTag);
      setNewTag("");
      load();
      notify("Tag creado");
    } catch (error) {
      console.error(error);
      notify("Error al crear el tag");
    }
  };

  const handleEditSave = async () => {
    if (editingId == null || !editingName.trim()) return;
    try {
      await updateVidaTag(editingId, editingName);
      setEditingId(null);
      load();
      notify("Tag actualizado");
    } catch (error) {
      console.error(error);
      notify("Error al actualizar el tag");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Borrar este tag?")) return;
    try {
      await deleteVidaTag(id);
      load();
      notify("Tag eliminado");
    } catch (error) {
      console.error(error);
      notify("Error al eliminar el tag");
    }
  };

  return (
    <main className="manage-labels-page">
      <BackButton />
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-header-icon">
            <FaTag />
          </div>
          <div>
            <h1 className="page-title">Tags de Vida</h1>
            <p className="page-subtitle">Etiquetas para los ítems del archipiélago</p>
          </div>
        </div>
      </div>

      {showInfoText && (
        <div className="info-message">
          <InfoText message={infoTextMessage} />
        </div>
      )}

      <div className="manage-labels-grid">
        <div className="labels-section">
          <div className="section-header">
            <h2 className="section-title">Tags existentes</h2>
            <span className="labels-count">{tagList.length} tags</span>
          </div>

          {tagList.length > 0 ? (
            <ul className="labels-list">
              {tagList.map((tag) => (
                <li key={tag.id} className="label-item">
                  {editingId === tag.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="label-edit-input"
                      autoFocus
                    />
                  ) : (
                    <div className="label-content">
                      <FaTag className="label-icon" />
                      <span className="label-name">{tag.nombre}</span>
                    </div>
                  )}

                  <div className="label-actions">
                    {editingId === tag.id ? (
                      <>
                        <button className="btn-icon btn-success" onClick={handleEditSave} title="Guardar">
                          <FaCheck />
                        </button>
                        <button className="btn-icon btn-secondary" onClick={() => setEditingId(null)} title="Cancelar">
                          <FaTimesCircle />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => {
                            setEditingId(tag.id);
                            setEditingName(tag.nombre);
                          }}
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button className="btn-icon btn-danger" onClick={() => handleDelete(tag.id)} title="Eliminar">
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
              <p>No hay tags creados todavía</p>
            </div>
          )}
        </div>

        <div className="create-label-section">
          <div className="section-header">
            <h2 className="section-title">Nuevo tag</h2>
          </div>

          <form onSubmit={handleSubmit} className="create-label-form">
            <div className="form-group">
              <label htmlFor="newTag">Nombre del tag</label>
              <input
                type="text"
                id="newTag"
                className="label-input"
                placeholder="Ej: lutería, viajes, react..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-create">
              <FaPlus />
              Crear tag
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default VidaTagsPage;
