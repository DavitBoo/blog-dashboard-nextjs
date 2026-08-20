"use client";

import React, { useState } from "react";
import { IVidaLibro } from "@/interfaces/Vida";

interface Props {
  initial?: IVidaLibro;
  onSubmit: (data: Partial<IVidaLibro>) => Promise<void>;
  submitLabel: string;
}

const VidaLibroForm: React.FC<Props> = ({ initial, onSubmit, submitLabel }) => {
  const [titulo, setTitulo] = useState(initial?.titulo || "");
  const [autor, setAutor] = useState(initial?.autor || "");
  const [anioLectura, setAnioLectura] = useState(initial?.anioLectura ?? new Date().getFullYear());
  const [genero, setGenero] = useState(initial?.genero || "");
  const [nota, setNota] = useState(initial?.nota || "");
  const [color, setColor] = useState(initial?.color || "#04adbf");
  const [paginas, setPaginas] = useState(initial?.paginas != null ? String(initial.paginas) : "");
  const [destacado, setDestacado] = useState(initial?.destacado ?? false);
  const [orden, setOrden] = useState(initial?.orden ?? 0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !autor.trim()) {
      setError("Título y autor son obligatorios.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        titulo,
        autor,
        anioLectura: Number(anioLectura),
        genero: genero || null,
        nota: nota || null,
        color,
        paginas: paginas !== "" ? Number(paginas) : null,
        destacado,
        orden: Number(orden),
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error al guardar el libro.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="creator-container">
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <header className="add-article-header">
          <h1 className="add-article-heading">{initial ? "Editar libro" : "Nuevo libro"}</h1>
        </header>

        <div className="add-article-title-container">
          <h2>Título</h2>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>

        <div className="form-field">
          <h2>Autor</h2>
          <input value={autor} onChange={(e) => setAutor(e.target.value)} />
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="form-field">
            <h2>Año de lectura</h2>
            <input type="number" value={anioLectura} onChange={(e) => setAnioLectura(Number(e.target.value))} style={{ width: 100 }} />
          </div>
          <div className="form-field">
            <h2>Color del lomo</h2>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <div className="form-field">
            <h2>Páginas</h2>
            <input type="number" value={paginas} onChange={(e) => setPaginas(e.target.value)} style={{ width: 100 }} />
          </div>
          <div className="form-field">
            <h2>Orden</h2>
            <input type="number" value={orden} onChange={(e) => setOrden(Number(e.target.value))} style={{ width: 80 }} />
          </div>
          <div className="form-field">
            <h2>Género</h2>
            <input value={genero} onChange={(e) => setGenero(e.target.value)} placeholder="Novela, Ensayo, Técnico..." />
          </div>
        </div>

        <div className="form-field">
          <h2>Nota (opcional, comentario personal breve)</h2>
          <textarea value={nota} onChange={(e) => setNota(e.target.value)} rows={2} />
        </div>

        <div className="checkbox-container">
          <input id="destacado" type="checkbox" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} />
          <label htmlFor="destacado">Destacado (aparece en el panel de la isla)</label>
        </div>

        <button type="submit" className="button" disabled={saving}>
          {saving ? "Guardando..." : submitLabel}
        </button>
      </form>
    </div>
  );
};

export default VidaLibroForm;
