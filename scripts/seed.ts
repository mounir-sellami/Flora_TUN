import { PrismaClient } from "@prisma/client";
import { readFileSync, existsSync } from "fs";
import { GOVERNORATES, PROTECTED_AREAS } from "./seed-data";
import { SPECIES } from "./seed-species";

const db = new PrismaClient();

// mapping imgKey -> OSS url (généré par fetch_images)
function loadImageMapping(): Record<string, string> {
  const p = "/home/z/my-project/assets/img/mapping.json";
  if (existsSync(p)) {
    try {
      return JSON.parse(readFileSync(p, "utf-8"));
    } catch {
      return {};
    }
  }
  return {};
}

// ─── Observations citoyennes (semées) ─────────────────────────────
const OBSERVATIONS = [
  { sci: "Cyclamen africanum", region: "jendouba", observer: "أمين بن صالح", daysAgo: 12, notes: "عزبة صغيرة على الصخور الجيرية في أعالي غابة الفايجة، أزهار وردية حديثة التفتح." },
  { sci: "Quercus suber", region: "jendouba", observer: "فريق الرصد البيئي", daysAgo: 30, notes: "تجدد طبيعي ممتاز بعد الحرائق، شتلات بلوط فليني على مساحة نحو هكتار." },
  { sci: "Phoenix dactylifera", region: "tozeur", observer: "وليد الجلولي", daysAgo: 45, notes: "إحصاء جزئي لمعلق بالمحمدية: 420 نخلة، 3 عيون تُظهر أعراض فوساريوم مبكرة." },
  { sci: "Nitraria retusa", region: "kebili", observer: "مريم الطرابلسي", daysAgo: 60, notes: "غمدات الغرقد على سباخ الشابي في امتداد غير معتاد، مؤشر على تدهور الملوحة." },
  { sci: "Pancratium maritimum", region: "nabeul", observer: "سلمى بوعزيز", daysAgo: 75, notes: "زنبق البحر يزهر على كثبان حسيني، لكن مد السياحة قلّص الشريط إلى عشرات الأمتار." },
  { sci: "Artemisia herba-alba", region: "kasserine", observer: "كريم المبروكي", daysAgo: 90, notes: "جمع تجاري مبكر للشيح في جبل الورغ، حاجة لتنظيم الحصاد مع المستثمرين." },
  { sci: "Acacia tortilis", region: "bou-hedma", regionAlt: "sidi-bouzid", observer: "نادية الشابي", daysAgo: 100, notes: "إكثار طبيعي لأشجار السياح في وادي بوحدمة بعد موسم أمطار جيد." },
  { sci: "Retama raetam", region: "medenine", observer: "حمزة القصاب", daysAgo: 120, notes: "إزهار ممتد للرتم في وادي الجريف، النحل المحلي نشط جداً في الفترة الصباحية." },
  { sci: "Tetraclinis articulata", region: "zaghouan", observer: "يوسف الحاج علي", daysAgo: 130, notes: "قنصلة عرار على السفح الجنوبي، حاجز قطع عشوائي مقترح على الطريق الثانوية." },
  { sci: "Salvia rosmarinus", region: "kasserine", observer: "رانية الفقي", daysAgo: 140, notes: "عزبات أزير كثيفة على جبل الشعانبي، أزهار زرقاء باكرة مع أمطار ديسمبر." },
  { sci: "Stipa tenacissima", region: "sidi-bouzid", observer: "مجموعة عمل الرامل", daysAgo: 160, notes: "حصاد ديس سنوي تقليدي منظم، أثر إيجابي على استقرار التربة ملاحظ." },
  { sci: "Pistacia atlantica", region: "gafsa", observer: "منير العبيدي", daysAgo: 180, notes: "بطة أطلسي عتيقة في قاع وادي بني ورقيلة، تُقدر بأكثر من 300 سنة، سقوط أفرع مرئي." },
  { sci: "Nerium oleander", region: "jendouba", observer: "أمين بن صالح", daysAgo: 200, notes: "دفلى مزدهرة على ضفاف وادي المجرادة، صحة النبات جيدة رغم انخفاض المياه." },
  { sci: "Myrtus communis", region: "bizerte", observer: "هاجر المسعودي", daysAgo: 220, notes: "جمع آسي محدود في غابة الحياد، تحتاج عزبة مظللة أكثر وحماية من الرعي." },
  { sci: "Capparis spinosa", region: "nabeul", observer: "عصام بن يحيى", daysAgo: 240, notes: "كبار متسلق على أعراش قدماء في الحمامات، حصاد تجاري منظم سنوي." },
  { sci: "Pinus halepensis", region: "sidi-bouzid", observer: "محمد الرحيوي", daysAgo: 260, notes: "قنصلة صنوبرية حديثة بالقرب من الحزام الأخضر، توزيع متفاوت مع الأفق." },
  { sci: "Thymus algeriensis", region: "gafsa", observer: "سفيان الدريدي", daysAgo: 280, notes: "عزبة زعتر على الجانب الجنوبي الجبلي، مقاومة جيدة لفترات الجفاف الممتدة." },
  { sci: "Calligonum comosum", region: "kebili", observer: "ليلى الهلالي", daysAgo: 300, notes: "شجيرات أبل تُستخدم في برنامج محلي لتثبيت الكثبان قرب الجديد." },
  { sci: "Ziziphus lotus", region: "sfax", observer: "داليا القرقوري", daysAgo: 320, notes: "أحزمة سدرة في سهول اللوازين، تقاوم الرمال وتشكل سياجاً طبيعياً فعّالاً." },
  { sci: "Erica arborea", region: "beja", observer: "فريق الرصد البيئي", daysAgo: 340, notes: "خلنج شجري متسلق على منحدرات المسلتة، عسل الخلنج من إنتاج الموسم عالي الجودة." },
];

