export type Language = "en" | "ar";

export const translations = {
  en: {
    nav: {
      dashboard: "Dashboard",
      subjects: "Subjects",
      skills: "Skills",
      opportunities: "Opportunities",
      saved: "Saved",
      settings: "Settings",
    },
    common: {
      closeNavigation: "Close navigation",
      openNavigation: "Open navigation",
      expandNavigation: "Expand navigation",
      collapseNavigation: "Collapse navigation",
      searchStemawy: "Search Stemawy",
      searchPlaceholder: "Search Stemawy... (Ctrl+K)",
      controlK: "Control K shortcut",
      notifications: "Notifications",
      notificationsEmpty: "No new notifications",
      closeNotifications: "Close notifications",
      openProfile: "Open student profile",
      student: "Student",
      localProfile: "Local Profile",
      language: "Language",
      languageDescription:
        "Switch between English and full Arabic localized layout",
      english: "English",
      arabic: "Arabic",
      rtl: "RTL",
      languageSwitchedArabic: "Language switched to Arabic (RTL)",
      languageSwitchedEnglish: "Language switched to English",
    },
    footer: {
      builtFor: "Built for High-Performance Academic Empowerment.",
      about: "About",
      help: "Help & Feedback",
      suggest: "Suggest a Resource",
      navigation: "Footer navigation",
    },
    dashboard: {
      greeting: "Good Morning!",
      greetingAccent: "Ready to learn?",
      progress:
        "Your progress is saved locally. Continue your journey in Physics and Mathematics today.",
      curriculum: "Core Curriculum",
      currentSelection: "Current selection",
      viewAll: "View All",
      units: "Units",
      selectGrade: "Select Grade",
      selectSemester: "Select Semester",
      done: "Done",
      recentlySaved: "Recently Saved",
      noSavedItems: "No saved items yet",
      noSavedDescription:
        "Start saving resources, subjects, opportunities, and skills to keep them handy.",
      opportunities: "Opportunities",
      findOpportunities: "Find Opportunities",
      askAi: "Ask Stemawy AI",
      aiDescription: "Stuck on a problem? Let's figure it out together.",
      aiPlaceholder: "Explain photosynthesis...",
      sendQuestion: "Send question",
      savedTypes: {
        resource: "Resource",
        subject: "Subject",
        opportunity: "Opportunity",
        skill: "Skill",
      },
    },
    subjects: {
      title: "Subjects",
      chooseGrade: "Choose grade",
      chooseSemester: "Choose semester",
      searchPlaceholder: "Search subjects or topics...",
      semester: "Semester",
      viewCourse: "View Course",
      names: {
        Physics: "Physics",
        Chemistry: "Chemistry",
        Biology: "Biology",
        Geology: "Geology",
        Maths: "Maths",
        Mechanics: "Mechanics",
        Arabic: "Arabic",
        English: "English",
        German: "German",
        French: "French",
        "Computer Science": "Computer Science",
        Religion: "Religion",
        "Social Studies": "Social Studies",
        Civics: "Civics",
        Capstone: "Capstone",
      },
      descriptions: {
        Physics: "Explore the fundamental laws governing matter and energy.",
        Chemistry: "Matter, reactions, and atomic structure.",
        Biology: "Living systems and biological processes.",
        Geology: "Earth systems and minerals.",
        Maths: "Algebra, geometry, and trigonometry.",
        Mechanics: "Motion, forces, and physical systems.",
        Arabic: "Classical literature and expression.",
        English: "Literature and composition.",
        German: "Language, culture, and communication.",
        French: "Language, culture, and communication.",
        "Computer Science": "Computational thinking and programming.",
        Religion: "Values, faith, and thoughtful reflection.",
        "Social Studies": "Modern world history and society.",
        Civics: "Modern world history and society.",
        Capstone: "Interdisciplinary research and creative projects.",
      },
      detail: {
        breadcrumb: "Subjects",
        coreSubject: "Core Subject",
        contents: "Contents",
        subjectNotFound: "Subject not found",
        backToSubjects: "Back to Subjects",
        unitResources: "Unit Resources",
        resourcesMaterials: "Resources & Materials",
        concepts: "Concepts",
        suggestResource: "Suggest a Resource",
        savedUnit: "Saved Unit",
        saveUnit: "Save Unit",
        markResourceFinished: "Right-click to mark as finished",
        markResourceUnfinished: "Right-click to mark as not finished",
        resource: "Resource",
        resources: "Resources",
        noResources: "No resources yet",
        comingSoonUnit: "Resources for this unit are coming soon.",
        comingSoonMaterials: "Materials for this topic are coming soon.",
        learningObject: "Learning object",
      },
    },
    settings: {
      title: "Settings",
      breadcrumbHome: "Stemawy",
      subtitle: "Preferences and local browser cache",
      interface: "Interface",
      academicContext: "Academic Context",
      dataStorage: "Data & Storage",
      appearance: "Appearance",
      appearanceDescription:
        "Choose light, dark, or follow your system setting",
      theme: "Theme style",
      themeDescription:
        "Choose the visual style. Each style adapts to your appearance setting.",
      light: "Light",
      dark: "Dark",
      ramadan: "Ramadan",
      christmas: "Christmas",
      defaultTheme: "Default",
      auto: "Auto",
      themeSwitched: "Theme switched to",
      currentGrade: "Current Grade",
      gradeDescription:
        "Switches syllabus units, active Capstone challenges, and relevant past papers for Grade 10 and Grade 11.",
      grade: "Grade",
      defaultSemester: "Default Semester",
      semesterDescription:
        "Your preferred semester for dashboards and curriculum views.",
      semester: "Semester",
      savedContent: "Saved Content",
      savedContentDescription: "Remove saved units and resources",
      completedResources: "Completed Resources",
      completedResourcesDescription: "Clear resources marked as finished",
      factoryReset: "Factory Reset",
      factoryResetDescription: "Purge all browser data and reset defaults",
      clear: "Clear",
      reset: "Reset",
      resetAllData: "Reset All Data?",
      resetDescription:
        "This will permanently clear all saved content, completed-resource progress, recent searches, and other local data. It will reset the theme to Default, appearance to Auto, and language to English.",
      closeReset: "Close reset dialog",
      cancel: "Cancel",
      confirmReset: "Confirm Reset",
      savedCleared: "Saved content cleared",
      clearSavedTitle: "Clear saved content?",
      clearSavedConfirmation: (count: number) =>
        count === 1
          ? "You have 1 saved item. Are you sure you want to clear it?"
          : `You have ${count} saved items. Are you sure you want to clear them?`,
      noSavedContentToClear: "You don't have any saved content to clear.",
      closeClearSaved: "Close clear saved dialog",
      completedResourcesCleared: "Completed resources cleared",
      clearCompletedResourcesTitle: "Clear completed resources?",
      clearCompletedResourcesConfirmation: (count: number) =>
        count === 1
          ? "You have 1 completed resource. Are you sure you want to clear it?"
          : `You have ${count} completed resources. Are you sure you want to clear them?`,
      noCompletedResourcesToClear:
        "You don't have any completed resources to clear.",
      closeClearCompletedResources: "Close clear completed resources dialog",
      gradeChanged: "Active grade set to",
      semesterChanged: "Default semester set to",
      resetComplete: "All local data and preferences were reset",
    },
  },
  ar: {
    nav: {
      dashboard: "لوحة التحكم",
      subjects: "المواد",
      skills: "المهارات",
      opportunities: "الفرص",
      saved: "المحفوظات",
      settings: "الإعدادات",
    },
    common: {
      closeNavigation: "إغلاق القائمة",
      openNavigation: "فتح القائمة",
      expandNavigation: "توسيع القائمة",
      collapseNavigation: "طي القائمة",
      searchStemawy: "البحث في ستماوي",
      searchPlaceholder: "البحث في ستماوي... (Ctrl+K)",
      controlK: "اختصار Control K",
      notifications: "الإشعارات",
      notificationsEmpty: "لا توجد إشعارات جديدة",
      closeNotifications: "إغلاق الإشعارات",
      openProfile: "فتح ملف الطالب",
      student: "الطالب",
      localProfile: "الملف المحلي",
      language: "اللغة",
      languageDescription: "التبديل بين الإنجليزية وواجهة عربية كاملة",
      english: "الإنجليزية",
      arabic: "العربية",
      rtl: "من اليمين إلى اليسار",
      languageSwitchedArabic: "تم التبديل إلى العربية",
      languageSwitchedEnglish: "تم التبديل إلى الإنجليزية",
    },
    footer: {
      builtFor: "مصمم للتمكين الأكاديمي عالي الأداء.",
      about: "حول ستماوي",
      help: "المساعدة والملاحظات",
      suggest: "اقتراح مورد",
      navigation: "روابط التذييل",
    },
    dashboard: {
      greeting: "صباح الخير!",
      greetingAccent: "هل أنت مستعد للتعلم؟",
      progress:
        "يتم حفظ تقدمك محليًا. واصل رحلتك اليوم في الفيزياء والرياضيات.",
      curriculum: "المنهج الأساسي",
      currentSelection: "الاختيار الحالي",
      viewAll: "عرض الكل",
      units: "وحدات",
      selectGrade: "اختر الصف",
      selectSemester: "اختر الفصل الدراسي",
      done: "تم",
      recentlySaved: "المحفوظات حديثًا",
      noSavedItems: "لا توجد عناصر محفوظة بعد",
      noSavedDescription:
        "ابدأ بحفظ الموارد والمواد والفرص والمهارات للعودة إليها بسهولة.",
      opportunities: "الفرص",
      findOpportunities: "استكشف الفرص",
      askAi: "اسأل ستماوي الذكي",
      aiDescription: "هل تواجه مشكلة؟ لنحلها معًا.",
      aiPlaceholder: "اشرح عملية البناء الضوئي...",
      sendQuestion: "إرسال السؤال",
      savedTypes: {
        resource: "مورد",
        subject: "مادة",
        opportunity: "فرصة",
        skill: "مهارة",
      },
    },
    subjects: {
      title: "المواد الدراسية",
      chooseGrade: "اختر الصف",
      chooseSemester: "اختر الفصل الدراسي",
      searchPlaceholder: "ابحث عن المواد أو المواضيع...",
      semester: "الفصل الدراسي",
      viewCourse: "عرض المقرر",
      names: {
        Physics: "الفيزياء",
        Chemistry: "الكيمياء",
        Biology: "الأحياء",
        Geology: "الجيولوجيا",
        Maths: "الرياضيات",
        Mechanics: "الميكانيكا",
        Arabic: "اللغة العربية",
        English: "اللغة الإنجليزية",
        German: "اللغة الألمانية",
        French: "اللغة الفرنسية",
        "Computer Science": "علوم الحاسوب",
        Religion: "التربية الدينية",
        "Social Studies": "الدراسات الاجتماعية",
        Civics: "التربية الوطنية",
        Capstone: "المشروع التطبيقي",
      },
      descriptions: {
        Physics: "استكشف القوانين الأساسية التي تحكم المادة والطاقة.",
        Chemistry: "المادة والتفاعلات والبنية الذرية.",
        Biology: "الأنظمة الحية والعمليات البيولوجية.",
        Geology: "أنظمة الأرض والمعادن.",
        Maths: "الجبر والهندسة وعلم المثلثات.",
        Mechanics: "الحركة والقوى والأنظمة الفيزيائية.",
        Arabic: "الأدب العربي والتعبير.",
        English: "الأدب والإنشاء.",
        German: "اللغة والثقافة والتواصل.",
        French: "اللغة والثقافة والتواصل.",
        "Computer Science": "التفكير الحاسوبي والبرمجة.",
        Religion: "القيم والإيمان والتأمل الواعي.",
        "Social Studies": "تاريخ العالم الحديث والمجتمع.",
        Civics: "تاريخ العالم الحديث والمجتمع.",
        Capstone: "أبحاث ومشاريع إبداعية متعددة التخصصات.",
      },
      detail: {
        breadcrumb: "المواد الدراسية",
        coreSubject: "مادة أساسية",
        contents: "المحتويات",
        subjectNotFound: "المادة غير موجودة",
        backToSubjects: "العودة إلى المواد الدراسية",
        unitResources: "موارد الوحدة",
        resourcesMaterials: "الموارد والمواد",
        concepts: "المفاهيم",
        suggestResource: "اقتراح مورد",
        savedUnit: "الوحدة محفوظة",
        saveUnit: "حفظ الوحدة",
        markResourceFinished: "انقر بزر الفأرة الأيمن لتحديده كمكتمل",
        markResourceUnfinished: "انقر بزر الفأرة الأيمن لإلغاء تحديده كمكتمل",
        resource: "مورد",
        resources: "موارد",
        noResources: "لا توجد موارد بعد",
        comingSoonUnit: "ستتوفر موارد هذه الوحدة قريبًا.",
        comingSoonMaterials: "ستتوفر مواد هذا الموضوع قريبًا.",
        learningObject: "عنصر تعليمي",
      },
    },
    settings: {
      title: "الإعدادات",
      breadcrumbHome: "ستماوي",
      subtitle: "التفضيلات وذاكرة المتصفح المحلية",
      interface: "الواجهة",
      academicContext: "السياق الأكاديمي",
      dataStorage: "البيانات والتخزين",
      appearance: "نمط العرض",
      appearanceDescription:
        "اختر المظهر الفاتح أو الداكن أو اتبع إعداد النظام",
      theme: "نمط الواجهة",
      themeDescription:
        "اختر النمط المرئي، وسيتكيف كل نمط مع إعداد العرض الذي اخترته.",
      light: "فاتح",
      dark: "داكن",
      ramadan: "رمضان",
      christmas: "عيد الميلاد",
      defaultTheme: "الافتراضي",
      auto: "تلقائي",
      themeSwitched: "تم تغيير المظهر إلى",
      currentGrade: "الصف الحالي",
      gradeDescription:
        "يغيّر وحدات المنهج وتحديات المشروع والأوراق السابقة المناسبة للصفين العاشر والحادي عشر.",
      grade: "الصف",
      defaultSemester: "الفصل الافتراضي",
      semesterDescription: "الفصل المفضل لديك للوحات التحكم وعروض المنهج.",
      semester: "الفصل الدراسي",
      savedContent: "المحتوى المحفوظ",
      savedContentDescription: "إزالة الوحدات والموارد المحفوظة",
      completedResources: "الموارد المكتملة",
      completedResourcesDescription: "مسح الموارد التي تم تحديدها كمكتملة",
      factoryReset: "إعادة ضبط المصنع",
      factoryResetDescription:
        "حذف جميع بيانات المتصفح وإعادة التفضيلات الافتراضية",
      clear: "مسح",
      reset: "إعادة ضبط",
      resetAllData: "إعادة ضبط جميع البيانات؟",
      resetDescription:
        "سيؤدي هذا إلى مسح كل المحتوى المحفوظ وتقدم إكمال الموارد وعمليات البحث الأخيرة والبيانات المحلية الأخرى نهائيًا. ستتم إعادة النمط إلى الافتراضي، والمظهر إلى تلقائي، واللغة إلى الإنجليزية.",
      closeReset: "إغلاق نافذة إعادة الضبط",
      cancel: "إلغاء",
      confirmReset: "تأكيد إعادة الضبط",
      savedCleared: "تم مسح المحتوى المحفوظ",
      clearSavedTitle: "مسح المحتوى المحفوظ؟",
      clearSavedConfirmation: (count: number) =>
        `لديك ${count} من العناصر المحفوظة. هل تريد مسحها؟`,
      noSavedContentToClear: "لا يوجد محتوى محفوظ لمسحه.",
      closeClearSaved: "إغلاق نافذة مسح المحتوى المحفوظ",
      completedResourcesCleared: "تم مسح الموارد المكتملة",
      clearCompletedResourcesTitle: "مسح الموارد المكتملة؟",
      clearCompletedResourcesConfirmation: (count: number) =>
        `لديك ${count} من الموارد المكتملة. هل تريد مسحها؟`,
      noCompletedResourcesToClear: "لا توجد موارد مكتملة لمسحها.",
      closeClearCompletedResources: "إغلاق نافذة مسح الموارد المكتملة",
      gradeChanged: "تم تعيين الصف الحالي إلى",
      semesterChanged: "تم تعيين الفصل الافتراضي إلى",
      resetComplete:
        "تمت إعادة ضبط كل شيء: النمط الافتراضي، والمظهر التلقائي، واللغة الإنجليزية.",
    },
  },
} as const;

