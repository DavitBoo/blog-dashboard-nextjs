"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import BackButton from "@/app/components/BackButton";
import InfoText from "@/app/components/InfoText";
import ConfirmVidaDelete from "@/app/components/ConfirmVidaDelete";
import { fetchVidaLibros, deleteVidaLibro, fetchVidaLecturasResumen, updateVidaLecturasResumen } from "@/utils/api";
import { IVidaLibro } from "@/interfaces/Vida";

const LibrosPage = () => {
  const [libros, setLibros] = useState<IVidaLibro[]>([]);
  const [toDelete, setToDelete] = useState<number | null>(null);
  const [cifra, setCifra] = useState("");
  const [savingCifra, setSavingCifra] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const load = async () => {
    const data = await fetchVidaLibros();
    setLibros(data);
  };

  useEffect(() => {
    load();
    fetchVidaLecturasResumen().then((r) => setCifra(r.cifra || "")).catch(console.error);
  }, []);

  const notify = (msg: string) => {
    setInfoMessage(msg);
    setShowInfo(true);
    setTimeout(() => setShowInfo(false), 2500);
  };

  const saveCifra = async () => {
    setSavingCifra(true);
    try {
      await updateVidaLecturasResumen(cifra);
      notify("Cifra actualizada");
    } catch (e) {
      console.error(e);
      notify("Error al guardar la cifra");
    } finally {
      setSavingCifra(false);
    }
  };

  return (
    <>
      <BackButton />
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className="page-title">Lecturas</h1>
            <p className="page-subtitle">Libros que alimentan el panel de la isla portal y el catálogo /libros</p>
          </div>
          <Link href="/dashboard/vida/libros/new" className="btn btn-primary">
            ➕ Nuevo libro
          </Link>
        </div>
      </div>

      {showInfo && <InfoText message={infoMessage} />}

      {toDelete != null && (
        <ConfirmVidaDelete
          isOpen={true}
          onClose={() => {
            setToDelete(null);
            load();
          }}
          onConfirm={() => deleteVidaLibro(toDelete)}
          successMessage="¡Se ha borrado el libro!"
        />
      )}

      <div className="dashboard-card" style={{ marginBottom: 16 }}>
        <h2>Cifra con gracia</h2>
        <p className="page-subtitle">Texto libre que se muestra en el panel de la isla, p. ej. &quot;384.000 páginas ≈ 19 metros de estantería&quot;.</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={cifra} onChange={(e) => setCifra(e.target.value)} style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={saveCifra} disabled={savingCifra}>
            Guardar
          </button>
        </div>
      </div>

      <div className="dashboard-card">
        <table className="dashboard-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Año</th>
              <th>Género</th>
              <th>Destacado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {libros.map((libro) => (
              <tr key={libro.id}>
                <td>
                  <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 2, background: libro.color || "#8a6a3d", marginRight: 8 }} />
                  {libro.titulo}
                </td>
                <td>{libro.autor}</td>
                <td>{libro.anioLectura}</td>
                <td>{libro.genero || "—"}</td>
                <td>{libro.destacado ? "★" : ""}</td>
                <td>
                  <Link href={`./libros/edit/${libro.id}`} className="btn-icon btn-edit">
                    <FaEdit />
                  </Link>
                  <button className="btn-icon btn-danger" onClick={() => setToDelete(libro.id)}>
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {libros.length === 0 && <p>No hay libros todavía.</p>}
      </div>
    </>
  );
};

export default LibrosPage;
