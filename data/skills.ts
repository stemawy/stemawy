export type SkillCategory =
  | "english"
  | "programming"
  | "study-learning"
  | "mathematics"
  | "science"
  | "productivity"
  | "tools-utility";

export type SkillType =
  | "assessment"
  | "practice"
  | "learning-resource"
  | "tool";

export type Skill = {
  id: string;
  title: string;
  arTitle: string;
  description: string;
  arDescription: string;
  href: string;
  action: string;
  arAction: string;
  category: SkillCategory;
  type: SkillType;
  provider: string;
  icon: string;
};

type RawSkill = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  SkillCategory,
  SkillType,
  string,
  string,
];

const rawSkillRows: RawSkill[] = [
  [
    "Test Your Writing Speed",
    "اختبر سرعة كتابتك",
    "You write fast in your journals, your fingers move at light speed. Let's see what you got.",
    "تكتب بسرعة في مذكراتك، أصابعك تتحرك بسرعة الضوء، دعنا نرى ما لديك.",
    "https://monkeytype.com/",
    "Try Now",
    "جرب الآن",
    "productivity",
    "assessment",
    "Monkeytype",
    "speed",
  ],
  [
    "Learn Proper Writing",
    "تعلم الكتابة الصحيحة",
    "Still can't get your eyes off the keyboard? Start practicing proper writing right now.",
    "لا تزال غير قادر على رفع عينيك عن لوحة المفاتيح؟ ابدأ بممارسة الكتابة الصحيحة الآن.",
    "https://www.edclub.com/login.html",
    "Practice",
    "تدرب",
    "productivity",
    "learning-resource",
    "EdClub",
    "keyboard",
  ],
  [
    "Test Your English",
    "اختبر لغتك الإنجليزية",
    "Let's see what your level is in the global language, in all terms.",
    "دعنا نرى مستواك في اللغة العالمية، من جميع النواحي.",
    "https://www.berlitz.com/online-placement-test/adults/en?US",
    "Take Test",
    "ابدأ الاختبار",
    "english",
    "assessment",
    "Berlitz",
    "quiz",
  ],
  [
    "AI Detector",
    "كاشف الذكاء الاصطناعي",
    "Got a task to submit? Let's see what your AI percentage is.",
    "لديك مهمة لتقديمها؟ دعنا نرى نسبة الذكاء الاصطناعي لديك.",
    "https://www.zerogpt.com/",
    "Check",
    "تحقق",
    "tools-utility",
    "tool",
    "ZeroGPT",
    "smart_toy",
  ],
  [
    "Improve Your Vocabulary",
    "حسن مفرداتك",
    "Expand your word bank with fun and interactive exercises to boost your vocabulary skills.",
    "وسع حصيلتك اللغوية بتمارين ممتعة وتفاعلية لتعزيز مهاراتك في المفردات.",
    "https://www.vocabulary.com/",
    "Start Learning",
    "ابدأ التعلم",
    "english",
    "practice",
    "Vocabulary.com",
    "spellcheck",
  ],
  [
    "Grammar Exercises",
    "تمارين القواعد",
    "Master grammar rules with engaging exercises and quizzes designed for all levels.",
    "أتقن قواعد grammar بتمارين واختبارات شيقة مصممة لجميع المستويات.",
    "https://www.englishgrammar.org/category/exercises/",
    "Practice Now",
    "تدرب الآن",
    "english",
    "practice",
    "English Grammar",
    "rule",
  ],
  [
    "Reading Comprehension",
    "الفهم القرائي",
    "Enhance your reading skills with passages and questions that challenge your understanding.",
    "عزز مهارات القراءة لديك بنصوص وأسئلة تتحدى فهمك.",
    "https://www.readtheory.org/",
    "Read & Learn",
    "اقرأ وتعلم",
    "english",
    "practice",
    "ReadTheory",
    "menu_book",
  ],
  [
    "Writing Prompts",
    "أفكار للكتابة",
    "Get inspired with creative writing prompts to practice and improve your writing skills.",
    "استلهم أفكاراً للكتابة الإبداعية لممارسة وتحسين مهاراتك في الكتابة.",
    "https://www.writingforward.com/creative-writing-prompts",
    "Get Inspired",
    "احصل على الإلهام",
    "english",
    "practice",
    "Writing Forward",
    "edit_note",
  ],
  [
    "Listening Practice",
    "تدريب الاستماع",
    "Boost your listening skills with audio exercises and comprehension questions.",
    "عزز مهارات الاستماع لديك بتمارين صوتية وأسئلة فهم.",
    "https://www.esl-lab.com/",
    "Listen Now",
    "استمع الآن",
    "english",
    "practice",
    "ESL Lab",
    "headphones",
  ],
  [
    "Speaking Exercises",
    "تمارين التحدث",
    "Improve your spoken English with interactive speaking exercises and feedback.",
    "حسن لغتك الإنجليزية المنطوقة بتمارين تحدث تفاعلية وملاحظات.",
    "https://www.speakenglish.co.uk/speaking-exercises.html",
    "Speak Up",
    "تحدث",
    "english",
    "practice",
    "Speak English",
    "record_voice_over",
  ],
  [
    "Idioms and Phrases",
    "المصطلحات والعبارات",
    "Learn common idioms and phrases to sound more natural in English conversations.",
    "تعلم المصطلحات والعبارات الشائعة لتبدو أكثر طبيعية في المحادثات.",
    "https://www.theidioms.com/",
    "Learn More",
    "تعلم المزيد",
    "english",
    "learning-resource",
    "The Idioms",
    "translate",
  ],
  [
    "MATH Helper",
    "مساعد الرياضيات",
    "Solve any math problem, step by step.",
    "حل أي مسألة رياضية، خطوة بخطوة.",
    "https://www.symbolab.com/",
    "Explore",
    "استكشف",
    "mathematics",
    "tool",
    "Symbolab",
    "calculate",
  ],
  [
    "Science Experiments",
    "تجارب علمية",
    "Discover fun and educational science experiments to try at home or in the classroom.",
    "اكتشف تجارب علمية ممتعة وتعليمية للتجربة في المنزل أو في الفصل.",
    "https://www.sciencefun.org/kidszone/experiments/",
    "Experiment",
    "جرّب",
    "science",
    "learning-resource",
    "Science Fun",
    "science",
  ],
  [
    "Learn Anything",
    "تعلم أي شيء",
    "Learn anything you want in a simple way while enhancing yourself.",
    "يمكنك الآن تعلم أي شيء تريده بطريقة بسيطة، معززاً نفسك.",
    "https://learn-anything.xyz/",
    "Learn Now",
    "تعلم الآن",
    "study-learning",
    "learning-resource",
    "Learn Anything",
    "explore",
  ],
  [
    "Coding Practice",
    "تدريب البرمجة",
    "Improve your coding skills with interactive exercises and challenges in various programming languages.",
    "حسن مهاراتك البرمجية بتمارين وتحديات تفاعلية بلغات برمجة مختلفة.",
    "https://www.hackerrank.com/domains/tutorials/10-days-of-javascript",
    "Code Now",
    "برمج الآن",
    "programming",
    "practice",
    "HackerRank",
    "code",
  ],
  [
    "Memory Improvement",
    "تحسين الذاكرة",
    "Boost your memory skills with scientifically designed exercises and games.",
    "عزز مهارات الذاكرة لديك بتمارين وألعاب مصممة علمياً.",
    "https://www.memory-improvement-tips.com/free-memory-games.html",
    "Train Memory",
    "درب ذاكرتك",
    "study-learning",
    "practice",
    "Memory Improvement",
    "psychology",
  ],
  [
    "Study Helper",
    "مساعد الدراسة",
    "Boost your study skills with exercises and games. Get your teacher now.",
    "عزز مهاراتك الدراسية بتمارين وألعاب مصممة علمياً. احصل على معلمك الآن.",
    "https://ck12.co/cxBsKs",
    "Study Now",
    "ذاكر الآن",
    "study-learning",
    "learning-resource",
    "CK-12",
    "school",
  ],
];

export const skills: Skill[] = rawSkillRows.map(
  ([
    title,
    arTitle,
    description,
    arDescription,
    href,
    action,
    arAction,
    category,
    type,
    provider,
    icon,
  ]) => ({
    id: title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    title,
    arTitle,
    description,
    arDescription,
    href,
    action,
    arAction,
    category: category as SkillCategory,
    type: type as SkillType,
    provider,
    icon,
  }),
);
