"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { IVidaItemListado } from "@/interfaces/Vida";
import { deleteVidaItem } from "@/utils/api";
import ConfirmVidaDelete from "./ConfirmVidaDelete";

interface Props {
  items: IVidaItemListado[];
  onChanged: () => void;
}

const VidaItemList: React.FC<Props> = ({ items, onChanged }) => {
  const [toDelete, setToDelete] = useState<number | null>(null);

  return (
    <>
      {toDelete != null && (
        <ConfirmVidaDelete
          isOpen={true}
          onClose={() => {
            setToDelete(null);
            onChanged();
          }}
          onConfirm={() => deleteVidaItem(toDelete)}
          successMessage="¡Se ha borrado el ítem!"
        />
      )}

      <div className="posts-grid">
        {items.map((item) => (
          <div key={item.id} className="post-card">
            <div className="post-card-header">
              <h3 className="post-title">{item.titulo}</h3>
              <span className={`post-status ${item.publicado ? "published" : "draft"}`}>
                {item.publicado ? "Publicado" : "Borrador"}
              </span>
            </div>
            <p style={{ fontSize: 12, opacity: 0.75, margin: "4px 0" }}>
              {item.categoria?.nombre}
              {item.ambito ? ` · ${item.ambito}` : ""}
              {item.destacado ? " · ★ destacado" : ""}
            </p>
            {item.tags.length > 0 && <p style={{ fontSize: 11, opacity: 0.6 }}>{item.tags.join(", ")}</p>}

            <div className="post-card-actions">
              <Link href={`./items/edit/${item.id}`} className="btn btn-sm btn-secondary">
                <FaEdit /> Editar
              </Link>
              <button className="btn btn-sm btn-danger" onClick={() => setToDelete(item.id)}>
                <FaTrashAlt /> Borrar
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🏝️</span>
          <h3>No hay ítems todavía</h3>
          <p>Añade el primer ítem de una isla</p>
          <Link href="/dashboard/vida/items/new" className="btn btn-primary">
            Crear ítem
          </Link>
        </div>
      )}
    </>
  );
};

export default VidaItemList;
