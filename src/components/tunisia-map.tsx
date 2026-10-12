"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  Popup,
  Tooltip as LeafletTooltip,
  useMap,
} from "react-leaflet";
import type { AppData, Species, Governorate } from "@/lib/types";
import { ZONE_STYLE, CONSERVATION, parseRegions } from "@/lib/constants";

type Props = {
  data: AppData;
  selectedSpecies: Species | null;
  selectedGov: string | null;
  showProtectedAreas: boolean;
  onGovSelect: (id: string | null) => void;
};

const TUNISIA_CENTER: [number, number] = [34.4, 9.55];

function makePaIcon(area: { type: string; nameAr: string }) {
  const isUnesco = area.type.includes("اليونسكو");
  return L.divIcon({
    className: "pa-pin",
    html: `<div class="pa-pin-inner" style="background:${isUnesco ? "#9a3412" : "#c2703d"}"><span>🛡️</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 30],
    popupAnchor: [0, -28],
  });
}

/** Vole vers la gouvernorat ciblé à chaque changement de focusGov */
function FlyToGov({ gov }: { gov: Governorate | null }) {
  const map = useMap();
  useEffect(() => {
    if (gov) {
      map.flyTo([gov.lat, gov.lng], 8.5, { duration: 0.9 });
    }
  }, [gov, map]);
  return null;
}

/** Garantit que Leaflet recalcule sa taille et redessine ses tuiles après montage */
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    (window as unknown as { __tunisiaMap?: L.Map }).__tunisiaMap = map;
    const run = () => {
      map.invalidateSize({ animate: false });
      // Reconstruit la grille de tuiles si elle a été corrompue par un init de taille incorrecte
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          layer.redraw();
        }
      });
    };
    const timers = [120, 450, 1000, 2000].map((ms) => setTimeout(run, ms));
    const onResize = () => run();
    window.addEventListener("resize", onResize);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", onResize);
    };
  }, [map]);
  return null;
}

export default function TunisiaMap({
  data,
  selectedSpecies,
  selectedGov,
  showProtectedAreas,
  onGovSelect,
}: Props) {
  const { species, governorates, protectedAreas } = data;

  const speciesByGov = useMemo(() => {
    const map: Record<string, Species[]> = {};
    for (const s of species) {
      for (const r of parseRegions(s)) {
        (map[r] ||= []).push(s);
      }
    }
    return map;
  }, [species]);

  const focusGov = governorates.find((g) => g.id === selectedGov) ?? null;
  const maxCount = Math.max(1, ...Object.values(speciesByGov).map((a) => a.length));

  const selectedRegions = selectedSpecies ? parseRegions(selectedSpecies) : null;

  return (
    <MapContainer
      center={TUNISIA_CENTER}
      zoom={7}
      minZoom={6}
      maxZoom={11}
      scrollWheelZoom
      className="h-full w-full"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToGov gov={focusGov} />
      <MapResizer />

      {/* ─── Cercles des gouvernorats ─────────── */}
      {governorates.map((g) => {
        const list = speciesByGov[g.id] ?? [];
        const isFocus = selectedGov === g.id;
        const isRegionOfSpecies = selectedRegions?.includes(g.id) ?? false;
        const dimmed =
          (selectedRegions !== null && !isRegionOfSpecies) ||
          (selectedGov !== null && !isFocus);
        const r = isFocus ? 30 : isRegionOfSpecies ? 26 : 9 + (list.length / maxCount) * 13;
        const color =
          selectedSpecies && isRegionOfSpecies
            ? CONSERVATION[selectedSpecies.conservation]?.color ?? "#c2703d"
            : ZONE_STYLE[g.zone]?.color ?? "#1d5c38";
        return (
          <CircleMarker
            key={g.id}
            center={[g.lat, g.lng]}
            radius={r}
            pathOptions={{
              color: "#ffffff",
              weight: isFocus ? 3.5 : 2,
              fillColor: color,
              fillOpacity: dimmed ? 0.25 : 0.78,
            }}
            eventHandlers={{
              click: () => onGovSelect(isFocus ? null : g.id),
            }}
          >
            <LeafletTooltip direction="top" opacity={1}>
              <span style={{ fontFamily: "Tajawal", fontSize: 12 }}>
                <b>{g.nameAr}</b> — {list.length} نوعاً موثقاً
              </span>
            </LeafletTooltip>
            <Popup>
              <div style={{ fontFamily: "Tajawal" }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#1d5c38" }}>
                  ولاية {g.nameAr} <span style={{ opacity: 0.6 }}>({g.nameFr})</span>
                </div>
                <div style={{ fontSize: 11.5, color: "#6b7261", margin: "2px 0 6px" }}>
                  {list.length > 0
                    ? `${list.length} نوعاً موثقاً في هذا الجرد`
                    : "لا توجد أنواع موثقة بعد — سجل أول مشاهدة!"}
                </div>
                {list.slice(0, 6).map((s) => (
                  <div key={s.id} style={{ fontSize: 12, margin: "1px 0" }}>
                    {s.emoji} {s.arabicName}
                    <span style={{ opacity: 0.55, fontStyle: "italic", fontSize: 10.5 }}>
                      {" "}
                      — {s.scientificName}
                    </span>
                  </div>
                ))}
                {list.length > 6 && (
                  <div style={{ fontSize: 11, color: "#c2703d", fontWeight: 700 }}>
                    + {list.length - 6} أنواع أخرى…
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {/* ─── Aires protégées ──────────────────── */}
      {showProtectedAreas &&
        protectedAreas.map((a) => (
          <Marker
            key={a.id}
            position={[a.lat, a.lng]}
            icon={makePaIcon(a)}
            zIndexOffset={400}
          >
            <Popup>
              <div style={{ fontFamily: "Tajawal", maxWidth: 230 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#9a3412" }}>
                  🛡️ {a.nameAr}
                </div>
                <div style={{ fontSize: 11, color: "#6b7261", margin: "2px 0" }}>
                  {a.type} · ولاية {a.governorate} · {a.areaHa.toLocaleString("fr-TN")} هكتار
                </div>
                <div style={{ fontSize: 11.5, lineHeight: 1.6 }}>{a.description}</div>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
