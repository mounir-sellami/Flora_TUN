import { db } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import type { AppData } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [species, governorates, protectedAreas, observations] = await Promise.all([
    db.species.findMany({ orderBy: { arabicName: "asc" } }),
    db.governorate.findMany({ orderBy: { id: "asc" } }),
    db.protectedArea.findMany({ orderBy: { areaHa: "desc" } }),
    db.observation.findMany({
      include: {
        species: {
          select: { id: true, arabicName: true, scientificName: true, emoji: true, conservation: true },
        },
      },
      orderBy: { date: "desc" },
    }),
  ]);

  // Normalise les dates en chaînes ISO pour le passage serveur → client
  const data: AppData = JSON.parse(
    JSON.stringify({ species, governorates, protectedAreas, observations })
  );

  return <AppShell data={data} />;
}
