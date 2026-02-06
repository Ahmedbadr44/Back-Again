import type { Exercise } from "../utils/storage";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1544367563-121542f83d98?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80";

type SeedExercise = {
  nameAr: string;
  nameEn: string;
  duration: string;
  instructions: string;
  benefits: string;
};

const WEEK_1: SeedExercise[] = [
  {
    nameAr: "بلانك جانبي",
    nameEn: "Side Plank",
    duration: "20 ثانية لكل جنب",
    instructions:
      "اسند على الكوع تحت الكتف مباشرة، ارفع الحوض حتى يصبح الجسم في خط مستقيم، شدّ البطن والمؤخرة مع تنفس طبيعي.",
    benefits: "تقوية عضلات الجذع الجانبية، تقليل آلام أسفل الظهر، تحسين التوازن.",
  },
  {
    nameAr: "بلانك عادي",
    nameEn: "Plank",
    duration: "30 ثانية",
    instructions:
      "اسند على الساعدين وأطراف القدمين، شدّ البطن، حافظ على استقامة الجسم بدون رفع أو هبوط الحوض.",
    benefits: "تقوية الـ Core بالكامل، دعم العمود الفقري، تحسين الثبات.",
  },
  {
    nameAr: "سوبرمان عكسي متبادل",
    nameEn: "Alternating Superman",
    duration: "20 عدة لكل جنب",
    instructions: "ارفع اليد اليمنى مع الرجل اليسرى، ثم بدّل، حافظ على الرقبة محايدة والحركة بطيئة.",
    benefits: "تحسين التوازن العضلي، تقوية أسفل الظهر، تنشيط العضلات العميقة.",
  },
  {
    nameAr: "Wall Slides",
    nameEn: "Wall Slides",
    duration: "10-15 عدة",
    instructions: "اسند ظهرك للحائط، حرّك الذراعين لأعلى ولأسفل مع الحفاظ على الظهر ملاصق للحائط.",
    benefits: "تحسين وضعية الكتف، تقليل انحناء الظهر، دعم الرقبة والجزء العلوي.",
  },
  {
    nameAr: "إطالة مثنيات الفخذ",
    nameEn: "Hip Flexor Stretch",
    duration: "30 ثانية لكل جنب",
    instructions: "ضع رجل أمامك والأخرى خلفك، ادفع الحوض للأمام بلطف مع ظهر مستقيم.",
    benefits: "تقليل شد الحوض، تحسين وضعية أسفل الظهر، تقليل الألم الناتج عن الجلوس الطويل.",
  },
  {
    nameAr: "وضعية الطفل مع ميلان جانبي",
    nameEn: "Child's Pose with Side Bend",
    duration: "30 ثانية لكل جنب",
    instructions: "اجلس على الكعبين، مد الذراعين للأمام وميّل الجسم يمينًا ويسارًا.",
    benefits: "إرخاء الظهر، تحسين مرونة الجانبين، تهدئة العضلات المشدودة.",
  },
  {
    nameAr: "إطالة العضلة القطنية الجانبية",
    nameEn: "QL Stretch",
    duration: "30 ثانية لكل جنب",
    instructions: "قف مستقيمًا ومل بجسمك للجانب مع ثبات الحوض.",
    benefits: "تقليل الشد الجانبي، تخفيف ألم أسفل الظهر، تحسين التوازن.",
  },
];

