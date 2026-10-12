// ─── Constantes de design et métadonnées ──────────────────────────
import type { Species } from "./types";

export const ZONE_STYLE: Record<string, { color: string; bg: string; icon: string }> = {
  "الغابات الرطبة": { color: "#166534", bg: "#dcf0e0", icon: "🌲" },
  "الجبال والأدغال": { color: "#3f6212", bg: "#e7efcf", icon: "⛰️" },
  "السهوب والمراعي الجافة": { color: "#a16207", bg: "#f6ecd2", icon: "🌾" },
  "الواحات والصحراء": { color: "#b45309", bg: "#fbe9d0", icon: "🏜️" },
  "السواحل والأراضي الرطبة": { color: "#0f766e", bg: "#d7eeec", icon: "🌊" },
};

export const CONSERVATION: Record<
  string,
  { ar: string; color: string; level: number; icon: string }
> = {
  LC: { ar: "أقل اهتماماً", color: "#4d7c0f", level: 1, icon: "🟢" },
  NT: { ar: "قريب من الخطر", color: "#ca8a04", level: 2, icon: "🟡" },
  VU: { ar: "قابل للتأثر", color: "#ea580c", level: 3, icon: "🟠" },
  EN: { ar: "مهدد بالانقراض", color: "#dc2626", level: 4, icon: "🔴" },
  CR: { ar: "مهدد حديثاً بالانقراض", color: "#7f1d1d", level: 5, icon: "⚫" },
};

export const CONSERVATION_ORDER = ["LC", "NT", "VU", "EN", "CR"];

export function parseRegions(s: Species): string[] {
  try {
    const parsed = JSON.parse(s.regions);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function formatDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("ar-TN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
