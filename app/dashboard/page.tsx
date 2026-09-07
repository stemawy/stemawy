"use client";

import DashboardHero from "@/components/dashboard/DashboardHero";
import JumpBackIn from "@/components/dashboard/JumpBackIn";
import CoreCurriculum from "@/components/dashboard/CoreCurriculum";
import Opportunities from "@/components/dashboard/Opportunities";
import AIAssistant from "@/components/dashboard/AIAssistant";
import { getSubjects } from "@/data/subjects";
import { fetchDjangoSubjects } from "@/lib/django-api";
import { useEffect, useState } from "react";
import { recentLearning } from "@/lib/storage";
import { opportunities } from "@/data/opportunities";
import { useLayoutState } from "@/components/layout/layout-context";
import styles from "./dashborad.module.scss";

export default function DashboardPage() {
  const { grade, semester, setGrade, setSemester } = useLayoutState();
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

  return (
    <div className={styles.dashboard}>
      <DashboardHero
        grade={grade}
        semester={semester}
        onGradeChange={setGrade}
        onSemesterChange={setSemester}
      />
      <JumpBackIn items={recentLearning} semester={semester} />
      <div className={styles.contentGrid}>
        <CoreCurriculum subjects={subjects} />
        <div className={styles.sideColumn}>
          <Opportunities items={opportunities} />
          <AIAssistant />
        </div>
      </div>
    </div>
  );
}