const WEEK_2: SeedExercise[] = [
  {
    nameAr: "بلانك جانبي",
    nameEn: "Side Plank",
    duration: "30 ثانية لكل جنب",
    instructions:
      "اسند على الكوع تحت الكتف مباشرة، ارفع الحوض حتى يصبح الجسم في خط مستقيم، شدّ البطن والمؤخرة مع تنفس طبيعي.",
    benefits: "تقوية عضلات الجذع الجانبية، تقليل آلام أسفل الظهر، تحسين التوازن.",
  },
  {
    nameAr: "بلانك عادي",
    nameEn: "Plank",
    duration: "40 ثانية",
    instructions:
      "اسند على الساعدين وأطراف القدمين، شدّ البطن، حافظ على استقامة الجسم بدون رفع أو هبوط الحوض.",
    benefits: "تقوية الـ Core بالكامل، دعم العمود الفقري، تحسين الثبات.",
  },
  {
    nameAr: "سوبرمان عكسي متبادل",
    nameEn: "Alternating Superman",
    duration: "25 عدة لكل جنب",
    instructions: "ارفع اليد اليمنى مع الرجل اليسرى، ثم بدّل، حافظ على الرقبة محايدة والحركة بطيئة.",
    benefits: "تحسين التوازن العضلي، تقوية أسفل الظهر، تنشيط العضلات العميقة.",
  },
  {
    nameAr: "Wall Slides",
    nameEn: "Wall Slides",
    duration: "15-20 عدة",
    instructions: "اسند ظهرك للحائط، حرّك الذراعين لأعلى ولأسفل مع الحفاظ على الظهر ملاصق للحائط.",
    benefits: "تحسين وضعية الكتف، تقليل انحناء الظهر، دعم الرقبة والجزء العلوي.",
  },
  {
    nameAr: "إطالة مثنيات الفخذ",
    nameEn: "Hip Flexor Stretch",
    duration: "40 ثانية لكل جنب",
    instructions: "ضع رجل أمامك والأخرى خلفك، ادفع الحوض للأمام بلطف مع ظهر مستقيم.",
    benefits: "تقليل شد الحوض، تحسين وضعية أسفل الظهر، تقليل الألم الناتج عن الجلوس الطويل.",
  },
  {
    nameAr: "وضعية الطفل مع ميلان جانبي",
    nameEn: "Child's Pose with Side Bend",
    duration: "40 ثانية لكل جنب",
    instructions: "اجلس على الكعبين، مد الذراعين للأمام وميّل الجسم يمينًا ويسارًا.",
    benefits: "إرخاء الظهر، تحسين مرونة الجانبين، تهدئة العضلات المشدودة.",
  },
  {
    nameAr: "إطالة العضلة القطنية الجانبية",
    nameEn: "QL Stretch",
    duration: "40 ثانية لكل جنب",
    instructions: "قف مستقيمًا ومل بجسمك للجانب مع ثبات الحوض.",
    benefits: "تقليل الشد الجانبي، تخفيف ألم أسفل الظهر، تحسين التوازن.",
  },
  {
    nameAr: "Hip Hinge + Hamstring Stretch",
    nameEn: "Hip Hinge with Hamstring Stretch",
    duration: "10 عدات",
    instructions: "انحنِ من مفصل الحوض مع ظهر مستقيم، ثم عد للوضع الطبيعي.",
    benefits: "تحسين ميكانيكية الحركة، تقليل الضغط على الظهر، زيادة مرونة الخلفية.",
  },
  {
    nameAr: "Romanian Deadlift رجل واحدة",
    nameEn: "Single-Leg Romanian Deadlift",
    duration: "10 عدات لكل رجل",
    instructions: "احمل وزن خفيف، انحنِ للأمام مع رفع الرجل الخلفية، حافظ على التوازن.",
    benefits: "تصحيح عدم التوازن، تقوية المؤخرة والهامسترينج، دعم أسفل الظهر.",
  },
];

