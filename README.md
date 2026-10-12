# جرد النباتات في تونس — Inventaire Botanique de Tunisie — Plant Inventory of Tunisia

**Application web TRILINGUE (arabe 🇹🇳 / français 🇫🇷 / anglais 🇬🇧) : inventaire des espèces végétales de Tunisie, cartographie interactive de leur distribution et plan de conservation.**
**تطبيق ويب ثلاثي اللغة: جرد النباتات في تونس، رسم خرائط توزيعها، والمحافظة عليها.**

Ce package contient **trois versions** de l'application / يحتوي هذا الحزمة على ثلاث نسخ:

---

## ⭐ Version 1 — 100 % HORS-LIGNE (recommandée) / النسخة الكاملة دون اتصال

**Fichier : `inventaire-plantes-tunisie-hors-ligne.html` (~5,6 Mo)**

👉 **Double-cliquez** — tout fonctionne immédiatement, **même sans aucune connexion internet** :
photos réelles, carte de Tunisie (tuiles OSM préchargées zoom 6-9), police arabe Cairo et bibliothèque Leaflet sont **intégrées dans le fichier**. Parfait pour un PC de présentation sans internet ou une clé USB.

* الملف الكامل دون اتصال: الصور والخرائط والخطوط مدمجة بالكامل — يعمل بدون إنترنت نهائياً.

- Zoom carte : 6 → 9 (niveau gouvernorat) · tout le reste est identique à la version en ligne
- Seule limite : pas de chargement de tuiles au-delà du zoom 9 (hors Tunisie)
- 🗺️ **Sélecteur de fonds de carte** : la mosaïque intégrée (📦) est le fond par défaut ; dès qu'internet est disponible, basculez vers Google Satellite, Topo, OSM… via le bouton calques
- 🌐 **Trilingue** : boutons drapeaux 🇹🇳 / 🇫🇷 / 🇬🇧 dans l'en-tête — tout le contenu (interface, 30 espèces, aires protégées, popups, formulaire) se synchronise instantanément

---

## 🚀 Version 2 — Fichier autonome léger (internet au 1ᵉʳ chargement) / النسخة المستقلة الخفيفة

**Fichier : `inventaire-plantes-tunisie.html` (~103 Ko)**

👉 **Double-cliquez simplement sur le fichier** — il s'ouvre dans votre navigateur (Chrome, Edge, Firefox). Aucune installation, aucun serveur, aucun compte requis.

* الملف المستقل الخفيف: انقر نقرتين مزدوجتين فقط — لا يحتاج أي تثبيت.

- ✅ Données embarquées : 30 espèces, 24 gouvernorats, 11 aires protégées, échelle UICN
- 🌐 Internet requis pour : photos, fonds de carte en ligne, bibliothèque Leaflet et police Cairo
- 💾 Les observations citoyennes sont sauvegardées dans le navigateur (localStorage)

### 🌐 Trilingue AR / FR / EN / ثلاث لغات

Trois boutons **drapeaux SVG** (Tunisie 🇹🇳, France 🇫🇷, Angleterre 🇬🇧) dans l'en-tête basculent instantanément **toute l'application** : interface, navigation, hero, KPI, graphiques, 30 fiches espèces (noms + descriptions + habitats + usages + floraisons), 11 aires protégées, zones écologiques, échelle UICN, popups de la carte, formulaire, messages, pied de page — avec inversion RTL ↔ LTR automatique et mémorisation du choix.

### 📍 Formulaire d'observation enrichi / نموذج المشاهدات المطور

- **Coordonnées X/Y en degrés décimaux WGS84** (latitude 30–38 · longitude 7–13) — validées et placées **exactement** sur la carte (marqueur or), affichées dans le journal et les popups
- **Photos des 4 directions** (Nord 🇳, Est 🇪, Sud 🇸, Ouest 🇴) — compression automatique (~640 px), aperçus, vignettes cliquables avec visionneuse plein écran, stockage local

### 🗺️ Sélecteur de fonds de carte / مبدّل خلفيات الخريطة

