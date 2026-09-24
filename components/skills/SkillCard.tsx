"use client";

import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { useSaveItemWithDetails } from "@/hooks";
import type { Skill } from "@/data/skills";
import styles from "@/app/skills/SkillsPage.module.scss";

const categoryLabels: Record<Skill["category"], { en: string; ar: string }> = {
  english: { en: "English", ar: "الإنجليزية" },
  programming: { en: "Programming", ar: "البرمجة" },
  "study-learning": { en: "Study & Learning", ar: "الدراسة والتعلم" },
  mathematics: { en: "Mathematics", ar: "الرياضيات" },
  science: { en: "Science", ar: "العلوم" },
  productivity: { en: "Productivity", ar: "الإنتاجية" },
  "tools-utility": { en: "Tools & Utility", ar: "الأدوات" },
};
const typeLabels: Record<Skill["type"], { en: string; ar: string }> = {
  assessment: { en: "Assessment", ar: "تقييم" },
  practice: { en: "Practice", ar: "تدريب" },
  "learning-resource": { en: "Learning Resource", ar: "مصدر تعليمي" },
  tool: { en: "Tool", ar: "أداة" },
};

export default function SkillCard({
  skill,
  language,
}: {
  skill: Skill;
  language: "en" | "ar";
}) {
  const arabic = language === "ar";
  const { saved, toggle } = useSaveItemWithDetails({
    id: skill.id,
    type: "skill",
    title: skill.title,
    description: skill.description,
    category: categoryLabels[skill.category].en,
    subcategory: typeLabels[skill.type].en,
    icon: skill.icon,
    href: skill.href,
  });
  const openSkill = () => {
    window.open(skill.href, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className={styles.skillCard}
      role="link"
      tabIndex={0}
      aria-label={arabic ? skill.arTitle : skill.title}
      onClick={openSkill}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openSkill();
        }
      }}
    >
      <div className={styles.skillCardTop}>
        <div className={styles.badges}>
          <span
            className={`${styles.categoryBadge} ${styles[`category_${skill.category}`]}`}
          >
            {arabic
              ? categoryLabels[skill.category].ar
              : categoryLabels[skill.category].en}
          </span>
          <span className={styles.typeBadge}>
            {arabic ? typeLabels[skill.type].ar : typeLabels[skill.type].en}
          </span>
        </div>
        <button
          type="button"
          className={`${styles.bookmarkButton} ${saved ? styles.bookmarkSaved : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            toggle();
          }}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved" : "Save skill"}
        >
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>
      <h3>{arabic ? skill.arTitle : skill.title}</h3>
      <p>{arabic ? skill.arDescription : skill.description}</p>
      <div className={styles.skillCardFooter}>
        <span className={styles.provider}>
          <span className="material-symbols-outlined">{skill.icon}</span>
          {skill.provider}
        </span>
        <a
          href={skill.href}
          target="_blank"
          rel="noreferrer"
          className={styles.skillAction}
          onClick={(event) => event.stopPropagation()}
        >
          {arabic ? skill.arAction : skill.action}
          <ExternalLink size={14} />
        </a>
      </div>
    </article>
  );
}
