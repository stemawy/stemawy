"use client";

import { useRef, useEffect, useState } from "react";
import { GraduationCap, ChevronDown } from "lucide-react";

import type { Grade, Semester } from "@/data/subjects";
import styles from "@/app/dashboard/dashborad.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getTranslations } from "@/lib/i18n";

type SelectorProps = {
  grade: Grade;
  semester: Semester;
  onGradeChange: (grade: Grade) => void;
  onSemesterChange: (semester: Semester) => void;
};

export default function GradeSemesterSelector({
  grade,
  semester,
  onGradeChange,
  onSemesterChange,
}: SelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLayoutState();
  const t = getTranslations(language);
  const containerRef = useRef<HTMLDivElement>(null);

  const grades: Grade[] = [10, 11];
  const semesters: Semester[] = [1, 2];

  // Close selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.gradeSemesterContainer}
      data-open={isOpen}
    >
      <button
        className={styles.selectorButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <GraduationCap size={17} />
        <span>{language === "ar" ? `الصف ${grade}` : `Grade ${grade}`}</span>
        <span aria-hidden="true">•</span>
        <span>
          {language === "ar"
            ? `${t.subjects.semester} ${semester}`
            : `Semester ${semester}`}
        </span>
        <ChevronDown size={15} aria-hidden="true" className={styles.chevron} />
      </button>

      {isOpen && (
        <div className={styles.selectorPanel}>
          <div className={styles.selectorSection}>
            <h3>{t.dashboard.selectGrade}</h3>
            <div className={styles.buttonGroup}>
              {grades.map((g) => (
                <button
                  key={g}
                  className={styles.optionButton}
                  data-selected={g === grade}
                  onClick={() => {
                    onGradeChange(g);
                  }}
                >
                  {language === "ar" ? `الصف ${g}` : `Grade ${g}`}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.selectorSection}>
            <h3>{t.dashboard.selectSemester}</h3>
            <div className={styles.buttonGroup}>
              {semesters.map((s) => (
                <button
                  key={s}
                  className={styles.optionButton}
                  data-selected={s === semester}
                  onClick={() => {
                    onSemesterChange(s);
                  }}
                >
                  {language === "ar"
                    ? `${t.subjects.semester} ${s}`
                    : `Semester ${s}`}
                </button>
              ))}
            </div>
          </div>

          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
          >
            {t.dashboard.done}
          </button>
        </div>
      )}
    </div>
  );
}
