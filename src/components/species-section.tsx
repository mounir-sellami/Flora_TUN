"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  MapPin,
  Sparkles,
  Trees,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { AppData, Species } from "@/lib/types";
import { ZONE_STYLE, CONSERVATION, CONSERVATION_ORDER, parseRegions } from "@/lib/constants";

type Props = {
  data: AppData;
  zoneFilter: string;
  setZoneFilter: (z: string) => void;
  onOpenSpecies: (id: string) => void;
};

export function SpeciesSection({ data, zoneFilter, setZoneFilter, onOpenSpecies }: Props) {
  const { species, governorates } = data;
  const [search, setSearch] = useState("");
  const [family, setFamily] = useState("الكل");
  const [conservation, setConservation] = useState("الكل");
  const [endemicOnly, setEndemicOnly] = useState(false);

  const families = useMemo(
    () => Array.from(new Set(species.map((s) => s.familyAr))).sort(),
    [species]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return species.filter((s) => {
      if (zoneFilter !== "الكل" && s.zone !== zoneFilter) return false;
      if (family !== "الكل" && s.familyAr !== family) return false;
      if (conservation !== "الكل" && s.conservation !== conservation) return false;
      if (endemicOnly && !s.endemic) return false;
      if (q) {
        const hay = `${s.arabicName} ${s.scientificName} ${s.frenchName} ${s.familyAr} ${s.familyLatin}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [species, search, family, conservation, endemicOnly, zoneFilter]);

  const resetFilters = () => {
    setSearch("");
    setFamily("الكل");
    setConservation("الكل");
    setEndemicOnly(false);
    setZoneFilter("الكل");
  };

  const hasFilters =
    search || family !== "الكل" || conservation !== "الكل" || endemicOnly || zoneFilter !== "الكل";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
      {/* ─── Titre ──────────────────────────────── */}
      <div className="mb-6">
        <h1 className="font-head text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
          <Trees className="h-7 w-7 text-primary" />
          جرد النباتات
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} من أصل {species.length} نوعاً موثقاً — اضغط على أي بطاقة لعرض
          بطاقتها العلمية الكاملة
        </p>
      </div>

      {/* ─── Filtres ────────────────────────────── */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-sm font-bold text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" /> تصفية النتائج
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم العربي أو العلمي…"
              className="pr-9 bg-background"
              aria-label="بحث في الأنواع"
            />
          </div>
          <Select value={family} onValueChange={setFamily}>
            <SelectTrigger aria-label="العائلة النباتية">
              <SelectValue placeholder="العائلة النباتية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="الكل">كل العائلات</SelectItem>
              {families.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={conservation} onValueChange={setConservation}>
            <SelectTrigger aria-label="حالة الحفظ">
              <SelectValue placeholder="حالة الحفظ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="الكل">كل الحالات</SelectItem>
              {CONSERVATION_ORDER.map((c) => (
                <SelectItem key={c} value={c}>
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CONSERVATION[c].color }} />
                    {CONSERVATION[c].ar} ({c})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-3 rounded-md border border-input bg-background px-3 py-2">
            <Switch
              id="endemic"
              checked={endemicOnly}
              onCheckedChange={setEndemicOnly}
              aria-label="الأنواع المتوطنة فقط"
            />
            <label htmlFor="endemic" className="flex cursor-pointer items-center gap-1.5 text-sm font-medium">
              <Sparkles className="h-3.5 w-3.5 text-[#a16207]" />
              المتوطنة فقط
            </label>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">النطاق البيئي:</span>
          {["الكل", ...Object.keys(ZONE_STYLE)].map((z) => (
            <button
              key={z}
              onClick={() => setZoneFilter(z)}
              className={
                "rounded-full px-3 py-1 text-xs font-bold transition-colors cursor-pointer " +
                (zoneFilter === z
                  ? "text-white shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-accent")
              }
              style={zoneFilter === z ? { backgroundColor: ZONE_STYLE[z]?.color ?? "#1d5c38" } : undefined}
            >
              {z === "الكل" ? "الكل" : `${ZONE_STYLE[z].icon} ${z}`}
            </button>
          ))}
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="mr-auto inline-flex items-center gap-1 text-xs font-bold text-[#c2703d] hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> إعادة ضبط
            </button>
          )}
        </div>
      </div>

      {/* ─── Grille des espèces ─────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
          <span className="text-5xl">🥀</span>
          <p className="mt-3 font-head text-lg font-bold">لا توجد نتائج مطابقة</p>
          <p className="text-sm text-muted-foreground">جرّب تعديل معايير البحث أو إعادة الضبط</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((s) => (
            <SpeciesCard key={s.id} s={s} governorates={governorates} onOpen={onOpenSpecies} />
          ))}
        </div>
      )}
    </div>
  );
}

function SpeciesCard({
  s,
  governorates,
  onOpen,
}: {
  s: Species;
  governorates: AppData["governorates"];
  onOpen: (id: string) => void;
}) {
  const c = CONSERVATION[s.conservation];
  const regions = parseRegions(s);
  const st = ZONE_STYLE[s.zone];

  return (
    <button
      onClick={() => onOpen(s.id)}
      className="group overflow-hidden rounded-2xl border border-border bg-card text-right shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`عرض بطاقة ${s.arabicName}`}
    >
      <div className="relative h-40 overflow-hidden">
        {s.image ? (
           
          <img
            src={s.image}
            alt={s.arabicName}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-5xl transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundColor: c.color + "14" }}
          >
            {s.emoji}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/45 to-transparent" />
        <span
          className="absolute top-2 left-2 rounded-full px-2.5 py-1 text-[10px] font-black text-white shadow"
          style={{ backgroundColor: c.color }}
        >
          {c.ar}
        </span>
        {s.endemic && (
          <span className="absolute top-2 right-2 rounded-full bg-[#a16207] px-2.5 py-1 text-[10px] font-black text-white shadow">
            متوطّن ★
          </span>
        )}
        <span className="absolute bottom-2 right-2 text-white drop-shadow">
          <span className="mr-1 font-head text-base font-extrabold">{s.arabicName}</span>
          <span className="block text-[11px] italic opacity-90" dir="ltr">
            {s.scientificName}
          </span>
        </span>
      </div>
      <div className="p-3.5">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="font-bold">{s.familyAr}</span>
          <span dir="ltr">({s.familyLatin})</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {st && (
            <Badge variant="secondary" className="gap-1 text-[10px]">
              {st.icon} {s.zone}
            </Badge>
          )}
          <Badge variant="outline" className="gap-1 text-[10px]">
            <MapPin className="h-3 w-3" />
            {regions.length > 0
              ? `${regions.length} ولاية`
              : governorates.length > 0
                ? "الوطن كله"
                : "—"}
          </Badge>
        </div>
      </div>
    </button>
  );
}
