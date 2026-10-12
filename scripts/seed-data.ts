// ─── Données de référence : Gouvernorats de Tunisie (24) ──────────
export const GOVERNORATES = [
  { id: "tunis",      nameAr: "تونس",      nameFr: "Tunis",       lat: 36.80, lng: 10.18, zone: "الشمال" },
  { id: "ariana",     nameAr: "أريانة",    nameFr: "Ariana",      lat: 36.86, lng: 10.19, zone: "الشمال" },
  { id: "ben-arous",  nameAr: "بن عروس",   nameFr: "Ben Arous",   lat: 36.75, lng: 10.23, zone: "الشمال" },
  { id: "bizerte",    nameAr: "بنزرت",     nameFr: "Bizerte",     lat: 37.27, lng: 9.87,  zone: "الشمال" },
  { id: "beja",       nameAr: "باجة",      nameFr: "Béja",        lat: 36.72, lng: 9.18,  zone: "الشمال" },
  { id: "jendouba",   nameAr: "جندوبة",    nameFr: "Jendouba",    lat: 36.50, lng: 8.78,  zone: "الشمال" },
  { id: "kef",        nameAr: "الكاف",     nameFr: "Le Kef",      lat: 36.17, lng: 8.70,  zone: "الشمال" },
  { id: "siliana",    nameAr: "سليانة",    nameFr: "Siliana",     lat: 36.08, lng: 9.37,  zone: "الشمال" },
  { id: "zaghouan",   nameAr: "زغوان",     nameFr: "Zaghouan",    lat: 36.40, lng: 10.14, zone: "الشمال" },
  { id: "nabeul",     nameAr: "نابل",      nameFr: "Nabeul",      lat: 36.45, lng: 10.73, zone: "الشمال" },
  { id: "manouba",    nameAr: "منوبة",     nameFr: "Manouba",     lat: 36.81, lng: 10.10, zone: "الشمال" },
  { id: "sousse",     nameAr: "سوسة",      nameFr: "Sousse",      lat: 35.83, lng: 10.64, zone: "الوسط" },
  { id: "monastir",   nameAr: "المنستير",  nameFr: "Monastir",    lat: 35.78, lng: 10.80, zone: "الوسط" },
  { id: "mahdia",     nameAr: "المهدية",   nameFr: "Mahdia",      lat: 35.50, lng: 11.06, zone: "الوسط" },
  { id: "sfax",       nameAr: "صفاقس",     nameFr: "Sfax",        lat: 34.74, lng: 10.76, zone: "الوسط" },
  { id: "kairouan",   nameAr: "القيروان",  nameFr: "Kairouan",    lat: 35.68, lng: 10.10, zone: "الوسط" },
  { id: "kasserine",  nameAr: "القصرين",   nameFr: "Kasserine",   lat: 35.17, lng: 8.83,  zone: "الوسط" },
  { id: "sidi-bouzid",nameAr: "سيدي بوزيد",nameFr: "Sidi Bouzid", lat: 35.04, lng: 9.48,  zone: "الوسط" },
  { id: "gabes",      nameAr: "قابس",      nameFr: "Gabès",       lat: 33.88, lng: 10.10, zone: "الجنوب" },
  { id: "medenine",   nameAr: "مدنين",     nameFr: "Médenine",    lat: 33.36, lng: 10.50, zone: "الجنوب" },
  { id: "tataouine",  nameAr: "تطاوين",    nameFr: "Tataouine",   lat: 32.93, lng: 10.45, zone: "الجنوب" },
  { id: "gafsa",      nameAr: "قفصة",      nameFr: "Gafsa",       lat: 34.43, lng: 8.62,  zone: "الجنوب" },
  { id: "tozeur",     nameAr: "توزر",      nameFr: "Tozeur",      lat: 33.92, lng: 8.13,  zone: "الجنوب" },
  { id: "kebili",     nameAr: "قبلي",      nameFr: "Kébili",      lat: 33.70, lng: 8.97,  zone: "الجنوب" },
];

