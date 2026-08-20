"use client";

import { useRouter } from "next/navigation";
import BackButton from "@/app/components/BackButton";
import VidaItemForm from "@/app/components/VidaItemForm";
import { createVidaItem, IVidaItemPayload } from "@/utils/api";

const NewVidaItemPage = () => {
  const router = useRouter();

  const handleSubmit = async (payload: IVidaItemPayload) => {
    await createVidaItem(payload);
    router.push("/dashboard/vida/items");
  };

  return (
    <>
      <BackButton />
      <VidaItemForm onSubmit={handleSubmit} submitLabel="Crear ítem" />
    </>
  );
};

export default NewVidaItemPage;