Un **bouton calques** (⬛ coin supérieur droit de la carte) ouvre un panneau escamotable avec **8 fonds de carte** — cliquez pour basculer instantanément ; votre choix est mémorisé (localStorage) :

| Fond | Fournisseur |
|---|---|
| قمر صناعي · Satellite (par défaut) | Google 🛰️ |
| خريطة OSM · Plan libre | OpenStreetMap |
| طبوغرافية · Topographie | OpenTopoMap 🏔️ |
| شوارع وحضر · Plan urbain | Google 🏙️ |
| قمر صناعي + أسماء · Hybride | Google 🌍 (labels AR) |
| تضاريس وطبيعة · Relief | Google ⛰️ |
| مرئيات فضائية · Imagerie | Esri World Imagery 🛰️ |
| خريطة فاتحة · Fond clair | CARTO Voyager 🧭 |

> 💡 Si un fournisseur est bloqué ou inaccessible (ex. erreur 403 OSM), choisissez simplement un autre fond — Google Satellite est actif par défaut.

---

## 🛠️ Version 3 — Code source complet (Next.js) / الكود المصدري الكامل

Application professionnelle avec base de données SQLite réelle, API et observations persistées côté serveur.

**Prérequis : Node.js ≥ 18** (ou Bun)

```bash
npm install
npx prisma generate
npm run dev
```

Puis ouvrir **http://localhost:3000**

> La base SQLite (`db/custom.db`) est **déjà peuplée** : 30 espèces, 24 gouvernorats,
> 11 aires protégées, 19 observations. Aucune étape de seed n'est nécessaire.

### Base de données / قاعدة البيانات

Le fichier `.env` fourni contient :

```
DATABASE_URL=file:../db/custom.db
```

*(chemin relatif au dossier `prisma/`). Si la base n'est pas trouvée, indiquez un chemin absolu :*

```
DATABASE_URL=file:/chemin/absolu/vers/db/custom.db
```

### Réinitialiser les données (optionnel) / إعادة تهيئة البيانات

```bash
npx prisma db push        # recrée le schéma
npx tsx scripts/seed.ts   # re-seed (ou: bun scripts/seed.ts)
```

---

## Contenu de l'application / محتوى التطبيق

| Module | Description |
|---|---|
| **Tableau de bord** | KPI, graphiques (zones écologiques, statuts UICN), espèces menacées, dernières observations |
| **Inventaire** | 30 espèces réelles de la flore tunisienne — photos, fiches détaillées trilingues, filtres (famille, statut UICN, zone, endémisme) |
| **Carte de répartition** | Carte interactive Leaflet : 8 fonds de carte (Google Satellite, OSM, Topo…), gouvernorats, 11 aires protégées, observations GPS WGS84, filtre par espèce |
| **Conservation** | Échelle UICN trilingue, menaces, aires protégées, actions concrètes |
| **Observations citoyennes** | Formulaire validé : coordonnées WGS84 + photos N/E/S/O qui enrichissent automatiquement la carte |

## Structure du projet / هيكل المشروع

```
inventaire-plantes-tunisie.html → ★ VERSION AUTONOME (double-clic)
prisma/schema.prisma            → modèles Species, Governorate, ProtectedArea, Observation
db/custom.db                    → base SQLite prête à l'emploi (version Next.js)
scripts/seed*.ts                → données de référence (30 espèces, aires protégées…)
src/app/page.tsx                → page principale (server component)
src/components/*-section.tsx    → Tableau de bord, Inventaire, Carte, Conservation, Observations
src/lib/constants.ts            → échelle UICN AR/FR, couleurs, zones écologiques
assets/img/*.json               → sources des photos réelles (OSS)
```

## Technologies / التقنيات

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · shadcn/ui · Prisma + SQLite · Leaflet · Recharts · Lucide Icons

**Langue** : interface arabe RTL (contenus bilingues arabe/français) · **Photos** : hébergées OSS.

---

© 2026 — Projet pédagogique / مشروع تربوي — جرد النباتات في تونس ورسم خرائط توزيعها والمحافظة عليها
