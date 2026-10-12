import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const species = await db.species.findMany({
      orderBy: { arabicName: "asc" },
    });
    return NextResponse.json(species);
  } catch (error) {
    console.error("GET /api/species", error);
    return NextResponse.json({ error: "تعذر جلب الأنواع" }, { status: 500 });
  }
}