// ─── Aires protégées (حدائق وطنية ومحميات) ────────────────────────
export const PROTECTED_AREAS = [
  {
    id: "ichkeul", nameAr: "حديقة إشكل الوطنية", nameFr: "Parc national de l'Ichkeul",
    type: "محمية عالمية (اليونسكو)", governorate: "بنزرت", areaHa: 12600, lat: 37.16, lng: 9.66,
    description: "أكبر بحيرة عذبة في شمال أفريقيا وموقع تراث عالمي لليونسكو، تستقبل مئات الآلاف من الطيور المهاجرة، وتتميز بغابات البلوط والأراضي الرطبة الموسمية.",
  },
  {
    id: "chambi", nameAr: "حديقة الشعنبي الوطنية", nameFr: "Parc national du Chambi",
    type: "حديقة وطنية", governorate: "القصرين", areaHa: 6723, lat: 35.16, lng: 8.90,
    description: "تحتضن أعلى قمة في تونس (جبل الشعنبي 1544 م)، وتشمل غابات الصنوبر الحلبي والعرار، وتُعد ملجأ لغزال الجبل ونباتات الجبال الوسطى.",
  },
  {
    id: "feija", nameAr: "حديقة الفايجة الوطنية", nameFr: "Parc national d'El Feija",
    type: "حديقة وطنية", governorate: "جندوبة", areaHa: 2632, lat: 36.45, lng: 8.44,
    description: "قلب غابات كروميرية الرطبة بأشجار البلوط الفليني والزرّين، وأحد آخر معاقل القرد المكّوك (المغوط) في شمال تونس.",
  },
  {
    id: "boukornine", nameAr: "حديقة بوكرنين الوطنية", nameFr: "Parc national de Boukornine",
    type: "حديقة وطنية", governorate: "بن عروس", areaHa: 1939, lat: 36.70, lng: 10.42,
    description: "رئتي أخضرتين على أعتاب العاصمة، تضم غابات العرار والآس والزيتون البري ومسارات بيئية لتوعية الزوار.",
  },
  {
    id: "zaghouan", nameAr: "حديقة جبل زغوان الوطنية", nameFr: "Parc national de Jebel Zaghouan",
    type: "حديقة وطنية", governorate: "زغوان", areaHa: 2081, lat: 36.38, lng: 10.13,
    description: "جبل كلسي شهر بغابات الصنوبر الحلبي والعرعار وبمصدر ماء تينة الذي كان يغذي قنطرة زغوان الرومانية.",
  },
  {
    id: "bou-hedma", nameAr: "حديقة بوحدمة الوطنية", nameFr: "Parc national de Bou-Hedma",
    type: "حديقة وطنية", governorate: "سيدي بوزيد", areaHa: 16488, lat: 34.72, lng: 9.17,
    description: "سافانا ما قبل صحراوية فريدة تجمع أشجار السيّاح المُعاد توطينها مع النعام والغزال، وتُعد نموذجاً لترميم النظم البيئية شبه الجافة.",
  },
  {
    id: "chitana", nameAr: "حديقة جبل شيطانة ورأس أسود", nameFr: "Parc national de Jebel Chitana-Cap Negro",
    type: "حديقة وطنية", governorate: "باجة", areaHa: 12126, lat: 36.98, lng: 9.30,
    description: "امتداد ساحلي وجبلي على البحر الأبيض، يجمع بين غابات البلوط الفليني والخليج الصخري والموائل الساحلية العذراء.",
  },
  {
    id: "sidi-toui", nameAr: "حديقة سيدي الطوي الوطنية", nameFr: "Parc national de Sidi Toui",
    type: "حديقة وطنية", governorate: "مدنين", areaHa: 6315, lat: 31.03, lng: 10.46,
    description: "نموذج للنظام البيئي الصحراوي في الجنوب الشرقي، بمساحاته السهبية الشائكة وبرامج إعادة توطين الغزال الصحراوي والمها.",
  },
  {
    id: "dghoumes", nameAr: "حديقة دخامس الوطنية", nameFr: "Parc national de Dghoumes",
    type: "حديقة وطنية", governorate: "توزر", areaHa: 8500, lat: 33.53, lng: 8.35,
    description: "منطقة انتقالية بين السهوب والصحراء بالقرب من حوض شط الجريد، تضم نباتات ملحية ونخيل بري وبرامج لإعادة النعامة الأفريقية.",
  },
  {
    id: "oued-dekouk", nameAr: "حديقة وادي الدكوك الوطنية", nameFr: "Parc national d'Oued Dekouk",
    type: "حديقة وطنية", governorate: "تطاوين", areaHa: 7073, lat: 32.42, lng: 10.25,
    description: "محمية في قلب جبال تطاوين، تضم مجاري مائية موسمية بأشجار الأثل والسيّاح وتوفر ملاذاً للحياة الصحراوية.",
  },
  {
    id: "zembra", nameAr: "محمية زمبرة وزمبريتا", nameFr: "Réserve naturelle de Zembra et Zembretta",
    type: "محمية طبيعية (اليونسكو)", governorate: "نابل", areaHa: 391, lat: 37.12, lng: 11.08,
    description: "جزيرتان محميتان قبالة الرأس البوني، تشكلان محمية محيط حيوي بغابات نادرة على الجروف وعشوائيات بحرية غنية.",
  },
];

// ─── مقياس حالة الحفظ ─────────────────────────────────────────────
export const CONSERVATION_LEVELS: Record<string, { ar: string; fr: string; color: string }> = {
  LC: { ar: "أقل اهتماماً", fr: "Préoccupation mineure", color: "#4d7c0f" },
  NT: { ar: "قريب من الخطر", fr: "Quasi menacé", color: "#ca8a04" },
  VU: { ar: "قابل للتأثر", fr: "Vulnérable", color: "#ea580c" },
  EN: { ar: "مهدد بالانقراض", fr: "En danger", color: "#dc2626" },
  CR: { ar: "مهدد حديثاً بالانقراض", fr: "En danger critique", color: "#7f1d1d" },
};

// ─── النطاقات البيئية ─────────────────────────────────────────────
export const ZONES = [
  { key: "foret",      ar: "الغابات الرطبة",           color: "#166534" },
  { key: "montagne",   ar: "الجبال والأدغال",          color: "#3f6212" },
  { key: "steppe",     ar: "السهوب والمراعي الجافة",    color: "#a16207" },
  { key: "desert",     ar: "الواحات والصحراء",         color: "#b45309" },
  { key: "cote",       ar: "السواحل والأراضي الرطبة",   color: "#0f766e" },
] as const;
