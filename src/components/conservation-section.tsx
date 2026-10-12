"use client";

import { useMemo } from "react";
import {
  ShieldCheck,
  Flame,
  Home,
  Tractor,
  Hand,
  CloudSun,
  Sprout,
  Users,
  Landmark,
  BookOpenCheck,
  Megaphone,
  MapPinned,
  ArrowLeft,
} from "lucide-react";
import type { AppData } from "@/lib/types";
import { CONSERVATION, CONSERVATION_ORDER } from "@/lib/constants";
import type { TabKey } from "@/components/app-shell";

type Props = {
  data: AppData;
  onGoTab: (tab: TabKey) => void;
  onOpenSpecies: (id: string) => void;
};

const THREATS = [
  {
    icon: Flame,
    title: "حرائق الغابات",
    text: "تفقد تونس سنوياً آلاف الهكتارات من الغابات، والحرائق المتكررة تمنع تجدد البلوط الفليني والصنوبر الحلبي وتفتح الباب أمام أنواع غازية.",
    color: "#c0392b",
  },
  {
    icon: Home,
    title: "الزحف العمراني والسياحي",
    text: "امتداد البناء والمنشآت السياحية يلتهم الموائل الطبيعية، خصوصاً الكثبان الساحلية موطن زنبق البحر والترب الخصبة موطن الأدغال.",
    color: "#c2703d",
  },
  {
    icon: Tractor,
    title: "الرعي الجائر",
    text: "الضغط الرعوي فوق الطاقة الاستيعابية للسهوب يمنع تجدد النباتات العلفية كالشيح والديّس ويؤدي إلى تدهور الغطاء النباتي والتصحر.",
    color: "#a16207",
  },
  {
    icon: Hand,
    title: "الجمع العشوائي",
    text: "جمع الأعشاب الطبية والعطرية (الشيح، الزعتر، الأزير) والنباتات الزينة (السيكلامن) دون تنظيم يستنزف العزبات البرية.",
    color: "#7c5a2e",
  },
  {
    icon: CloudSun,
    title: "التغير المناخي",
    text: "الجفاف المتكرر وارتفاع الحرارة يضغطان على الأنواع الهامشية كالبطم الأطلسي والسيّاح، ويغيّران توقيت الإزهار وخصوبة النباتات.",
    color: "#0f766e",
  },
];

const ACTIONS = [
  {
    icon: Sprout,
    title: "المشاتل المحلية وإعادة التوطين",
    text: "إكثار الأنواع المهددة من بذور محلية الأصل وإعادة توطينها في موائلها التاريخية، كما فُعل بنجاح مع السيّاح في بوحدمة.",
  },
  {
    icon: Users,
    title: "الرصد المواطن",
    text: "إشراك الطلبة والرعاة والجمعيات في تسجيل المشاهدات — كل مشاهدة على هذه المنصة تُغني خريطة التوزيع الوطنية.",
  },
  {
    icon: Landmark,
    title: "توسيع شبكة الأراضي المحمية",
    text: "دعم الحدائق الوطنية والمحميات وربطها بممرات بيئية تسمح بانتشار الأنواع وتأقلمها مع المناخ.",
  },
  {
    icon: BookOpenCheck,
    title: "الحماية القانونية والتنظيمية",
    text: "تطبيق أنظمة حماية الأنواع المتوطنة والمهددة، وتنظيم حصاد النباتات العطرية والطبية برخص و مواعيد محددة.",
  },
  {
    icon: Megaphone,
    title: "التوعية والتربية البيئية",
    text: "برامج مدرسية ومسارات بيئية في الحدائق الوطنية تنمّي ثقافة حماية النباتات وتُبرز قيمتها التراثية والاقتصادية.",
  },
  {
    icon: MapPinned,
    title: "الخريطة كأداة قرار",
    text: "استغلال خرائط التوزيع المحدّثة لتوجيه برامج التشجير، تحديد الفجوات الرصدية، ومراقبة تراجع العزبات المهددة.",
  },
];

