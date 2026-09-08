"use client";

import { useRef, useEffect, useState } from "react";
import { GraduationCap, ChevronDown } from "lucide-react";

import type { Grade, Semester } from "@/data/subjects";
import styles from "@/app/dashboard/dashborad.module.scss";

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
        <span>Grade {grade}</span>
        <span aria-hidden="true">•</span>
        <span>Semester {semester}</span>
        <ChevronDown size={15} aria-hidden="true" className={styles.chevron} />
      </button>

      {isOpen && (
        <div className={styles.selectorPanel}>
          <div className={styles.selectorSection}>
            <h3>Select Grade</h3>
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
                  Grade {g}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.selectorSection}>
            <h3>Select Semester</h3>
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
                  Semester {s}
                </button>
              ))}
            </div>
          </div>

          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
