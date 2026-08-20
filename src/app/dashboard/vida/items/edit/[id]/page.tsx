"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BackButton from "@/app/components/BackButton";
import VidaItemForm from "@/app/components/VidaItemForm";
import { fetchVidaItemById, updateVidaItem, IVidaItemPayload } from "@/utils/api";
import { IVidaItemDetalle } from "@/interfaces/Vida";

const EditVidaItemPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [item, setItem] = useState<IVidaItemDetalle | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchVidaItemById(Number(id))
      .then(setItem)
      .catch((e) => {
        console.error(e);
        setError("No se pudo cargar el ítem.");
      });
  }, [id]);

  const handleSubmit = async (payload: IVidaItemPayload) => {
    await updateVidaItem(Number(id), payload);
    router.push("/dashboard/vida/items");
  };

  if (error) return <p className="error">{error}</p>;
  if (!item) return <p>Cargando ítem...</p>;

  return (
    <>
      <BackButton />
      <VidaItemForm initial={item} onSubmit={handleSubmit} submitLabel="Guardar cambios" />
    </>
  );
};

export default EditVidaItemPage;
