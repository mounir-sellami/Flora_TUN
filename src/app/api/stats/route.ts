import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [species, observations, areas] = await Promise.all([
      db.species.findMany(),
      db.observation.findMany(),
      db.protectedArea.findMany(),
    ]);

    const perZone: Record<string, number> = {};
    const perConservation: Record<string, number> = {};
    const perFamily: Record<string, number> = {};
    for (const s of species) {
      perZone[s.zone] = (perZone[s.zone] ?? 0) + 1;
      perConservation[s.conservation] = (perConservation[s.conservation] ?? 0) + 1;
      perFamily[s.familyAr] = (perFamily[s.familyAr] ?? 0) + 1;
    }

    return NextResponse.json({
      totalSpecies: species.length,
      totalFamilies: Object.keys(perFamily).length,
      totalObservations: observations.length,
      totalProtectedAreas: areas.length,
      totalProtectedHa: areas.reduce((a, x) => a + x.areaHa, 0),
      endemic: species.filter((s) => s.endemic).length,
      threatened: species.filter((s) => ["VU", "EN", "CR"].includes(s.conservation)).length,
      perZone,
      perConservation,
      perFamily,
    });
  } catch (error) {
    console.error("GET /api/stats", error);
    return NextResponse.json({ error: "تعذر جلب الإحصائيات" }, { status: 500 });
  }
}
