"use client";

import { useEffect, useMemo, useState } from "react";

import SubjectFilters from "@/components/subjects/SubjectFilters";
import SubjectSection from "@/components/subjects/SubjectSection";
import { getSubjects } from "@/data/subjects";
import { fetchDjangoSubjects } from "@/lib/django-api";
import styles from "./subjects.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";

export default function SubjectsPage() {
  const { grade, semester, setGrade, setSemester } = useLayoutState();
  const [query, setQuery] = useState("");
  const [subjects, setSubjects] = useState(() => getSubjects(grade, semester));

  useEffect(() => {
    let active = true;

    fetchDjangoSubjects(grade, semester)
      .then((nextSubjects) => {
        if (active) {
          setSubjects(nextSubjects);
        }
      })
      .catch(() => {
        if (active) {
          setSubjects(getSubjects(grade, semester));
        }
      });

    return () => {
      active = false;
    };
  }, [grade, semester]);

  const filteredSubjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return subjects.filter(
      (subject) =>
        !normalizedQuery ||
        `${subject.name} ${subject.description}`
          .toLowerCase()
          .includes(normalizedQuery),
    );
  }, [subjects, query]);

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
        <h1>Subjects</h1>
      </header>
      <SubjectFilters
        grade={grade}
        semester={semester}
        query={query}
        onGradeChange={setGrade}
        onSemesterChange={setSemester}
        onQueryChange={setQuery}
      />
      <div className={styles.sections}>
        {scienceAndMath.length > 0 && (
          <SubjectSection
            title={`Science & Math - Semester ${semester}`}
            subjects={scienceAndMath}
            icon="science"
          />
        )}
        {languages.length > 0 && (
          <SubjectSection
            title={`Languages - Semester ${semester}`}
            subjects={languages}
            icon="language"
          />
        )}
        {humanities.length > 0 && (
          <SubjectSection
            title={`Humanities & Society - Semester ${semester}`}
            subjects={humanities}
            icon="humanities"
          />
        )}
        {applied.length > 0 && (
          <SubjectSection
            title={`Computing & Applied - Semester ${semester}`}
            subjects={applied}
            icon="computing"
          />
        )}
        {filteredSubjects.length === 0 && (
          <p className={styles.emptyState}>No subjects match your search.</p>
        )}
      </div>
    </div>
  );
}