export function getTranslations(language: Language) {
  return translations[language];
}

export function getLocalizedSubject(
  subject: { name: string; description: string },
  language: Language,
) {
  const localized = translations[language].subjects;
  return {
    name:
      localized.names[subject.name as keyof typeof localized.names] ??
      subject.name,
    description:
      localized.descriptions[
        subject.name as keyof typeof localized.descriptions
      ] ?? subject.description,
  };
}

const contentTranslations = {
  ar: {
    "Classical Mechanics": "الميكانيكا الكلاسيكية",
    "Motion, forces, and Newton's Laws of Motion in one and two dimensions with vectors and equilibrium systems.":
      "الحركة والقوى وقوانين نيوتن للحركة في بُعدين مع المتجهات وأنظمة الاتزان.",
    "Work, Energy & Power": "الشغل والطاقة والقدرة",
    "Thermal Physics": "الفيزياء الحرارية",
    "Waves and Sound": "الموجات والصوت",
    Electricity: "الكهرباء",
    Magnetism: "المغناطيسية",
    "Modern Physics": "الفيزياء الحديثة",
    "Question Bank": "بنك الأسئلة",
    Revision: "المراجعة",
    References: "المراجع",
    "Motion in One Dimension": "الحركة في بُعد واحد",
    "Position, displacement, velocity, acceleration, and kinematic equations.":
      "الموضع والإزاحة والسرعة والتسارع ومعادلات الحركة.",
    "Inertia, F=ma, action-reaction pairs, and free body diagrams with inclined planes.":
      "القصور الذاتي و F=ma وأزواج الفعل ورد الفعل ومخططات الجسم الحر على المستويات المائلة.",
    "Centripetal force, angular velocity, and orbital mechanics.":
      "القوة المركزية والسرعة الزاوية وميكانيكا المدارات.",
    "Static and kinetic coefficients, terminal velocity, and practical applications.":
      "معاملات الاحتكاك الساكن والحركي والسرعة النهائية والتطبيقات العملية.",
    "Understand how forces transfer energy and how power measures the rate of doing work.":
      "افهم كيف تنقل القوى الطاقة وكيف تقيس القدرة معدل بذل الشغل.",
    "Temperature, heat, internal energy, and the laws governing thermal systems.":
      "درجة الحرارة والحرارة والطاقة الداخلية والقوانين التي تحكم الأنظمة الحرارية.",
    "Explore oscillations, wave behavior, and the physics of sound.":
      "استكشف الاهتزازات وسلوك الموجات وفيزياء الصوت.",
    "Electric charge, current, potential difference, resistance, and circuits.":
      "الشحنة الكهربائية والتيار وفرق الجهد والمقاومة والدوائر الكهربائية.",
    "Magnetic fields, forces, and electromagnetic interactions.":
      "المجالات والقوى المغناطيسية والتفاعلات الكهرومغناطيسية.",
    "An introduction to relativity, quantum ideas, and the structure of matter.":
      "مقدمة في النسبية والأفكار الكمية وبنية المادة.",
    "Mechanics overview": "نظرة عامة على الميكانيكا",
    "Unit 1 Formula Sheet": "ورقة قوانين الوحدة الأولى",
    "Kinematics slides": "شرائح الحركة",
    "Work and energy practice": "تدريبات الشغل والطاقة",
    "Physics practice questions": "أسئلة تدريبية في الفيزياء",
    "Semester 1 mock exam": "اختبار تجريبي للفصل الدراسي الأول",
    "Full semester revision guide": "دليل مراجعة الفصل الدراسي الكامل",
    "Physics reference handbook": "دليل مراجع الفيزياء",
  },
} as const;

export function getLocalizedContentText(text: string, language: Language) {
  if (language === "en") return text;
  const translated =
    contentTranslations.ar[text as keyof typeof contentTranslations.ar];
  if (translated) return translated;

  const foundationsMatch = text.match(
    /^Build confidence with the essential ideas and applications from (.+)\.$/,
  );
  if (foundationsMatch) {
    return `ابنِ ثقتك بالمفاهيم والتطبيقات الأساسية في ${foundationsMatch[1]}.`;
  }

  return text;
}

export function getLocalizedContentType(
  type: "unit" | "qs-bank" | "revision" | "references",
  language: Language,
) {
  if (language === "en") {
    return type === "unit"
      ? "Unit"
      : type === "qs-bank"
        ? "Question Bank"
        : type[0].toUpperCase() + type.slice(1);
  }

  return type === "unit"
    ? "وحدة"
    : type === "qs-bank"
      ? "بنك الأسئلة"
      : type === "revision"
        ? "المراجعة"
        : "المراجع";
}
