"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Trees,
  Map,
  ShieldCheck,
  Binoculars,
  Leaf,
  MapPinned,
  Flower2,
} from "lucide-react";
import type { AppData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DashboardSection } from "@/components/dashboard-section";
import { SpeciesSection } from "@/components/species-section";
import { MapSection } from "@/components/map-section";
import { ConservationSection } from "@/components/conservation-section";
import { ObservationsSection } from "@/components/observations-section";
import { SpeciesDetailDialog } from "@/components/species-detail-dialog";

export type TabKey = "dashboard" | "species" | "map" | "conservation" | "observations";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "لوحة القيادة", icon: LayoutDashboard },
  { key: "species", label: "جرد النباتات", icon: Trees },
  { key: "map", label: "خريطة التوزيع", icon: Map },
  { key: "conservation", label: "المحافظة", icon: ShieldCheck },
  { key: "observations", label: "مشاهدات ميدانية", icon: Binoculars },
];

export function AppShell({ data }: { data: AppData }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [zoneFilter, setZoneFilter] = useState<string>("الكل");
  const [mapFocusGov, setMapFocusGov] = useState<string | null>(null);

  const openSpecies = (id: string) => {
    setSelectedSpeciesId(id);
    setDialogOpen(true);
  };

  const goToSpeciesZone = (zone: string) => {
    setZoneFilter(zone);
    setTab("species");
  };

  const goMapGov = (govId: string) => {
    setMapFocusGov(govId);
    setTab("map");
  };

  const refreshData = () => router.refresh();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── En-tête ─────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-3">
            <button
              onClick={() => setTab("dashboard")}
              className="flex items-center gap-3 shrink-0 cursor-pointer"
              aria-label="العودة إلى لوحة القيادة"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1d5c38] to-[#3d8b52] shadow-md shadow-primary/25">
                <Leaf className="h-5 w-5 text-white" />
              </span>
              <span className="text-right leading-tight">
                <span className="block font-head text-base sm:text-lg font-extrabold text-primary">
                  جرد النباتات في تونس
                </span>
                <span className="hidden sm:block text-[11px] text-muted-foreground">
                  الأطلس التفاعلي للتوزيع الجغرافي والمحافظة
                </span>
              </span>
            </button>

            <nav aria-label="التنقل الرئيسي" className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 sm:px-4 py-2 text-[13px] sm:text-sm font-medium transition-all cursor-pointer",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{t.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* ─── Contenu ─────────────────────────────── */}
      <main className="flex-1">
        {tab === "dashboard" && (
          <DashboardSection
            data={data}
            onOpenSpecies={openSpecies}
            onGoZone={goToSpeciesZone}
            onGoTab={setTab}
            onGoGov={goMapGov}
          />
        )}
        {tab === "species" && (
          <SpeciesSection
            data={data}
            zoneFilter={zoneFilter}
            setZoneFilter={setZoneFilter}
            onOpenSpecies={openSpecies}
          />
        )}
        {tab === "map" && (
          <MapSection
            data={data}
            focusGov={mapFocusGov}
            onOpenSpecies={openSpecies}
            onGoTab={setTab}
          />
        )}
        {tab === "conservation" && (
          <ConservationSection data={data} onGoTab={setTab} onOpenSpecies={openSpecies} />
        )}
        {tab === "observations" && (
          <ObservationsSection data={data} onAdded={refreshData} />
        )}
      </main>

      {/* ─── Pied de page (collant) ──────────────── */}
      <footer className="mt-auto border-t border-border/70 bg-[#182b1b] text-[#cfe0cd]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3d8b52] to-[#1d5c38]">
                  <Leaf className="h-4 w-4 text-white" />
                </span>
                <span className="font-head font-bold text-white">جرد النباتات في تونس</span>
              </div>
              <p className="text-[13px] leading-relaxed text-[#a8bf9f]">
                منصة تفاعلية تهدف إلى توثيق الثروة النباتية التونسية، رسم خرائط توزيعها
                الجغرافي حسب الولايات والنطاقات البيئية، ومساندة جهود المحافظة عليها
                للأجيال القادمة.
              </p>
            </div>
            <div>
              <h4 className="font-head font-bold text-white mb-3 flex items-center gap-2">
                <Flower2 className="h-4 w-4" /> أقسام المنصة
              </h4>
              <ul className="space-y-2 text-[13px] text-[#a8bf9f]">
                {TABS.map((t) => (
                  <li key={t.key}>
                    <button
                      className="hover:text-white transition-colors cursor-pointer"
                      onClick={() => setTab(t.key)}
                    >
                      {t.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-head font-bold text-white mb-3 flex items-center gap-2">
                <MapPinned className="h-4 w-4" /> عن البيانات
              </h4>
              <p className="text-[13px] leading-relaxed text-[#a8bf9f]">
                تُعتمد التوزيعات الجغرافية على النطاقات البيئية المعروفة للأنواع
                والمشاهدات الميدانية المُسجّلة. حالات الحفظ تقديرات وطنية توضيحية
                مستوحاة من منهجية القائمة الحمراء للاتحاد الدولي لحفظ الطبيعة (UICN).
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-[#8aa57f]">
            🌿 مشروع تعليمي للتنوع البيولوجي النباتي في تونس — {new Date().getFullYear()}
          </div>
        </div>
      </footer>

      {/* ─── Fenêtre de détail d'espèce ──────────── */}
      <SpeciesDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        species={data.species.find((s) => s.id === selectedSpeciesId) ?? null}
        governorates={data.governorates}
        observations={data.observations.filter((o) => o.speciesId === selectedSpeciesId)}
        onGoGov={goMapGov}
      />
    </div>
  );
}
