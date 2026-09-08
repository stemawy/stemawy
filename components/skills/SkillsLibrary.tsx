import type { Skill } from "@/data/skills";
import SkillCard from "./SkillCard";
import styles from "@/app/skills/SkillsPage.module.scss";

export default function SkillsLibrary({
  skills,
  totalCount,
  language,
  onClear,
}: {
  skills: Skill[];
  totalCount: number;
  language: "en" | "ar";
  onClear: () => void;
}) {
  const arabic = language === "ar";
  return (
    <section className={styles.library}>
      <div className={styles.libraryHeader}>
        <div>
          <h2>{arabic ? "كل المهارات" : "All Skills"}</h2>
          <p>
            {arabic
              ? "تصفح دليلاً كاملاً من الوحدات العملية والمحاكاة والأدوات."
              : "Browse a full directory of practical modules, exercises, and utilities."}
          </p>
        </div>
        <div className={styles.libraryCount}>
          <span className="material-symbols-outlined">view_agenda</span>
          {arabic
            ? `${skills.length} من ${totalCount}`
            : `${skills.length} of ${totalCount} resources`}
        </div>
      </div>
      {skills.length ? (
        <div className={styles.grid}>
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} language={language} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span className="material-symbols-outlined">search_off</span>
          <h3>{arabic ? "لم يتم العثور على مهارات" : "No skills found"}</h3>
          <p>
            {arabic
              ? "جرّب البحث بكلمات مختلفة أو اعرض كل المهارات."
              : "Try adjusting your query or category."}
          </p>
          <button type="button" onClick={onClear}>
            {arabic ? "عرض الكل" : "Clear Filters"}
          </button>
        </div>
      )}
    </section>
  );
}
