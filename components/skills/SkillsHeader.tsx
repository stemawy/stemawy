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
      <div className={styles.headingBlock}>
        <h1>{arabic ? "المهارات" : "Skills"}</h1>
      </div>
      <SkillsSearch language={language} value={value} onChange={onChange} />
    </header>
  );
}
