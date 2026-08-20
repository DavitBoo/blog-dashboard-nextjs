"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchVidaItems } from "@/utils/api";
import { IVidaItemListado } from "@/interfaces/Vida";
import VidaItemList from "@/app/components/VidaItemList";

const VidaItemsPage = () => {
  const [items, setItems] = useState<IVidaItemListado[]>([]);
  const [filtro, setFiltro] = useState<string>("");

  const load = async () => {
    try {
      const data = await fetchVidaItems();
      setItems(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categorias = Array.from(new Set(items.map((i) => i.categoria?.nombre).filter(Boolean)));
  const filtrados = filtro ? items.filter((i) => i.categoria?.nombre === filtro) : items;

  return (
    <>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className="page-title">Ítems de Vida</h1>
            <p className="page-subtitle">Todo lo que aparece dentro de las islas del archipiélago</p>
          </div>
          <Link href="/dashboard/vida/items/new" className="btn btn-primary">
            ➕ Nuevo ítem
          </Link>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginBottom: 16 }}>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="dashboard-card">
        <VidaItemList items={filtrados} onChanged={load} />
      </div>
    </>
  );
};

export default VidaItemsPage;