export function ConservationSection({ data, onGoTab, onOpenSpecies }: Props) {
  const { species, protectedAreas } = data;

  const byConservation = useMemo(
    () =>
      CONSERVATION_ORDER.map((code) => ({
        code,
        ...CONSERVATION[code],
        list: species.filter((s) => s.conservation === code),
      })),
    [species]
  );

  const totalHa = protectedAreas.reduce((a, x) => a + x.areaHa, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-10">
      {/* ─── Introduction ───────────────────────── */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-l from-[#7c2d12] via-[#9a3412] to-[#b45309] p-6 sm:p-9 text-white shadow-lg">
        <h1 className="font-head text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
          <ShieldCheck className="h-7 w-7" />
          المحافظة على النباتات التونسية
        </h1>
        <p className="mt-3 max-w-3xl text-sm sm:text-[15px] leading-loose text-white/90">
          الثروة النباتية لتونس ليست مشهداً جميلاً فحسب، بل ركيزة اقتصادية وتراثية:
          منها يتغذى السيرباني والعسل، ومنها تُصنع الحرفة والطب، وبها تُثبّت التربة
          وتُحارب التعرية. حفظها مسؤولية جماعية تبدأ من المعرفة الدقيقة بتوزيعها
          وحالتها — وهذا ما تُتيحه هذه المنصة.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => onGoTab("observations")}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#9a3412] transition-transform hover:scale-[1.03] cursor-pointer"
          >
            🌱 ساهم في الرصد المواطن
          </button>
          <button
            onClick={() => onGoTab("map")}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-bold text-white backdrop-blur hover:bg-white/25 cursor-pointer"
          >
            <MapPinned className="h-4 w-4" /> استعرض الأراضي المحمية على الخريطة
          </button>
        </div>
      </section>

      {/* ─── Échelle UICN ───────────────────────── */}
      <section aria-label="مقياس حالة الحفظ">
        <h2 className="mb-1 font-head text-xl sm:text-2xl font-extrabold">حالات الحفظ في الجرد</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          توزيع الأنواع على مقياس القائمة الحمراء (تقدير وطني توضيحي)
        </p>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {byConservation.map((c) => (
            <div
              key={c.code}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              style={{ borderTopWidth: 4, borderTopColor: c.color }}
            >
              <div className="flex items-center justify-between">
                <span className="font-head text-2xl font-black" style={{ color: c.color }} dir="ltr">
                  {c.code}
                </span>
                <span className="rounded-full px-2 py-0.5 text-xs font-black text-white" style={{ backgroundColor: c.color }} dir="ltr">
                  {c.list.length}
                </span>
              </div>
              <div className="mt-1 text-sm font-bold">{c.ar}</div>
              <div className="text-[11px] text-muted-foreground" dir="ltr">{c.fr}</div>
              {c.list.length > 0 && c.level >= 3 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.list.slice(0, 3).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onOpenSpecies(s.id)}
                      className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold hover:bg-accent cursor-pointer"
                    >
                      {s.emoji} {s.arabicName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Menaces ────────────────────────────── */}
      <section aria-label="التهديدات">
        <h2 className="mb-1 font-head text-xl sm:text-2xl font-extrabold">التهديدات الرئيسية</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          خمسة عوامل كبرى تضغط على النباتات التونسية اليوم
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {THREATS.map((t) => (
            <div
              key={t.title}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span
                className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: t.color + "18" }}
              >
                <t.icon className="h-5 w-5" style={{ color: t.color }} />
              </span>
              <h3 className="mb-1.5 font-head text-[15px] font-bold">{t.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Aires protégées ────────────────────── */}
      <section aria-label="الأراضي المحمية">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-head text-xl sm:text-2xl font-extrabold">
              شبكة الأراضي المحمية ({protectedAreas.length})
            </h2>
            <p className="text-sm text-muted-foreground">
              ≈ {totalHa.toLocaleString("fr-TN")} هكتار من الحدائق الوطنية والمحميات
              حاضنة للتنوع النباتي
            </p>
          </div>
          <button
            onClick={() => onGoTab("map")}
            className="inline-flex items-center gap-1 text-sm font-bold text-[#c2703d] hover:underline cursor-pointer"
          >
            عرض على الخريطة <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {protectedAreas.map((a) => (
            <article
              key={a.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#fbe9d0] px-2.5 py-1 text-[10.5px] font-black text-[#9a3412]">
                  🛡️ {a.type}
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[10.5px] font-bold text-secondary-foreground">
                  ولاية {a.governorate}
                </span>
              </div>
              <h3 className="font-head text-base font-bold">{a.nameAr}</h3>
              <p className="text-[11px] italic text-muted-foreground" dir="ltr">{a.nameFr}</p>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-foreground/80">
                {a.description}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-[11px] font-bold text-muted-foreground">
                <span>المساحة</span>
                <span className="text-[#9a3412]" dir="ltr">
                  {a.areaHa.toLocaleString("fr-TN")} ha
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── Actions ────────────────────────────── */}
      <section aria-label="مسارات العمل">
        <h2 className="mb-1 font-head text-xl sm:text-2xl font-extrabold">مسارات العمل للحفظ</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          من الخريطة إلى الأرض: ست محاور عملية لحماية النباتات التونسية
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIONS.map((a, i) => (
            <div
              key={a.title}
              className="flex items-start gap-3.5 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <a.icon className="h-5.5 w-5.5 text-primary" />
              </span>
              <div>
                <h3 className="mb-1 font-head text-[15px] font-bold">
                  <span className="text-primary" dir="ltr">{i + 1}.</span> {a.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{a.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
