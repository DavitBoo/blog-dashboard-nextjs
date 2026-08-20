"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BackButton from "@/app/components/BackButton";
import VidaLibroForm from "@/app/components/VidaLibroForm";
import { fetchVidaLibroById, updateVidaLibro } from "@/utils/api";
import { IVidaLibro } from "@/interfaces/Vida";

const EditLibroPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [libro, setLibro] = useState<IVidaLibro | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchVidaLibroById(Number(id))
      .then(setLibro)
      .catch((e) => {
        console.error(e);
        setError("No se pudo cargar el libro.");
      });
  }, [id]);

  const handleSubmit = async (data: Partial<IVidaLibro>) => {
    await updateVidaLibro(Number(id), data);
    router.push("/dashboard/vida/libros");
  };

  if (error) return <p className="error">{error}</p>;
  if (!libro) return <p>Cargando libro...</p>;

  return (
    <>
      <BackButton />
      <VidaLibroForm initial={libro} onSubmit={handleSubmit} submitLabel="Guardar cambios" />
    </>
  );
};

export default EditLibroPage;
