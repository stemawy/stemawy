import type { Skill } from "@/data/skills";
import SkillCard from "./SkillCard";
import styles from "@/app/skills/SkillsPage.module.scss";

export default function SkillsLibrary({
  skills,
  language,
  onClear,
}: {
  skills: Skill[];
  language: "en" | "ar";
  onClear: () => void;
}) {
  const arabic = language === "ar";
  return (
    <section className={styles.library}>
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
