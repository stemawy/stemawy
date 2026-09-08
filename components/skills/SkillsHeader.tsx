import SkillsSearch from "./SkillsSearch";
import styles from "@/app/skills/SkillsPage.module.scss";

export default function SkillsHeader({
  language,
  value,
  onChange,
}: {
  language: "en" | "ar";
  value: string;
  onChange: (value: string) => void;
}) {
  const arabic = language === "ar";
  return (
    <header className={styles.header}>
      <div className={styles.eyebrow}>
        <span className="material-symbols-outlined">psychology</span>
        <span>
          {arabic
            ? "مكتبة المهارات والأدوات العملية"
            : "Skills Library & Practical Tools"}
        </span>
        <span>/</span>
        <span>{arabic ? "مركز الاكتشاف" : "Discovery Hub"}</span>
      </div>
      <div className={styles.headingBlock}>
        <h1>{arabic ? "المهارات" : "Skills"}</h1>
        <p>
          {arabic
            ? "مهارات عملية مختارة وتمارين تفاعلية وتقييمات ومنصات خارجية لصقل تفكيرك التحليلي وكتابتك الأكاديمية واستعدادك للمسابقات."
            : "Curated practical abilities, interactive exercises, skill assessments, and external platforms designed to sharpen your analytical thinking, academic writing, and contest readiness."}
        </p>
      </div>
      <SkillsSearch language={language} value={value} onChange={onChange} />
    </header>
  );
}
