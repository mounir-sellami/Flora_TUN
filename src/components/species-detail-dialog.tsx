"use client";

import {
  MapPin,
  CalendarDays,
  Wrench,
  Mountain,
  Microscope,
  Navigation,
  ClipboardList,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Species, Governorate, Observation } from "@/lib/types";
import { ZONE_STYLE, CONSERVATION, parseRegions, formatDate } from "@/lib/constants";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  species: Species | null;
  governorates: Governorate[];
  observations: Observation[];
  onGoGov: (govId: string) => void;
};

export function SpeciesDetailDialog({
  open,
  onOpenChange,
  species,
  governorates,
  observations,
  onGoGov,
}: Props) {
  if (!species) return null;

  const c = CONSERVATION[species.conservation];
  const st = ZONE_STYLE[species.zone];
  const regions = parseRegions(species);
  const regionNames = regions
    .map((r) => governorates.find((g) => g.id === r))
    .filter(Boolean) as Governorate[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0 top-[4%] translate-y-0 rounded-2xl">
        <div className="max-h-[85vh] overflow-y-auto">
          {/* ─── Bandeau visuel ─────────────────── */}
          <div className="relative h-48 sm:h-56">
            {species.image ? (
               
              <img
                src={species.image}
                alt={species.arabicName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-7xl"
                style={{ backgroundColor: c.color + "1a" }}
              >
                {species.emoji}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-3 right-4 left-4 text-white">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-black shadow"
                  style={{ backgroundColor: c.color }}
                >
                  {c.icon} {c.ar} ({species.conservation})
                </span>
                {species.endemic && (
                  <span className="rounded-full bg-[#a16207] px-3 py-1 text-[11px] font-black shadow">
                    نوع متوطّن ★
                  </span>
                )}
                {st && (
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-black shadow"
                    style={{ backgroundColor: st.color }}
                  >
                    {st.icon} {species.zone}
                  </span>
                )}
              </div>
              <DialogHeader className="mt-2 text-right block space-y-0">
                <DialogTitle className="font-head text-2xl font-extrabold text-white drop-shadow">
                  {species.arabicName}
                </DialogTitle>
                <DialogDescription className="text-sm italic text-white/90" dir="ltr">
                  {species.scientificName} — {species.frenchName}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>

          {/* ─── Contenu ────────────────────────── */}
          <div className="space-y-5 p-5 sm:p-6">
            <p className="text-[15px] leading-loose text-foreground/90">
              {species.description}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard icon={Mountain} title="الموطن الطبيعي" text={species.habitat} />
              <InfoCard
                icon={Microscope}
                title="العائلة النباتية"
                text={`${species.familyAr} (${species.familyLatin}) · المناخ: ${species.bioclimate}`}
              />
              <InfoCard icon={Wrench} title="الاستعمالات" text={species.uses ?? "—"} />
              <InfoCard icon={CalendarDays} title="فترة الإزهار" text={species.flowering ?? "—"} />
            </div>

            {/* ─── Carte de répartition ──────────── */}
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-head text-base font-bold">
                <MapPin className="h-4 w-4 text-[#c2703d]" />
                خريطة التوزيع الجغرافي
              </h4>
              <p className="mb-3 text-xs text-muted-foreground">
                الولايات الموثقة لهذا النوع — اضغط على أي ولاية للانتقال إلى الخريطة
                التفاعلية
              </p>
              <div className="flex flex-wrap gap-2">
                {regionNames.length > 0 ? (
                  regionNames.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        onOpenChange(false);
                        onGoGov(g.id);
                      }}
                      className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-bold transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    >
                      {g.nameAr} <span className="opacity-60">({g.nameFr})</span>
                    </button>
                  ))
                ) : (
                  <Badge variant="outline">توزيع وطني واسع</Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* ─── Observations ───────────────────── */}
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-head text-base font-bold">
                <ClipboardList className="h-4 w-4 text-[#c2703d]" />
                المشاهدات الميدانية المرصودة
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-black text-secondary-foreground" dir="ltr">
                  {observations.length}
                </span>
              </h4>
              {observations.length === 0 ? (
                <p className="rounded-xl bg-secondary/60 p-4 text-center text-sm text-muted-foreground">
                  لا توجد مشاهدات مسجلة بعد لهذا النوع — يمكنك أن تكون أول المراقبين عبر
                  قسم «المشاهدات الميدانية» 🌿
                </p>
              ) : (
                <ScrollArea className="max-h-52 rounded-xl">
                  <ul className="space-y-2 pr-1">
                    {observations.map((o) => (
                      <li key={o.id} className="rounded-xl bg-secondary/60 p-3">
                        <div className="flex flex-wrap items-center gap-x-2 text-xs font-bold">
                          <span className="text-primary">{o.observer}</span>
                          <span className="text-muted-foreground">
                            {governorates.find((g) => g.id === o.regionId)?.nameAr} ·{" "}
                            {formatDate(o.date)}
                          </span>
                        </div>
                        {o.notes && (
                          <p className="mt-1 text-xs leading-relaxed text-foreground/80">
                            {o.notes}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#e6efdf] p-3 text-xs leading-relaxed text-[#2c452b]">
              <Navigation className="h-4 w-4 shrink-0" />
              حالة الحفظ تقدير وطني توضيحي وفق معايير القائمة الحمراء UICN — يُحدَّث مع
              كل مشاهدة ميدانية جديدة.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3.5">
      <div className="mb-1 flex items-center gap-2 text-xs font-black text-primary">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <p className="text-[13px] leading-relaxed text-foreground/85">{text}</p>
    </div>
  );
}
