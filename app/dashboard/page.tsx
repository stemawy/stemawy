"use client";

import { useEffect, useState } from "react";

import DashboardHero from "@/components/dashboard/DashboardHero";
import RecentlySaved from "@/components/dashboard/RecentlySaved";
import CoreCurriculum from "@/components/dashboard/CoreCurriculum";
import Opportunities from "@/components/dashboard/Opportunities";
import { getSubjects } from "@/data/subjects";
import type { Opportunity } from "@/data/opportunities";
import { opportunities as allOpportunities } from "@/data/opportunities";
import { useLayoutState } from "@/components/layout/layout-context";
import styles from "./dashborad.module.scss";
import {
  fetchDjangoOpportunities,
  fetchDjangoSubjects,
} from "@/lib/django-api";

// Helper function to parse deadline and get the nearest upcoming opportunities
function getUpcomingOpportunities(
  items: Opportunity[],
  limit: number = 3,
): Opportunity[] {
  // Opportunities with deadlines sorted by nearest deadline
  const withDeadline = items
    .filter((item) => item.deadline)
    .sort((a, b) => {
      const dateA = new Date(a.deadline!).getTime();
      const dateB = new Date(b.deadline!).getTime();
      return dateA - dateB;
    });

  // If we have enough with deadlines, return those
  if (withDeadline.length >= limit) {
    return withDeadline.slice(0, limit);
  }

  // Otherwise, add opportunities without deadlines to fill the limit
  const withoutDeadline = items.filter((item) => !item.deadline);
  return [...withDeadline, ...withoutDeadline].slice(0, limit);
}

export default function DashboardPage() {
  const { grade, semester, setGrade, setSemester } = useLayoutState();
  const [subjects, setSubjects] = useState(() => getSubjects(grade, semester));
  const [topOpportunities, setTopOpportunities] = useState(() =>
    getUpcomingOpportunities(allOpportunities, 3),
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

  useEffect(() => {
    let active = true;
    fetchDjangoOpportunities().then((result) => {
      if (active) setTopOpportunities(getUpcomingOpportunities(result, 3));
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={styles.dashboard}>
      <DashboardHero
        grade={grade}
        semester={semester}
        onGradeChange={setGrade}
        onSemesterChange={setSemester}
      />
      <RecentlySaved />
      <div className={styles.contentGrid}>
        <CoreCurriculum subjects={subjects} grade={grade} semester={semester} />
        <div className={styles.sideColumn}>
          <Opportunities items={topOpportunities} />
        </div>
      </div>
    </div>
  );
}
