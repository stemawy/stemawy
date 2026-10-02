"use client";

import { useEffect, useMemo, useState } from "react";

import SubjectFilters from "@/components/subjects/SubjectFilters";
import SubjectSection from "@/components/subjects/SubjectSection";
import { getSubjects } from "@/data/subjects";
import styles from "./subjects.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getLocalizedSubject, getTranslations } from "@/lib/i18n";
import { fetchDjangoSubjects } from "@/lib/django-api";
import type { Subject } from "@/data/subjects";

export default function SubjectsPage() {
  const { grade, semester, setGrade, setSemester, language } = useLayoutState();
  const t = getTranslations(language);
  const [query, setQuery] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>(() =>
    getSubjects(grade, semester),
  );

  useEffect(() => {
    let active = true;
    fetchDjangoSubjects(grade, semester).then((result) => {
      if (active) setSubjects(result);
    });
    return () => {
      active = false;
    };
  }, [grade, semester]);

  const filteredSubjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return subjects.filter((subject) => {
      const localized = getLocalizedSubject(subject, language);
      return (
        !normalizedQuery ||
        `${subject.name} ${subject.description} ${localized.name} ${localized.description}`
          .toLowerCase()
          .includes(normalizedQuery)
      );
    });
  }, [subjects, query, language]);

  const scienceAndMath = filteredSubjects.filter(
    (subject) => subject.category === "science",
  );
  const languages = filteredSubjects.filter(
    (subject) => subject.category === "languages",
  );
  const applied = filteredSubjects.filter(
    (subject) => subject.category === "computing",
  );
  const humanities = filteredSubjects.filter(
    (subject) => subject.category === "humanities",
  );

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>{t.subjects.title}</h1>
      </header>
      <SubjectFilters
        grade={grade}
        semester={semester}
        query={query}
        onGradeChange={setGrade}
        onSemesterChange={setSemester}
        onQueryChange={setQuery}
      />
      <div className={styles.sections} key={`${grade}-${semester}`}>
        {scienceAndMath.length > 0 && (
          <SubjectSection
            title={`${language === "ar" ? "العلوم والرياضيات" : "Science & Math"} - ${t.subjects.semester} ${semester}`}
            subjects={scienceAndMath}
            icon="science"
          />
        )}
        {languages.length > 0 && (
          <SubjectSection
            title={`${language === "ar" ? "اللغات" : "Languages"} - ${t.subjects.semester} ${semester}`}
            subjects={languages}
            icon="language"
          />
        )}
        {humanities.length > 0 && (
          <SubjectSection
            title={`${language === "ar" ? "العلوم الإنسانية والمجتمع" : "Humanities & Society"} - ${t.subjects.semester} ${semester}`}
            subjects={humanities}
            icon="humanities"
          />
        )}
        {applied.length > 0 && (
          <SubjectSection
            title={`${language === "ar" ? "الحوسبة والتطبيقات" : "Computing & Applied"} - ${t.subjects.semester} ${semester}`}
            subjects={applied}
            icon="computing"
          />
        )}
        {filteredSubjects.length === 0 && (
          <p className={styles.emptyState}>
            {language === "ar"
              ? "لا توجد مواد تطابق بحثك."
              : "No subjects match your search."}
          </p>
        )}
      </div>
    </div>
  );
}