const WEEK_3: SeedExercise[] = [
  {
    nameAr: "بلانك جانبي",
    nameEn: "Side Plank",
    duration: "40 ثانية لكل جنب",
    instructions:
      "اسند على الكوع تحت الكتف مباشرة، ارفع الحوض حتى يصبح الجسم في خط مستقيم، شدّ البطن والمؤخرة مع تنفس طبيعي.",
    benefits: "تقوية عضلات الجذع الجانبية، تقليل آلام أسفل الظهر، تحسين التوازن.",
  },
  {
    nameAr: "بلانك عادي",
    nameEn: "Plank",
    duration: "50 ثانية",
    instructions:
      "اسند على الساعدين وأطراف القدمين، شدّ البطن، حافظ على استقامة الجسم بدون رفع أو هبوط الحوض.",
    benefits: "تقوية الـ Core بالكامل، دعم العمود الفقري، تحسين الثبات.",
  },
  {
    nameAr: "سوبرمان عكسي متبادل",
    nameEn: "Alternating Superman",
    duration: "30 عدة لكل جنب",
    instructions: "ارفع اليد اليمنى مع الرجل اليسرى، ثم بدّل، حافظ على الرقبة محايدة والحركة بطيئة.",
    benefits: "تحسين التوازن العضلي، تقوية أسفل الظهر، تنشيط العضلات العميقة.",
  },
  {
    nameAr: "Wall Slides",
    nameEn: "Wall Slides",
    duration: "20 عدة",
    instructions: "اسند ظهرك للحائط، حرّك الذراعين لأعلى ولأسفل مع الحفاظ على الظهر ملاصق للحائط.",
    benefits: "تحسين وضعية الكتف، تقليل انحناء الظهر، دعم الرقبة والجزء العلوي.",
  },
  {
    nameAr: "إطالة مثنيات الفخذ",
    nameEn: "Hip Flexor Stretch",
    duration: "45 ثانية لكل جنب",
    instructions: "ضع رجل أمامك والأخرى خلفك، ادفع الحوض للأمام بلطف مع ظهر مستقيم.",
    benefits: "تقليل شد الحوض، تحسين وضعية أسفل الظهر، تقليل الألم الناتج عن الجلوس الطويل.",
  },
  {
    nameAr: "وضعية الطفل مع ميلان جانبي",
    nameEn: "Child's Pose with Side Bend",
    duration: "45 ثانية لكل جنب",
    instructions: "اجلس على الكعبين، مد الذراعين للأمام وميّل الجسم يمينًا ويسارًا.",
    benefits: "إرخاء الظهر، تحسين مرونة الجانبين، تهدئة العضلات المشدودة.",
  },
  {
    nameAr: "إطالة العضلة القطنية الجانبية",
    nameEn: "QL Stretch",
    duration: "45 ثانية لكل جنب",
    instructions: "قف مستقيمًا ومل بجسمك للجانب مع ثبات الحوض.",
    benefits: "تقليل الشد الجانبي، تخفيف ألم أسفل الظهر، تحسين التوازن.",
  },
  {
    nameAr: "Hip Hinge + Hamstring Stretch",
    nameEn: "Hip Hinge with Hamstring Stretch",
    duration: "12 عدة",
    instructions: "انحنِ من مفصل الحوض مع ظهر مستقيم، ثم عد للوضع الطبيعي.",
    benefits: "تحسين ميكانيكية الحركة، تقليل الضغط على الظهر، زيادة مرونة الخلفية.",
  },
  {
    nameAr: "Romanian Deadlift رجل واحدة",
    nameEn: "Single-Leg Romanian Deadlift",
    duration: "12 عدة لكل رجل",
    instructions: "احمل وزن خفيف، انحنِ للأمام مع رفع الرجل الخلفية، حافظ على التوازن.",
    benefits: "تصحيح عدم التوازن، تقوية المؤخرة والهامسترينج، دعم أسفل الظهر.",
  },
  {
    nameAr: "Back Extension رجل واحدة",
    nameEn: "Single-Leg Back Extension",
    duration: "10 عدات لكل جنب",
    instructions: "نفّذ الحركة ببطء، ركّز على الجذع بدون اندفاع.",
    benefits: "تقوية أسفل الظهر بشكل آمن، تحسين التحكم العضلي.",
  },
  {
    nameAr: "Y Raises",
    nameEn: "Y Raises",
    duration: "12 عدة",
    instructions: "ارفع الذراعين بشكل Y مع وزن خفيف، شد لوحي الكتف.",
    benefits: "تحسين وضعية الكتف، دعم العمود الفقري العلوي، تقليل الانحناء.",
  },
];

