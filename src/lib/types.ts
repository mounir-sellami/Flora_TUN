// ─── Types partagés entre serveur et client ───────────────────────
export type Species = {
  id: string;
  scientificName: string;
  arabicName: string;
  frenchName: string;
  familyAr: string;
  familyLatin: string;
  emoji: string;
  image: string | null;
  description: string;
  habitat: string;
  bioclimate: string;
  zone: string;
  conservation: string;
  endemic: boolean;
  uses: string | null;
  flowering: string | null;
  regions: string; // JSON array
};

export type Governorate = {
  id: string;
  nameAr: string;
  nameFr: string;
  lat: number;
  lng: number;
  zone: string;
};

export type ProtectedArea = {
  id: string;
  nameAr: string;
  nameFr: string;
  type: string;
  governorate: string;
  areaHa: number;
  lat: number;
  lng: number;
  description: string;
};

export type ObservationSpecies = {
  id: string;
  arabicName: string;
  scientificName: string;
  emoji: string;
  conservation: string;
};

export type Observation = {
  id: string;
  speciesId: string;
  regionId: string;
  lat: number | null;
  lng: number | null;
  observer: string;
  notes: string | null;
  date: string;
  createdAt: string;
  species?: ObservationSpecies;
};

export type AppData = {
  species: Species[];
  governorates: Governorate[];
  protectedAreas: ProtectedArea[];
  observations: Observation[];
};
