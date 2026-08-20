"use client";

import React, { useEffect, useMemo, useState } from "react";
import { fetchVidaCategorias, fetchVidaItems, fetchVidaTags, IVidaItemPayload } from "@/utils/api";
import { IVidaCategoria, IVidaItemDetalle, IVidaItemListado, IVidaTag } from "@/interfaces/Vida";
import MediaPickerModal from "./MediaPickerModal";

const AMBITOS = [
  { value: "lutheria", label: "Lutería" },
  { value: "desarrollo", label: "Desarrollo" },
  { value: "electronica", label: "Electrónica" },
  { value: "carpinteria", label: "Carpintería" },
  { value: "comunidad", label: "Comunidad" },
  { value: "audiovisual", label: "Audiovisual" },
  { value: "otro", label: "Otro" },
];

type EnlaceRow = { tipo: string; url: string; etiqueta: string };
type MediaRow = { tipo: string; src: string; alt: string; principal: boolean };

interface Props {
  initial?: IVidaItemDetalle;
  onSubmit: (payload: IVidaItemPayload) => Promise<void>;
  submitLabel: string;
}

const toDateInput = (v: string | null) => (v ? v.slice(0, 10) : "");

const VidaItemForm: React.FC<Props> = ({ initial, onSubmit, submitLabel }) => {
  const [categorias, setCategorias] = useState<IVidaCategoria[]>([]);
  const [tags, setTags] = useState<IVidaTag[]>([]);
  const [allItems, setAllItems] = useState<IVidaItemListado[]>([]);

  const [categoriaId, setCategoriaId] = useState<number | "">(initial?.categoriaId ?? "");
  const [ambito, setAmbito] = useState(initial?.ambito || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [titulo, setTitulo] = useState(initial?.titulo || "");
  const [subtitulo, setSubtitulo] = useState(initial?.subtitulo || "");
  const [resumen, setResumen] = useState(initial?.resumen || "");
  const [descripcion, setDescripcion] = useState(initial?.descripcion || "");
  const [fechaInicio, setFechaInicio] = useState(toDateInput(initial?.fechaInicio ?? null));
  const [fechaFin, setFechaFin] = useState(toDateInput(initial?.fechaFin ?? null));
  const [precisionFecha, setPrecisionFecha] = useState<"anio" | "mes" | "dia">(initial?.precisionFecha || "anio");
  const [enCurso, setEnCurso] = useState(initial?.enCurso ?? false);
  const [destacado, setDestacado] = useState(initial?.destacado ?? false);
  const [peso, setPeso] = useState(initial?.peso ?? 3);
  const [ciudad, setCiudad] = useState(initial?.ciudad || "");
  const [pais, setPais] = useState(initial?.pais || "");
  const [lat, setLat] = useState(initial?.lat != null ? String(initial.lat) : "");
  const [lng, setLng] = useState(initial?.lng != null ? String(initial.lng) : "");
  const [publicado, setPublicado] = useState(initial?.publicado ?? true);
  const [metaText, setMetaText] = useState(JSON.stringify(initial?.meta || {}, null, 2));
  const [metaError, setMetaError] = useState("");

  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(initial?.tags.map((t) => t.id) || []);
  const [enlaces, setEnlaces] = useState<EnlaceRow[]>(
    (initial?.enlaces || []).map((e) => ({ tipo: e.tipo, url: e.url, etiqueta: e.etiqueta || "" }))
  );
  const [media, setMedia] = useState<MediaRow[]>(
    (initial?.media || []).map((m) => ({ tipo: m.tipo, src: m.src, alt: m.alt || "", principal: m.principal }))
  );
  const [relacionadosIds, setRelacionadosIds] = useState<number[]>(initial?.relacionados || []);
  const [relFiltro, setRelFiltro] = useState("");
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVidaCategorias().then(setCategorias).catch(console.error);
    fetchVidaTags().then(setTags).catch(console.error);
    fetchVidaItems().then(setAllItems).catch(console.error);
  }, []);

  const categoriaSeleccionada = useMemo(() => categorias.find((c) => c.id === categoriaId), [categorias, categoriaId]);
  const esProyecto = categoriaSeleccionada?.slug === "proyectos";

  const itemsRelacionables = useMemo(
    () =>
      allItems
        .filter((it) => it.id !== initial?.id)
        .filter((it) => it.titulo.toLowerCase().includes(relFiltro.toLowerCase())),
    [allItems, initial?.id, relFiltro]
  );

  const toggleTag = (id: number) => {
    setSelectedTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const toggleRelacionado = (id: number) => {
    setRelacionadosIds((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  const addEnlace = () => setEnlaces((prev) => [...prev, { tipo: "web", url: "", etiqueta: "" }]);
  const removeEnlace = (i: number) => setEnlaces((prev) => prev.filter((_, idx) => idx !== i));
  const updateEnlace = (i: number, patch: Partial<EnlaceRow>) =>
    setEnlaces((prev) => prev.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));

  const addMediaFromPicker = (url: string) => {
    setMedia((prev) => [...prev, { tipo: "imagen", src: url, alt: "", principal: prev.length === 0 }]);
    setMediaModalOpen(false);
  };
  const removeMedia = (i: number) => setMedia((prev) => prev.filter((_, idx) => idx !== i));
  const updateMedia = (i: number, patch: Partial<MediaRow>) =>
    setMedia((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  const setMediaPrincipal = (i: number) => setMedia((prev) => prev.map((m, idx) => ({ ...m, principal: idx === i })));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!categoriaId || !titulo.trim() || !resumen.trim() || !fechaInicio) {
      setError("Categoría, título, resumen y fecha de inicio son obligatorios.");
      return;
    }

    let meta: Record<string, unknown> = {};
    try {
      meta = metaText.trim() ? JSON.parse(metaText) : {};
      if (typeof meta !== "object" || Array.isArray(meta) || meta === null) throw new Error("no es un objeto");
      setMetaError("");
    } catch {
      setMetaError("El campo meta debe ser un objeto JSON válido, p. ej. { \"clave\": \"valor\" }");
      return;
    }

    const payload: IVidaItemPayload = {
      slug: slug.trim() || undefined,
      categoriaId: Number(categoriaId),
      ambito: esProyecto ? ambito || null : null,
      titulo,
      subtitulo: subtitulo || null,
      resumen,
      descripcion: descripcion || null,
      fechaInicio,
      fechaFin: fechaFin || null,
      precisionFecha,
      enCurso,
      destacado,
      peso: Number(peso),
      ciudad: ciudad || null,
      pais: pais || null,
      lat: lat !== "" ? Number(lat) : null,
      lng: lng !== "" ? Number(lng) : null,
      meta,
      publicado,
      tags: selectedTagIds,
      enlaces: enlaces.filter((e) => e.url.trim()).map((e) => ({ tipo: e.tipo, url: e.url, etiqueta: e.etiqueta || null })),
      media: media.filter((m) => m.src.trim()).map((m) => ({ tipo: m.tipo, src: m.src, alt: m.alt || null, principal: m.principal })),
      relacionados: relacionadosIds,
    };

    setSaving(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error al guardar el ítem.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="creator-container">
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <header className="add-article-header">
          <h1 className="add-article-heading">{initial ? "Editar ítem" : "Nuevo ítem"}</h1>
        </header>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="form-field">
            <h2>Categoría *</h2>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : "")}>
              <option value="">-- Selecciona --</option>
              {categorias
                .filter((c) => c.tipoContenido === "items")
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
            </select>
          </div>

          {esProyecto && (
            <div className="form-field">
              <h2>Ámbito</h2>
              <select value={ambito} onChange={(e) => setAmbito(e.target.value)}>
                <option value="">-- Selecciona --</option>
                {AMBITOS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="add-article-title-container">
          <h2>Título *</h2>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>

        <div className="form-field">
          <h2>Slug</h2>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="se genera del título si se deja vacío" />
        </div>

        <div className="form-field">
          <h2>Subtítulo</h2>
          <input value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} />
        </div>

        <div className="form-field">
          <h2>Resumen * (máx. ~160 caracteres, es el hover)</h2>
          <textarea value={resumen} onChange={(e) => setResumen(e.target.value)} rows={2} maxLength={220} />
        </div>

        <div className="form-field">
          <h2>Descripción (markdown, opcional)</h2>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={6} />
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="form-field">
            <h2>Fecha inicio *</h2>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          </div>
          <div className="form-field">
            <h2>Fecha fin</h2>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} disabled={enCurso} />
          </div>
          <div className="form-field">
            <h2>Precisión</h2>
            <select value={precisionFecha} onChange={(e) => setPrecisionFecha(e.target.value as "anio" | "mes" | "dia")}>
              <option value="anio">año</option>
              <option value="mes">mes</option>
              <option value="dia">día</option>
            </select>
          </div>
          <div className="checkbox-container" style={{ alignSelf: "flex-end" }}>
            <input id="enCurso" type="checkbox" checked={enCurso} onChange={(e) => setEnCurso(e.target.checked)} />
            <label htmlFor="enCurso">En curso</label>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div className="checkbox-container">
            <input id="destacado" type="checkbox" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} />
            <label htmlFor="destacado">Destacado (aparece con faro en la isla)</label>
          </div>
          <div className="form-field">
            <h2>Peso (1-5, presencia visual)</h2>
            <input type="number" min={1} max={5} value={peso} onChange={(e) => setPeso(Number(e.target.value))} style={{ width: 70 }} />
          </div>
          <div className="checkbox-container">
            <input id="publicado" type="checkbox" checked={publicado} onChange={(e) => setPublicado(e.target.checked)} />
            <label htmlFor="publicado">Publicado</label>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="form-field">
            <h2>Ciudad</h2>
            <input value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
          </div>
          <div className="form-field">
            <h2>País</h2>
            <input value={pais} onChange={(e) => setPais(e.target.value)} />
          </div>
          <div className="form-field">
            <h2>Lat</h2>
            <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} style={{ width: 100 }} />
          </div>
          <div className="form-field">
            <h2>Lng</h2>
            <input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} style={{ width: 100 }} />
          </div>
        </div>

        <div className="form-field">
          <h2>Meta (JSON, campos propios de la categoría/ámbito)</h2>
          <textarea value={metaText} onChange={(e) => setMetaText(e.target.value)} rows={5} style={{ fontFamily: "monospace" }} />
          {metaError && <p className="error">{metaError}</p>}
        </div>

        <div className="form-field">
          <h2>Tags</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {tags.map((tag) => (
              <label key={tag.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input type="checkbox" checked={selectedTagIds.includes(tag.id)} onChange={() => toggleTag(tag.id)} />
                {tag.nombre}
              </label>
            ))}
            {tags.length === 0 && <span>No hay tags todavía. Créalos en Vida &gt; Tags.</span>}
          </div>
        </div>

        <div className="form-field">
          <h2>Enlaces</h2>
          {enlaces.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <select value={e.tipo} onChange={(ev) => updateEnlace(i, { tipo: ev.target.value })}>
                <option value="web">web</option>
                <option value="repo">repo</option>
                <option value="video">video</option>
                <option value="audio">audio</option>
                <option value="articulo">artículo</option>
                <option value="compra">compra</option>
                <option value="pdf">pdf</option>
              </select>
              <input placeholder="URL" value={e.url} onChange={(ev) => updateEnlace(i, { url: ev.target.value })} style={{ flex: 1 }} />
              <input
                placeholder="Etiqueta"
                value={e.etiqueta}
                onChange={(ev) => updateEnlace(i, { etiqueta: ev.target.value })}
                style={{ flex: 1 }}
              />
              <button type="button" className="btn btn-sm btn-danger" onClick={() => removeEnlace(i)}>
                Quitar
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-sm btn-secondary" onClick={addEnlace}>
            + Añadir enlace
          </button>
        </div>

        <div className="form-field">
          <h2>Media</h2>
          {media.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <img src={m.src} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 4 }} />
              <select value={m.tipo} onChange={(ev) => updateMedia(i, { tipo: ev.target.value })}>
                <option value="imagen">imagen</option>
                <option value="video">video</option>
                <option value="audio">audio</option>
                <option value="modelo3d">modelo3d</option>
              </select>
              <input placeholder="Alt" value={m.alt} onChange={(ev) => updateMedia(i, { alt: ev.target.value })} style={{ flex: 1 }} />
              <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input type="radio" name="mediaPrincipal" checked={m.principal} onChange={() => setMediaPrincipal(i)} />
                Principal
              </label>
              <button type="button" className="btn btn-sm btn-danger" onClick={() => removeMedia(i)}>
                Quitar
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-sm btn-secondary" onClick={() => setMediaModalOpen(true)}>
            + Añadir desde mediateca
          </button>
        </div>

        <div className="form-field">
          <h2>Relacionados</h2>
          <input
            placeholder="Filtrar por título..."
            value={relFiltro}
            onChange={(e) => setRelFiltro(e.target.value)}
            style={{ marginBottom: 8, width: "100%" }}
          />
          <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
            {itemsRelacionables.map((it) => (
              <label key={it.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input type="checkbox" checked={relacionadosIds.includes(it.id)} onChange={() => toggleRelacionado(it.id)} />
                <span style={{ fontSize: 12, opacity: 0.7 }}>{it.categoria?.nombre}</span> {it.titulo}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="button" disabled={saving}>
          {saving ? "Guardando..." : submitLabel}
        </button>
      </form>

      <MediaPickerModal isOpen={mediaModalOpen} onClose={() => setMediaModalOpen(false)} onSelectImage={addMediaFromPicker} />
    </div>
  );
};

export default VidaItemForm;