async function main() {
  console.log("🧹 Nettoyage des tables...");
  await db.observation.deleteMany();
  await db.species.deleteMany();
  await db.protectedArea.deleteMany();
  await db.governorate.deleteMany();

  console.log("📍 Gouvernorats...");
  for (const g of GOVERNORATES) {
    await db.governorate.create({ data: g });
  }

  console.log("🛡️ Aires protégées...");
  for (const a of PROTECTED_AREAS) {
    const { id, ...rest } = a;
    await db.protectedArea.create({ data: { id, ...rest } });
  }

  console.log("🌿 Espèces...");
  const imgMap = loadImageMapping();
  const speciesIdMap: Record<string, string> = {};
  for (const s of SPECIES) {
    const { imgKey, regions, ...rest } = s;
    const created = await db.species.create({
      data: {
        ...rest,
        regions: JSON.stringify(regions),
        image: imgKey && imgMap[imgKey] ? imgMap[imgKey] : null,
      },
    });
    speciesIdMap[s.scientificName] = created.id;
  }

  console.log("🔭 Observations...");
  for (const o of OBSERVATIONS) {
    const speciesId = speciesIdMap[o.sci];
    if (!speciesId) continue;
    const gov = GOVERNORATES.find((g) => g.id === o.region) ?? GOVERNORATES.find((g) => g.id === o.regionAlt);
    if (!gov) continue;
    const date = new Date();
    date.setDate(date.getDate() - o.daysAgo);
    await db.observation.create({
      data: {
        speciesId,
        regionId: gov.id,
        lat: gov.lat + (Math.random() - 0.5) * 0.3,
        lng: gov.lng + (Math.random() - 0.5) * 0.3,
        observer: o.observer,
        notes: o.notes,
        date,
      },
    });
  }

  const count = await db.species.count();
  console.log(`✅ Seed terminé : ${count} espèces, ${GOVERNORATES.length} gouvernorats, ${PROTECTED_AREAS.length} aires protégées.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
