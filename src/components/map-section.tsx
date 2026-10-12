"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  MapPinned,
  ShieldCheck,
  Info,
  Layers,
  MapPin,
  Loader2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AppData } from "@/lib/types";
import { ZONE_STYLE, CONSERVATION, parseRegions } from "@/lib/constants";
import type { TabKey } from "@/components/app-shell";

const TunisiaMap = dynamic(() => import("@/components/tunisia-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-secondary/50">
      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        جارٍ تحميل الخريطة…
      </div>
    </div>
  ),
});

type Props = {
  data: AppData;
  focusGov: string | null;
  onOpenSpecies: (id: string) => void;
  onGoTab: (tab: TabKey) => void;
};

export function MapSection({ data, focusGov, onOpenSpecies, onGoTab }: Props) {
  const { species, governorates, protectedAreas } = data;
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>("all");
  const [selectedGov, setSelectedGov] = useState<string | null>(focusGov);
  const [showPAs, setShowPAs] = useState(true);

  const selectedSpecies = species.find((s) => s.id === selectedSpeciesId) ?? null;

  const speciesByGov = useMemo(() => {
    const map: Record<string, typeof species> = {};
    for (const s of species) {
      for (const r of parseRegions(s)) {
        (map[r] ||= []).push(s);
      }
    }
    return map;
  }, [species]);

  const topGovs = useMemo(
    () =>
      [...governorates]
        .map((g) => ({ g, count: (speciesByGov[g.id] ?? []).length }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6),
    [governorates, speciesByGov]
  );

  const activeGov = governorates.find((g) => g.id === selectedGov) ?? null;
  const activeGovSpecies = selectedGov ? speciesByGov[selectedGov] ?? [] : [];
  const activeGovAreas = selectedGov
    ? protectedAreas.filter((a) => a.governorate === activeGov?.nameAr)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-5">
        <h1 className="font-head text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
          <MapPinned className="h-7 w-7 text-primary" />
          خريطة التوزيع الجغرافي
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          حجم الدائرة يعكس عدد الأنواع الموثقة في كل ولاية — اضغط على ولاية لاستكشاف
          نباتاتها، أو اختر نوعاً لعرض توزيعه الخاص
        </p>
      </div>

      {/* ─── Barre de contrôle ──────────────────── */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm">
        <div className="flex min-w-56 flex-1 items-center gap-2">
          <Layers className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Select
            value={selectedSpeciesId}
            onValueChange={(v) => {
              setSelectedSpeciesId(v);
              setSelectedGov(null);
            }}
          >
            <SelectTrigger aria-label="تصفية حسب النوع">
              <SelectValue placeholder="عرض توزيع نوع محدد" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأنواع (نظرة عامة)</SelectItem>
              {species.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.emoji} {s.arabicName}
                  <span className="text-muted-foreground" dir="ltr">
                    {" "}
                    — {s.scientificName}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary px-3.5 py-2">
          <ShieldCheck className="h-4 w-4 text-[#c2703d]" />
          <Switch id="pa-toggle" checked={showPAs} onCheckedChange={setShowPAs} aria-label="عرض الأراضي المحمية" />
          <label htmlFor="pa-toggle" className="cursor-pointer text-xs font-bold">
            الأراضي المحمية ({protectedAreas.length})
          </label>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        {/* ─── Carte ─────────────────────────────── */}
        <div
          className="overflow-hidden rounded-2xl border border-border shadow-sm"
          style={{ height: "clamp(420px, 62vh, 560px)" }}
        >
          <TunisiaMap
            data={data}
            selectedSpecies={selectedSpecies}
            selectedGov={selectedGov}
            showProtectedAreas={showPAs}
            onGovSelect={setSelectedGov}
          />
        </div>

        {/* ─── Panneau latéral ───────────────────── */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          {selectedSpecies ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-head text-base font-bold">
                  {selectedSpecies.emoji} توزيع: {selectedSpecies.arabicName}
                </h3>
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-black text-white"
                  style={{ backgroundColor: CONSERVATION[selectedSpecies.conservation].color }}
                >
                  {CONSERVATION[selectedSpecies.conservation].ar}
                </span>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                الولايات المضيئة على الخريطة تمثل مناطق تواجد هذا النوع حسب الجرد
                والمشاهدات المسجلة.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {parseRegions(selectedSpecies).map((r) => {
                  const g = governorates.find((x) => x.id === r);
                  return g ? (
                    <button
                      key={r}
                      onClick={() => setSelectedGov(r)}
                      className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    >
                      {g.nameAr}
                    </button>
                  ) : null;
                })}
              </div>
              <button
                onClick={() => onOpenSpecies(selectedSpecies.id)}
                className="mt-4 w-full rounded-xl bg-primary py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
              >
                عرض البطاقة العلمية الكاملة
              </button>
            </>
          ) : activeGov ? (
            <>
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-head text-base font-bold text-primary">
                  📍 ولاية {activeGov.nameAr}
                </h3>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-black text-primary" dir="ltr">
                  {activeGovSpecies.length} نوعاً
                </span>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                {activeGov.nameFr} · {activeGov.zone}
              </p>
              {activeGovSpecies.length > 0 ? (
                <ul className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
                  {activeGovSpecies.map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => onOpenSpecies(s.id)}
                        className="flex w-full items-center gap-2.5 rounded-xl bg-secondary/60 p-2.5 text-right transition-colors hover:bg-secondary cursor-pointer"
                      >
                        <span className="text-xl">{s.emoji}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-bold">{s.arabicName}</span>
                          <span className="block text-[10.5px] italic text-muted-foreground" dir="ltr">
                            {s.scientificName}
                          </span>
                        </span>
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: CONSERVATION[s.conservation].color }}
                          title={CONSERVATION[s.conservation].ar}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-xl bg-secondary/60 p-4 text-center text-sm text-muted-foreground">
                  لا توجد أنواع موثقة بعد في هذه الولاية —{" "}
                  <button onClick={() => onGoTab("observations")} className="font-bold text-primary hover:underline cursor-pointer">
                    سجّل أول مشاهدة
                  </button>
                </div>
              )}
              {activeGovAreas.length > 0 && (
                <div className="mt-3 border-t border-border pt-3">
                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-black text-[#9a3412]">
                    <ShieldCheck className="h-3.5 w-3.5" /> أراضٍ محمية في هذه الولاية
                  </h4>
                  <ul className="space-y-1.5">
                    {activeGovAreas.map((a) => (
                      <li key={a.id} className="rounded-lg bg-[#fbe9d0]/60 p-2.5 text-[11.5px]">
                        <span className="font-bold">{a.nameAr}</span>
                        <span className="block text-muted-foreground">
                          {a.type} · {a.areaHa.toLocaleString("fr-TN")} هكتار
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-3 flex items-start gap-2 rounded-xl bg-[#e6efdf] p-3 text-xs leading-relaxed text-[#2c452b]">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                اضغط على أي دائرة في الخريطة لعرض نباتات الولاية، أو استعمل القائمة أعلاه
                لعزل توزيع نوع واحد.
              </div>
              <h3 className="mb-2 flex items-center gap-1.5 font-head text-sm font-bold">
                <MapPin className="h-4 w-4 text-[#c2703d]" /> الولايات الأغنى تنوعاً
              </h3>
              <ul className="space-y-1.5">
                {topGovs.map(({ g, count }) => (
                  <li key={g.id}>
                    <button
                      onClick={() => setSelectedGov(g.id)}
                      className="flex w-full items-center gap-2 rounded-xl bg-secondary/60 p-2.5 transition-colors hover:bg-secondary cursor-pointer"
                    >
                      <span className="flex-1 text-right text-[13px] font-bold">{g.nameAr}</span>
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-background">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(count / topGovs[0].count) * 100}%`,
                            backgroundColor: ZONE_STYLE[g.zone]?.color ?? "#1d5c38",
                          }}
                        />
                      </div>
                      <span className="w-6 text-center text-xs font-black text-muted-foreground" dir="ltr">
                        {count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* ─── Légende ─────────────────────────── */}
          <div className="mt-4 border-t border-border pt-3">
            <h4 className="mb-2 text-xs font-black text-muted-foreground">دليل الألوان</h4>
            <div className="grid grid-cols-1 gap-1.5">
              {Object.entries(ZONE_STYLE).map(([zone, st]) => (
                <div key={zone} className="flex items-center gap-2 text-[11px]">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: st.color }} />
                  {st.icon} {zone}
                </div>
              ))}
              <div className="flex items-center gap-2 text-[11px]">
                <span className="flex h-3.5 w-3.5 items-center justify-center text-[9px]">🛡️</span>
                حدائق ومحميات وطنية
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
