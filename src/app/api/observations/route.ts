import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const observationSchema = z.object({
  speciesId: z.string().min(1, "يجب اختيار النوع النباتي"),
  regionId: z.string().min(1, "يجب اختيار الولاية"),
  lat: z.number().min(30).max(38).nullable().optional(),
  lng: z.number().min(7).max(13).nullable().optional(),
  observer: z.string().min(2, "اسم المراقب مطلوب (حرفان على الأقل)").max(80),
  notes: z.string().max(500).nullable().optional(),
  date: z.string().optional(),
});

export async function GET() {
  try {
    const observations = await db.observation.findMany({
      include: {
        species: {
          select: {
            id: true,
            arabicName: true,
            scientificName: true,
            emoji: true,
            conservation: true,
          },
        },
      },
      orderBy: { date: "desc" },
      take: 100,
    });
    return NextResponse.json(observations);
  } catch (error) {
    console.error("GET /api/observations", error);
    return NextResponse.json({ error: "تعذر جلب المشاهدات" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = observationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const species = await db.species.findUnique({ where: { id: data.speciesId } });
    if (!species) {
      return NextResponse.json({ error: "النوع النباتي غير موجود" }, { status: 404 });
    }
    const governorate = await db.governorate.findUnique({ where: { id: data.regionId } });
    if (!governorate) {
      return NextResponse.json({ error: "الولاية غير موجودة" }, { status: 404 });
    }

    const observation = await db.observation.create({
      data: {
        speciesId: data.speciesId,
        regionId: data.regionId,
        lat: data.lat ?? (governorate.lat + (Math.random() - 0.5) * 0.25),
        lng: data.lng ?? (governorate.lng + (Math.random() - 0.5) * 0.25),
        observer: data.observer.trim(),
        notes: data.notes?.trim() || null,
        date: data.date ? new Date(data.date) : new Date(),
      },
      include: {
        species: {
          select: {
            id: true,
            arabicName: true,
            scientificName: true,
            emoji: true,
            conservation: true,
          },
        },
      },
    });

    // Enrichit automatiquement la carte de répartition de l'espèce
    const regions: string[] = JSON.parse(species.regions);
    if (!regions.includes(data.regionId)) {
      regions.push(data.regionId);
      await db.species.update({
        where: { id: species.id },
        data: { regions: JSON.stringify(regions) },
      });
    }

    return NextResponse.json(observation, { status: 201 });
  } catch (error) {
    console.error("POST /api/observations", error);
    return NextResponse.json({ error: "تعذر حفظ المشاهدة" }, { status: 500 });
  }
}
