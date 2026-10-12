"use client";

import { useMemo } from "react";
import {
  Trees,
  Microscope,
  MapPinned,
  Sparkles,
  TriangleAlert,
  ShieldCheck,
  ArrowLeft,
  Eye,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { AppData, Species } from "@/lib/types";
import { ZONE_STYLE, CONSERVATION, CONSERVATION_ORDER, parseRegions, formatDate } from "@/lib/constants";
import type { TabKey } from "@/components/app-shell";
import { HERO_IMAGE } from "@/lib/hero";

type Props = {
  data: AppData;
  onOpenSpecies: (id: string) => void;
  onGoZone: (zone: string) => void;
  onGoTab: (tab: TabKey) => void;
  onGoGov: (govId: string) => void;
};

function KpiCard({
  icon: Icon,
  value,
  label,
  sub,
  tint,
  onClick,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  sub: string;
  tint: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group text-right rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
    >
      <span
        className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
        style={{ backgroundColor: tint }}
      >
        <Icon className="h-5.5 w-5.5" style={{ color: "#ffffff" }} />
      </span>
      <div className="font-head text-3xl font-extrabold text-foreground" dir="ltr">
        {value}
      </div>
      <div className="mt-1 text-sm font-bold text-foreground">{label}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </button>
  );
}

function SpeciesAvatar({ s, size = 40 }: { s: Species; size?: number }) {
  return s.image ? (
     
    <img
      src={s.image}
      alt={s.arabicName}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className="flex items-center justify-center rounded-full bg-secondary"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {s.emoji}
    </span>
  );
}

export function DashboardSection({ data, onOpenSpecies, onGoZone, onGoTab, onGoGov }: Props) {
  const { species, governorates, protectedAreas, observations } = data;

  const stats = useMemo(() => {
    const families = new Set(species.map((s) => s.familyLatin));
    const endemic = species.filter((s) => s.endemic).length;
    const threatened = species.filter((s) => ["VU", "EN", "CR"].includes(s.conservation));
    const zoneCounts: Record<string, Species[]> = {};
    for (const s of species) {
      (zoneCounts[s.zone] ||= []).push(s);
    }
    const conservationCounts = CONSERVATION_ORDER.map((code) => ({
      code,
      name: CONSERVATION[code].ar,
      value: species.filter((s) => s.conservation === code).length,
      color: CONSERVATION[code].color,
    }));
    const totalHa = protectedAreas.reduce((a, x) => a + x.areaHa, 0);
    const threatenedRegions = new Set(
      threatened.flatMap((s) => parseRegions(s))
    ).size;
    return { families, endemic, threatened, zoneCounts, conservationCounts, totalHa, threatenedRegions };
  }, [species, protectedAreas]);

  const zoneChart = Object.entries(stats.zoneCounts).map(([zone, list]) => ({
    zone,
    count: list.length,
    fill: ZONE_STYLE[zone]?.color ?? "#1d5c38",
  }));

  const threatened = [...stats.threatened].sort(
    (a, b) => CONSERVATION[b.conservation].level - CONSERVATION[a.conservation].level
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* ─── Bandeau principal ──────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#123f26] via-[#1d5c38] to-[#3d7a4d] text-white shadow-xl">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #ffffff 1.5px, transparent 1.5px), radial-gradient(circle at 70% 70%, #ffffff 1.5px, transparent 1.5px)",
            backgroundSize: "44px 44px, 56px 56px",
          }}
        />
        <div className="relative grid items-center gap-6 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              الأطلس التفاعلي للنباتات التونسية
            </span>
            <h1 className="mt-4 font-head text-3xl sm:text-4xl lg:text-[2.6rem] font-black leading-[1.25]">
              جرد النباتات في تونس
              <br />
              <span className="text-[#ffd9a8]">ورسم خرائط توزيعها والمحافظة عليها</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-[15px] leading-relaxed text-white/85">
              منصة وطنية تفاعلية تجمع الأنواع النباتية المميزة لتونس — من غابات
              كروميرية الرطبة إلى واحات الجريد — وتتيح استكشاف توزيعها الجغرافي
              على خريطة الولايات، متابعة حالتها الحفظية، والإسهام في رصدها عبر
              المشاهدات الميدانية.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => onGoTab("species")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#1d5c38] shadow-md transition-transform hover:scale-[1.03] cursor-pointer"
              >
                <Trees className="h-4 w-4" />
                استكشف الجرد
              </button>
              <button
                onClick={() => onGoTab("map")}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/25 cursor-pointer"
              >
                <MapPinned className="h-4 w-4" />
                خريطة التوزيع
              </button>
              <button
                onClick={() => onGoTab("observations")}
                className="inline-flex items-center gap-2 rounded-full bg-[#c2703d] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.03] cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                سجّل مشاهدة
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            {HERO_IMAGE ? (
              <div className="relative">
                { }
                <img
                  src={HERO_IMAGE}
                  alt="مشهد طبيعي من تونس"
                  className="h-72 w-full rounded-2xl object-cover shadow-2xl ring-4 ring-white/25"
                />
                <div className="absolute -bottom-4 -right-4 rounded-2xl bg-white/95 px-4 py-3 text-[#1d5c38] shadow-lg backdrop-blur">
                  <div className="font-head text-2xl font-black" dir="ltr">
                    {species.length}
                  </div>
                  <div className="text-xs font-bold">نوعاً نباتياً مُجرداً</div>
                </div>
                <div className="absolute -top-4 -left-4 rounded-2xl bg-[#c2703d]/95 px-4 py-3 text-white shadow-lg">
                  <div className="font-head text-2xl font-black" dir="ltr">
                    {governorates.length}
                  </div>
                  <div className="text-xs font-bold">ولاية مغطاة</div>
                </div>
              </div>
            ) : (
              <div className="flex h-72 items-center justify-center rounded-2xl bg-white/10 text-6xl ring-4 ring-white/25 backdrop-blur">
                🌿🇹🇳
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Indicateurs clés ───────────────────── */}
      <section aria-label="مؤشرات عامة" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
        <KpiCard icon={Trees} value={species.length} label="أنواع مُجردة" sub="القائمة الوطنية المرجعية" tint="#1d5c38" onClick={() => onGoTab("species")} />
        <KpiCard icon={Microscope} value={stats.families.size} label="عائلة نباتية" sub="تصنيف علمي" tint="#6b8f3e" onClick={() => onGoTab("species")} />
        <KpiCard icon={MapPinned} value={governorates.length} label="ولاية" sub="تغطية جغرافية كاملة" tint="#0f766e" onClick={() => onGoTab("map")} />
        <KpiCard icon={Sparkles} value={stats.endemic} label="أنواع متوطنة" sub="لا توجد إلا هنا" tint="#a16207" onClick={() => onGoTab("species")} />
        <KpiCard icon={TriangleAlert} value={stats.threatened.length} label="أنواع مهددة" sub="قابلة للتأثر أو أكثر" tint="#c2703d" onClick={() => onGoTab("conservation")} />
        <KpiCard icon={ShieldCheck} value={protectedAreas.length} label="أراضٍ محمية" sub={`≈ ${Math.round(stats.totalHa / 1000)} ألف هكتار`} tint="#7c5a2e" onClick={() => onGoTab("conservation")} />
      </section>

      {/* ─── Graphiques ─────────────────────────── */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-1 font-head text-lg font-bold">الأنواع حسب النطاق البيئي</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            توزيع أنواع الجرد على النظم البيئية الخمسة الكبرى لتونس
          </p>
          <div className="chart-ltr h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneChart} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <XAxis
                  dataKey="zone"
                  tick={{ fontSize: 10.5, fill: "#6b7261", fontFamily: "Tajawal" }}
                  interval={0}
                  height={46}
                  angle={-22}
                  textAnchor="end"
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6b7261" }} width={26} />
                <Tooltip
                  contentStyle={{
                    direction: "rtl",
                    borderRadius: 12,
                    border: "1px solid #e2ddd0",
                    fontFamily: "Tajawal",
                  }}
                  formatter={(v) => [`${v} نوعاً`, "العدد"]}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={46}>
                  {zoneChart.map((d) => (
                    <Cell key={d.zone} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-1 font-head text-lg font-bold">حالة الحفظ الوطنية</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            تقدير وطني توضيحي وفق منهجية القائمة الحمراء UICN
          </p>
          <div className="chart-ltr h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.conservationCounts.filter((d) => d.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={3}
                  cornerRadius={6}
                >
                  {stats.conservationCounts
                    .filter((d) => d.value > 0)
                    .map((d) => (
                      <Cell key={d.code} fill={d.color} />
                    ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    direction: "rtl",
                    borderRadius: 12,
                    border: "1px solid #e2ddd0",
                    fontFamily: "Tajawal",
                  }}
                />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  wrapperStyle={{ fontFamily: "Tajawal", fontSize: 12.5, direction: "rtl", paddingRight: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ─── Zones écologiques ──────────────────── */}
      <section aria-label="النطاقات البيئية">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-head text-xl sm:text-2xl font-extrabold">النظم البيئية الخمسة</h2>
            <p className="text-sm text-muted-foreground">
              من الغابات الرطبة في الشمال إلى العوالق الصحراوية في الجنوب
            </p>
          </div>
          <button
            onClick={() => onGoZone("الكل")}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline cursor-pointer"
          >
            كل الأنواع <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(stats.zoneCounts).map(([zone, list]) => {
            const st = ZONE_STYLE[zone] ?? { color: "#1d5c38", bg: "#e9efe4", icon: "🌿" };
            return (
              <button
                key={zone}
                onClick={() => onGoZone(zone)}
                className="rounded-2xl border border-border p-4 text-right shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                style={{ backgroundColor: st.bg }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xl">{st.icon}</span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-black text-white"
                    style={{ backgroundColor: st.color }}
                    dir="ltr"
                  >
                    {list.length}
                  </span>
                </div>
                <div className="font-head text-[15px] font-bold" style={{ color: st.color }}>
                  {zone}
                </div>
                <div className="mt-2 flex items-center">
                  {list.slice(0, 5).map((s) => (
                    <span key={s.id} className="-ml-2 first:ml-0 rounded-full ring-2 ring-white">
                      <SpeciesAvatar s={s} size={28} />
                    </span>
                  ))}
                  {list.length > 5 && (
                    <span className="-ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-black text-muted-foreground ring-2 ring-white" dir="ltr">
                      +{list.length - 5}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Espèces menacées ───────────────────── */}
      <section aria-label="أنواع مهددة">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-head text-xl sm:text-2xl font-extrabold">أنواع تستدعي الحماية</h2>
            <p className="text-sm text-muted-foreground">
              {threatened.length} نوعاً مصنفاً قابلاً للتأثر أو في وضع أخطر — موزعة على{" "}
              {stats.threatenedRegions} ولاية
            </p>
          </div>
          <button
            onClick={() => onGoTab("conservation")}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-[#c2703d] hover:underline cursor-pointer"
          >
            برامج المحافظة <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {threatened.map((s) => {
            const c = CONSERVATION[s.conservation];
            return (
              <button
                key={s.id}
                onClick={() => onOpenSpecies(s.id)}
                className="w-60 shrink-0 overflow-hidden rounded-2xl border border-border bg-card text-right shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
              >
                <div className="relative h-28">
                  {s.image ? (
                     
                    <img src={s.image} alt={s.arabicName} className="h-full w-full object-cover" />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-4xl"
                      style={{ backgroundColor: c.color + "18" }}
                    >
                      {s.emoji}
                    </div>
                  )}
                  <span
                    className="absolute top-2 left-2 rounded-full px-2.5 py-1 text-[10px] font-black text-white shadow"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.ar}
                  </span>
                  {s.endemic && (
                    <span className="absolute top-2 right-2 rounded-full bg-[#a16207] px-2.5 py-1 text-[10px] font-black text-white shadow">
                      متوطّن
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="font-head text-sm font-bold">{s.arabicName}</div>
                  <div className="text-xs italic text-muted-foreground" dir="ltr">
                    {s.scientificName}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Dernières observations ─────────────── */}
      <section aria-label="آخر المشاهدات" className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-head text-lg font-bold">آخر المشاهدات الميدانية</h3>
            <button
              onClick={() => onGoTab("observations")}
              className="text-sm font-bold text-primary hover:underline cursor-pointer"
            >
              سجّل مشاهدة
            </button>
          </div>
          <ul className="space-y-3">
            {observations.slice(0, 4).map((o) => (
              <li
                key={o.id}
                className="flex items-start gap-3 rounded-xl bg-secondary/60 p-3 transition-colors hover:bg-secondary cursor-pointer"
                onClick={() => o.species && onOpenSpecies(o.species.id)}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-xl shadow-sm">
                  {o.species?.emoji ?? "🌿"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 text-sm font-bold">
                    <span>{o.species?.arabicName ?? "نوع"}</span>
                    <span className="text-[11px] font-normal text-muted-foreground">
                      {governorates.find((g) => g.id === o.regionId)?.nameAr} · {formatDate(o.date)}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{o.notes ?? "بدون ملاحظات"}</p>
                </div>
                <span className="shrink-0 rounded-full bg-card px-2 py-1 text-[10px] font-bold text-muted-foreground shadow-sm">
                  {o.observer}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-1 font-head text-lg font-bold">كيف تعمل المنصة؟</h3>
          <p className="mb-4 text-xs text-muted-foreground">ثلاث خطوات من الجرد إلى الحماية</p>
          <ol className="space-y-4">
            {[
              { n: "1", t: "نجمع ونوثّق", d: "إحصاء الأنواع النباتية المميزة وتصنيفها علمياً حسب العائلة والنطاق البيئي وحالة الحفظ.", icon: "🔬" },
              { n: "2", t: "نرسم الخريطة", d: "ربط كل نوع بولايات تواجده ورسم خرائط توزيع تفاعلية تُحدث تلقائياً مع كل مشاهدة جديدة.", icon: "🗺️" },
              { n: "3", t: "نحافظ معاً", d: "متابعة الأنواع المهددة، ربطها بالأراضي المحمية، وتشجيع الرصد المواطن لسدّ فجوات المعرفة.", icon: "🛡️" },
            ].map((step) => (
              <li key={step.n} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
                  {step.icon}
                </span>
                <div>
                  <div className="text-sm font-bold">
                    <span className="text-primary font-black">{step.n}. </span>
                    {step.t}
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{step.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
