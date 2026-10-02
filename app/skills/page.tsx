"use client";

import { useEffect, useMemo, useState } from "react";
import { useLayoutState } from "@/components/layout/layout-context";
import { skills, type SkillCategory } from "@/data/skills";
import SkillsCategories from "@/components/skills/SkillsCategories";
import SkillsHeader from "@/components/skills/SkillsHeader";
import SkillsLibrary from "@/components/skills/SkillsLibrary";
import styles from "./SkillsPage.module.scss";
import { fetchDjangoSkills } from "@/lib/django-api";

export default function SkillsPage() {
  const { language } = useLayoutState();
  const [items, setItems] = useState(skills);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SkillCategory | "all">("all");

  useEffect(() => {
    let active = true;
    fetchDjangoSkills().then((result) => {
      if (active) setItems(result);
    });
    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(
    () =>
      items.reduce<Record<string, number>>((result, skill) => {
        result.all = (result.all ?? 0) + 1;
        result[skill.category] = (result[skill.category] ?? 0) + 1;
        return result;
      }, {}),
    [items],
  );

  const filteredSkills = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((skill) => {
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
  }, [category, items, query]);

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
          onChange={setCategory}
        />
        <SkillsLibrary
          language={language}
          skills={filteredSkills}
          onClear={clearFilters}
        />
      </div>
    </div>
  );
}
