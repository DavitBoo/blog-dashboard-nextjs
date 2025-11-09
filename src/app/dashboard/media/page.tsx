"use client";

import { useRouter } from "next/navigation";
import { MediaGallery } from "./MediaGalery";

export default function DashboardPage() {
  return (
    <main>
      <MediaGallery />
    </main>
  );
}
