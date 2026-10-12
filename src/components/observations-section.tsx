"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Binoculars,
  Send,
  MapPin,
  CalendarDays,
  User,
  StickyNote,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AppData } from "@/lib/types";
import { CONSERVATION, formatDate } from "@/lib/constants";

type Props = {
  data: AppData;
  onAdded: () => void;
};

export function ObservationsSection({ data, onAdded }: Props) {
  const { species, governorates, observations } = data;
  const [speciesId, setSpeciesId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [observer, setObserver] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [withCoords, setWithCoords] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!speciesId) return toast.error("اختر النوع النباتي أولاً");
    if (!regionId) return toast.error("اختر الولاية");
    if (observer.trim().length < 2) return toast.error("أدخل اسمك (حرفان على الأقل)");

    if (withCoords) {
      const la = parseFloat(lat);
      const lo = parseFloat(lng);
      if (isNaN(la) || isNaN(lo) || la < 30 || la > 38 || lo < 7 || lo > 13) {
        return toast.error("الإحداثيات غير صالحة: خط العرض 30–38 وخط الطول 7–13");
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/observations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          speciesId,
          regionId,
          observer,
          notes: notes || null,
          date,
          lat: withCoords && lat ? parseFloat(lat) : null,
          lng: withCoords && lng ? parseFloat(lng) : null,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? "تعذر الحفظ");
      }
      toast.success("🌿 تم تسجيل المشاهدة بنجاح — شكراً لإسهامك في الأطلس الوطني!");
      setNotes("");
      onAdded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="font-head text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
          <Binoculars className="h-7 w-7 text-primary" />
          المشاهدات الميدانية
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          الرصد المواطن هو عين المنصة: كل مشاهدة تُسجّل هنا تُحدّث خريطة التوزيع
          تلقائياً وتدعم متابعة الأنواع المهددة
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        {/* ─── Formulaire ─────────────────────────── */}
        <form
          onSubmit={submit}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <h2 className="mb-4 font-head text-lg font-bold">سجّل مشاهدة جديدة</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="obs-species" className="mb-1.5 flex items-center gap-1.5">
                <Binoculars className="h-3.5 w-3.5 text-primary" /> النوع النباتي *
              </Label>
              <Select value={speciesId} onValueChange={setSpeciesId}>
                <SelectTrigger id="obs-species" aria-label="اختر النوع">
                  <SelectValue placeholder="اختر النوع الذي لاحظته…" />
                </SelectTrigger>
                <SelectContent>
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

            <div>
              <Label htmlFor="obs-region" className="mb-1.5 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" /> الولاية *
              </Label>
              <Select value={regionId} onValueChange={setRegionId}>
                <SelectTrigger id="obs-region" aria-label="اختر الولاية">
                  <SelectValue placeholder="أين لاحظت النبات؟" />
                </SelectTrigger>
                <SelectContent>
                  {governorates.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.nameAr} <span className="text-muted-foreground">({g.nameFr})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="obs-date" className="mb-1.5 flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-primary" /> تاريخ المشاهدة
                </Label>
                <Input
                  id="obs-date"
                  type="date"
                  value={date}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="obs-name" className="mb-1.5 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" /> اسم المراقب *
                </Label>
                <Input
                  id="obs-name"
                  value={observer}
                  onChange={(e) => setObserver(e.target.value)}
                  placeholder="مثال: أمين بن صالح"
                  maxLength={80}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="obs-notes" className="mb-1.5 flex items-center gap-1.5">
                <StickyNote className="h-3.5 w-3.5 text-primary" /> ملاحظات
              </Label>
              <Textarea
                id="obs-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="وصف الموقع، عدد الأفراد، حالة الإزهار، تهديدات لاحظتها…"
                rows={3}
                maxLength={500}
              />
            </div>

            <div className="rounded-xl bg-secondary/60 p-3.5">
              <div className="flex items-center gap-2">
                <Switch id="coords" checked={withCoords} onCheckedChange={setWithCoords} aria-label="إضافة إحداثيات" />
                <Label htmlFor="coords" className="flex cursor-pointer items-center gap-1.5 text-sm font-medium">
                  <Compass className="h-3.5 w-3.5 text-[#c2703d]" />
                  لديّ إحداثيات GPS دقيقة (اختياري)
                </Label>
              </div>
              {withCoords && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="obs-lat" className="mb-1 text-xs">خط العرض (30–38)</Label>
                    <Input
                      id="obs-lat"
                      dir="ltr"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      placeholder="36.80"
                      inputMode="decimal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="obs-lng" className="mb-1 text-xs">خط الطول (7–13)</Label>
                    <Input
                      id="obs-lng"
                      dir="ltr"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      placeholder="10.18"
                      inputMode="decimal"
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary py-2.5 text-sm font-bold hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
              {submitting ? "جارٍ الحفظ…" : "تسجيل المشاهدة"}
            </Button>
          </div>
        </form>

        {/* ─── Liste des observations ─────────────── */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-head text-lg font-bold">
              سجل المشاهدات
              <span className="mr-2 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-black text-secondary-foreground" dir="ltr">
                {observations.length}
              </span>
            </h2>
            <span className="text-[11px] text-muted-foreground">الأحدث أولاً</span>
          </div>

          {observations.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 text-center">
              <span className="text-4xl">🔭</span>
              <p className="mt-2 text-sm font-bold">السجل فارغ</p>
              <p className="text-xs text-muted-foreground">كن أول من يسجل مشاهدة ميدانية!</p>
            </div>
          ) : (
            <ScrollArea className="h-[560px] pr-2">
              <ul className="space-y-3">
                {observations.map((o) => {
                  const gov = governorates.find((g) => g.id === o.regionId);
                  const c = o.species ? CONSERVATION[o.species.conservation] : null;
                  return (
                    <li
                      key={o.id}
                      className="fade-up rounded-xl border border-border/60 bg-background p-3.5 transition-colors hover:bg-secondary/50"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl">
                          {o.species?.emoji ?? "🌿"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold">
                              {o.species?.arabicName ?? "نوع محذوف"}
                            </span>
                            {c && (
                              <span
                                className="rounded-full px-2 py-0.5 text-[9.5px] font-black text-white"
                                style={{ backgroundColor: c.color }}
                              >
                                {c.ar}
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {gov?.nameAr ?? o.regionId}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              {formatDate(o.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {o.observer}
                            </span>
                            {o.lat != null && o.lng != null && (
                              <span className="flex items-center gap-1 font-mono" dir="ltr">
                                <Compass className="h-3 w-3" />
                                {o.lat.toFixed(2)}, {o.lng.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {o.notes && (
                            <p className="mt-1.5 rounded-lg bg-card p-2 text-xs leading-relaxed text-foreground/80">
                              {o.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