const WEEK_4: SeedExercise[] = [
  {
    nameAr: "بلانك جانبي",
    nameEn: "Side Plank",
    duration: "50 ثانية لكل جنب",
    instructions:
      "اسند على الكوع تحت الكتف مباشرة، ارفع الحوض حتى يصبح الجسم في خط مستقيم، شدّ البطن والمؤخرة مع تنفس طبيعي.",
    benefits: "تقوية عضلات الجذع الجانبية، تقليل آلام أسفل الظهر، تحسين التوازن.",
  },
  {
    nameAr: "بلانك عادي",
    nameEn: "Plank",
    duration: "60 ثانية",
    instructions:
      "اسند على الساعدين وأطراف القدمين، شدّ البطن، حافظ على استقامة الجسم بدون رفع أو هبوط الحوض.",
    benefits: "تقوية الـ Core بالكامل، دعم العمود الفقري، تحسين الثبات.",
  },
  {
    nameAr: "سوبرمان عكسي متبادل",
    nameEn: "Alternating Superman",
    duration: "35 عدة لكل جنب",
    instructions: "ارفع اليد اليمنى مع الرجل اليسرى، ثم بدّل، حافظ على الرقبة محايدة والحركة بطيئة.",
    benefits: "تحسين التوازن العضلي، تقوية أسفل الظهر، تنشيط العضلات العميقة.",
  },
  {
    nameAr: "Wall Slides",
    nameEn: "Wall Slides",
    duration: "20-25 عدة",
    instructions: "اسند ظهرك للحائط، حرّك الذراعين لأعلى ولأسفل مع الحفاظ على الظهر ملاصق للحائط.",
    benefits: "تحسين وضعية الكتف، تقليل انحناء الظهر، دعم الرقبة والجزء العلوي.",
  },
  {
    nameAr: "إطالة مثنيات الفخذ",
    nameEn: "Hip Flexor Stretch",
    duration: "60 ثانية لكل جنب",
    instructions: "ضع رجل أمامك والأخرى خلفك، ادفع الحوض للأمام بلطف مع ظهر مستقيم.",
    benefits: "تقليل شد الحوض، تحسين وضعية أسفل الظهر، تقليل الألم الناتج عن الجلوس الطويل.",
  },
  {
    nameAr: "وضعية الطفل مع ميلان جانبي",
    nameEn: "Child's Pose with Side Bend",
    duration: "60 ثانية لكل جنب",
    instructions: "اجلس على الكعبين، مد الذراعين للأمام وميّل الجسم يمينًا ويسارًا.",
    benefits: "إرخاء الظهر، تحسين مرونة الجانبين، تهدئة العضلات المشدودة.",
  },
  {
    nameAr: "إطالة العضلة القطنية الجانبية",
    nameEn: "QL Stretch",
    duration: "60 ثانية لكل جنب",
    instructions: "قف مستقيمًا ومل بجسمك للجانب مع ثبات الحوض.",
    benefits: "تقليل الشد الجانبي، تخفيف ألم أسفل الظهر، تحسين التوازن.",
  },
  {
    nameAr: "Hip Hinge + Hamstring Stretch",
    nameEn: "Hip Hinge with Hamstring Stretch",
    duration: "15 عدة",
    instructions: "انحنِ من مفصل الحوض مع ظهر مستقيم، ثم عد للوضع الطبيعي.",
    benefits: "تحسين ميكانيكية الحركة، تقليل الضغط على الظهر، زيادة مرونة الخلفية.",
  },
  {
    nameAr: "Romanian Deadlift رجل واحدة",
    nameEn: "Single-Leg Romanian Deadlift",
    duration: "15 عدة لكل رجل",
    instructions: "احمل وزن خفيف، انحنِ للأمام مع رفع الرجل الخلفية، حافظ على التوازن.",
    benefits: "تصحيح عدم التوازن، تقوية المؤخرة والهامسترينج، دعم أسفل الظهر.",
  },
  {
    nameAr: "Back Extension رجل واحدة",
    nameEn: "Single-Leg Back Extension",
    duration: "12 عدة لكل جنب",
    instructions: "نفّذ الحركة ببطء، ركّز على الجذع بدون اندفاع.",
    benefits: "تقوية أسفل الظهر بشكل آمن، تحسين التحكم العضلي.",
  },
  {
    nameAr: "Y Raises",
    nameEn: "Y Raises",
    duration: "15 عدة",
    instructions: "ارفع الذراعين بشكل Y مع وزن خفيف، شد لوحي الكتف.",
    benefits: "تحسين وضعية الكتف، دعم العمود الفقري العلوي، تقليل الانحناء.",
  },
  {
    nameAr: "ضغط كتف بذراع واحدة (نصف ركوع)",
    nameEn: "Single-Arm Overhead Press (Half-Kneeling)",
    duration: "10 عدات لكل ذراع",
    instructions: "اجلس نصف ركوع، اضغط الوزن للأعلى مع شدّ البطن.",
    benefits: "تحسين الثبات، تقوية الكتف بدون ضغط على الظهر.",
  },
  {
    nameAr: "سحب دمبل بذراع واحدة",
    nameEn: "Single-Arm Dumbbell Row",
    duration: "12 عدة لكل ذراع",
    instructions: "اسحب الوزن باتجاه الجذع مع تثبيت الظهر.",
    benefits: "تقوية الظهر العلوي، تحسين التوازن العضلي.",
  },
  {
    nameAr: "حمل الحقيبة",
    nameEn: "Single-Arm Suitcase Carry",
    duration: "30-40 ثانية لكل جنب",
    instructions: "احمل الوزن على جنب واحد وامشِ مع ظهر مستقيم.",
    benefits: "تقوية الـ Core، تصحيح ميلان الجسم، محاكاة الحياة اليومية.",
  },
];

const WEEK_MAP: Record<number, SeedExercise[]> = {
  1: WEEK_1,
  2: WEEK_2,
  3: WEEK_3,
  4: WEEK_4,
};

const buildExerciseId = (week: number, day: number, index: number) =>
  week * 10000 + day * 100 + index;

export const WEEK_PROGRAM_EXERCISES: Exercise[] = Array.from({ length: 28 }, (_, i) => i + 1).flatMap(
  (day) => {
    const week = Math.ceil(day / 7);
    const weekExercises = WEEK_MAP[week] || [];
    return weekExercises.map((exercise, index) => ({
      id: buildExerciseId(week, day, index + 1),
      day,
      nameAr: exercise.nameAr,
      nameEn: exercise.nameEn,
      duration: exercise.duration,
      instructions: exercise.instructions,
      benefits: exercise.benefits,
      videoUrl: "",
      startImageUrl: PLACEHOLDER_IMAGE,
      endImageUrl: PLACEHOLDER_IMAGE,
      thumbnail: PLACEHOLDER_IMAGE,
    }));
  }
);
