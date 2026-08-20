"use client";

import React, { useEffect, useState } from "react";
import BackButton from "@/app/components/BackButton";
import InfoText from "@/app/components/InfoText";
import { createVidaCategoria, deleteVidaCategoria, fetchVidaCategorias, updateVidaCategoria } from "@/utils/api";
import { IVidaCategoria } from "@/interfaces/Vida";
import { FaEdit, FaCheck, FaTimesCircle, FaTrashAlt, FaPlus } from "react-icons/fa";

type FormState = Omit<IVidaCategoria, "id" | "itemsCount">;

const EMPTY_FORM: FormState = {
  slug: "",
  nombre: "",
  descripcion: "",
  orden: 0,
  posX: 0,
  posY: 0,
  radio: 20,
  tipoContenido: "items",
  urlDestino: null,
  endpointPreview: null,
  publicada: true,
};

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState<IVidaCategoria[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);
  const [newForm, setNewForm] = useState<FormState>(EMPTY_FORM);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const load = async () => {
    const data = await fetchVidaCategorias();
    setCategorias(data.sort((a, b) => a.orden - b.orden));
  };

  useEffect(() => {
    load();
  }, []);

  const notify = (msg: string) => {
    setInfoMessage(msg);
    setShowInfo(true);
    setTimeout(() => setShowInfo(false), 2500);
  };

  const startEdit = (cat: IVidaCategoria) => {
    setEditingId(cat.id);
    setEditForm({ ...cat });
  };

  const saveEdit = async () => {
    if (editingId == null) return;
    try {
      await updateVidaCategoria(editingId, editForm);
      setEditingId(null);
      load();
      notify("Categoría actualizada");
    } catch (e) {
      console.error(e);
      notify("Error al actualizar la categoría");
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm("¿Borrar esta isla? Sus ítems dejarán de tener categoría y no se podrán mostrar.")) return;
    try {
      await deleteVidaCategoria(id);
      load();
      notify("Categoría eliminada");
    } catch (e) {
      console.error(e);
      notify("Error al eliminar la categoría");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.nombre.trim()) return;
    try {
      await createVidaCategoria(newForm);
      setNewForm(EMPTY_FORM);
      load();
      notify("Categoría creada");
    } catch (e) {
      console.error(e);
      notify("Error al crear la categoría");
    }
  };

  return (
    <main>
      <BackButton />
      <div className="page-header">
        <h1 className="page-title">Islas (categorías)</h1>
        <p className="page-subtitle">
          Geometría del archipiélago: posición y tamaño de cada isla. Los cambios se reflejan directamente en /vida.
        </p>
      </div>

      {showInfo && <InfoText message={infoMessage} />}

      <div className="dashboard-card">
        <table className="dashboard-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Orden</th>
              <th>pos X</th>
              <th>pos Y</th>
              <th>Radio</th>
              <th>Tipo</th>
              <th>Publicada</th>
              <th>Ítems</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) =>
              editingId === cat.id ? (
                <tr key={cat.id}>
                  <td>
                    <input value={editForm.nombre} onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editForm.orden}
                      onChange={(e) => setEditForm({ ...editForm, orden: Number(e.target.value) })}
                      style={{ width: 60 }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editForm.posX}
                      onChange={(e) => setEditForm({ ...editForm, posX: Number(e.target.value) })}
                      style={{ width: 70 }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editForm.posY}
                      onChange={(e) => setEditForm({ ...editForm, posY: Number(e.target.value) })}
                      style={{ width: 70 }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editForm.radio}
                      onChange={(e) => setEditForm({ ...editForm, radio: Number(e.target.value) })}
                      style={{ width: 60 }}
                    />
                  </td>
                  <td>
                    <select
                      value={editForm.tipoContenido}
                      onChange={(e) => setEditForm({ ...editForm, tipoContenido: e.target.value as "items" | "portal" })}
                    >
                      <option value="items">items</option>
                      <option value="portal">portal</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={editForm.publicada}
                      onChange={(e) => setEditForm({ ...editForm, publicada: e.target.checked })}
                    />
                  </td>
                  <td>{cat.itemsCount ?? "-"}</td>
                  <td>
                    <button className="btn-icon btn-success" onClick={saveEdit} title="Guardar">
                      <FaCheck />
                    </button>
                    <button className="btn-icon btn-secondary" onClick={() => setEditingId(null)} title="Cancelar">
                      <FaTimesCircle />
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={cat.id}>
                  <td>{cat.nombre}</td>
                  <td>{cat.orden}</td>
                  <td>{cat.posX}</td>
                  <td>{cat.posY}</td>
                  <td>{cat.radio}</td>
                  <td>{cat.tipoContenido}</td>
                  <td>{cat.publicada ? "sí" : "no"}</td>
                  <td>{cat.itemsCount ?? "-"}</td>
                  <td>
                    <button className="btn-icon btn-edit" onClick={() => startEdit(cat)} title="Editar">
                      <FaEdit />
                    </button>
                    <button className="btn-icon btn-danger" onClick={() => remove(cat.id)} title="Eliminar">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {categorias.find((c) => editingId === c.id) && (
          <div className="form-field" style={{ marginTop: 16 }}>
            <h3>Descripción de la isla en edición</h3>
            <textarea
              value={editForm.descripcion || ""}
              onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
              rows={2}
              style={{ width: "100%" }}
            />
          </div>
        )}
      </div>

      <div className="dashboard-card" style={{ marginTop: 24 }}>
        <h2>Nueva isla</h2>
        <form onSubmit={handleCreate} className="creator-container">
          <div className="form-field">
            <h3>Nombre</h3>
            <input value={newForm.nombre} onChange={(e) => setNewForm({ ...newForm, nombre: e.target.value })} />
          </div>
          <div className="form-field">
            <h3>Descripción</h3>
            <textarea value={newForm.descripcion || ""} onChange={(e) => setNewForm({ ...newForm, descripcion: e.target.value })} rows={2} />
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div className="form-field">
              <h3>Orden</h3>
              <input type="number" value={newForm.orden} onChange={(e) => setNewForm({ ...newForm, orden: Number(e.target.value) })} />
            </div>
            <div className="form-field">
              <h3>pos X</h3>
              <input type="number" value={newForm.posX} onChange={(e) => setNewForm({ ...newForm, posX: Number(e.target.value) })} />
            </div>
            <div className="form-field">
              <h3>pos Y</h3>
              <input type="number" value={newForm.posY} onChange={(e) => setNewForm({ ...newForm, posY: Number(e.target.value) })} />
            </div>
            <div className="form-field">
              <h3>Radio</h3>
              <input type="number" value={newForm.radio} onChange={(e) => setNewForm({ ...newForm, radio: Number(e.target.value) })} />
            </div>
            <div className="form-field">
              <h3>Tipo</h3>
              <select value={newForm.tipoContenido} onChange={(e) => setNewForm({ ...newForm, tipoContenido: e.target.value as "items" | "portal" })}>
                <option value="items">items</option>
                <option value="portal">portal</option>
              </select>
            </div>
          </div>
          <button type="submit" className="button">
            <FaPlus /> Crear isla
          </button>
        </form>
      </div>
    </main>
  );
};

export default CategoriasPage;
