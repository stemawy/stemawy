"use client";

import { useMemo, useState } from "react";
import { useLayoutState } from "@/components/layout/layout-context";
import { skills, type SkillCategory } from "@/data/skills";
import SkillsCategories from "@/components/skills/SkillsCategories";
import SkillsHeader from "@/components/skills/SkillsHeader";
import SkillsLibrary from "@/components/skills/SkillsLibrary";
import styles from "./SkillsPage.module.scss";

export default function SkillsPage() {
  const { language } = useLayoutState();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SkillCategory | "all">("all");

  const counts = useMemo(
    () =>
      skills.reduce<Record<string, number>>((result, skill) => {
        result.all = (result.all ?? 0) + 1;
        result[skill.category] = (result[skill.category] ?? 0) + 1;
        return result;
      }, {}),
    [],
  );

  const filteredSkills = useMemo(() => {
    const term = query.trim().toLowerCase();
    return skills.filter((skill) => {
      const searchable = [
        skill.title,
        skill.arTitle,
        skill.description,
        skill.arDescription,
        skill.provider,
        skill.category,
        skill.type,
      ]
        .join(" ")
        .toLowerCase();
      return (
        (category === "all" || skill.category === category) &&
        searchable.includes(term)
      );
    });
  }, [category, query]);

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
  };

  return (
    <div className={styles.page} dir={language === "ar" ? "rtl" : "ltr"}>
      <div className={styles.container}>
        <SkillsHeader language={language} value={query} onChange={setQuery} />
        <SkillsCategories
          language={language}
          counts={counts}
          active={category}
          resultCount={filteredSkills.length}
          onChange={setCategory}
        />
        <SkillsLibrary
          language={language}
          skills={filteredSkills}
          totalCount={skills.length}
          onClear={clearFilters}
        />
      </div>
    </div>
  );
}
