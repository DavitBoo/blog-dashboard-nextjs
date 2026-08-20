"use client";

import { useRouter } from "next/navigation";
import BackButton from "@/app/components/BackButton";
import VidaLibroForm from "@/app/components/VidaLibroForm";
import { createVidaLibro } from "@/utils/api";
import { IVidaLibro } from "@/interfaces/Vida";

const NewLibroPage = () => {
  const router = useRouter();

  const handleSubmit = async (data: Partial<IVidaLibro>) => {
    await createVidaLibro(data);
    router.push("/dashboard/vida/libros");
  };

  return (
    <>
      <BackButton />
      <VidaLibroForm onSubmit={handleSubmit} submitLabel="Crear libro" />
    </>
  );
};

export default NewLibroPage;
