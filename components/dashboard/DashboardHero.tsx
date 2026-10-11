import GradeSemesterSelector from "./GradeSemesterSelector";

import type { Grade, Semester } from "@/data/subjects";
import styles from "@/app/dashboard/dashborad.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { useTheme } from "@/components/ui/theme-provider";
import { getTranslations } from "@/lib/i18n";

type DashboardHeroProps = {
  grade: Grade;
  semester: Semester;
  onGradeChange: (grade: Grade) => void;
  onSemesterChange: (semester: Semester) => void;
};

export default function DashboardHero({
  grade,
  semester,
  onGradeChange,
  onSemesterChange,
}: DashboardHeroProps) {
  const { language } = useLayoutState();
  const { theme, resolvedTheme } = useTheme();
  const t = getTranslations(language);

  return (
    <section className={styles.hero}>
      {theme === "ramadan" && resolvedTheme === "dark" && (
        <svg
          className={styles.ramadanArt}
          viewBox="0 0 500 360"
          preserveAspectRatio="xMidYMax meet"
          fill="none"
          aria-hidden="true"
        >
          <path
            className={styles.moon}
            d="M385 42a37 37 0 1 0 28 58 41 41 0 1 1-28-58Z"
          />
          <path
            className={styles.star}
            d="m438 43 5 11 12 1-9 8 3 12-11-6-10 6 2-12-9-8 12-1 5-11Z"
          />
          <path
            className={styles.starSmall}
            d="m347 78 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1 3-7Z"
          />
          <path className={styles.skyline} d="M37 302h426v26H37z" />
          <path
            className={styles.mosque}
            d="M119 302v-42h31v-25h23v-19h20v-21c0-43 25-76 57-76s57 33 57 76v21h20v19h23v25h31v42h30v26H89v-26h30Z"
          />
          <path
            className={styles.mosqueDetail}
            d="M178 195h150M168 216h170M147 236h212"
          />
          <path
            className={styles.arch}
            d="M224 302v-45a29 29 0 0 1 58 0v45m-126 0v-22a12 12 0 0 1 24 0v22m142 0v-22a12 12 0 0 1 24 0v22"
          />
          <path
            className={styles.minaret}
            d="M93 302V179l-10-14 10-15 10 15-10 14m-14 123h28m-20-145h12m-14 40h16m-12-54v-14m220 173V199l-8-12 8-12 8 12-8 12m-12 103h24m-17-119h10m-12 37h14m-10-50v-13"
          />
          <path
            className={styles.window}
            d="M246 222v15m15-15v15m-15 20v15m15-15v15"
          />
          <path
            className={styles.lantern}
            d="M57 159v16m-8 0h16l5 8-5 8H49l-5-8 5-8Zm-5 17h26l4 30-17 16-17-16 4-30Zm0 9h26m-13-9v30m-13-21 13 30 13-30m-13 25v9"
          />
          <path
            className={styles.lantern}
            d="M414 130v20m-9 0h18l5 9-5 9h-18l-5-9 5-9Zm-4 20h26l4 33-17 17-17-17 4-33Zm0 10h26m-13-10v34m-13-24 13 34 13-34m-13 26v10"
          />
        </svg>
      )}
      <div className={styles.heroContent}>
        <GradeSemesterSelector
          grade={grade}
          semester={semester}
          onGradeChange={onGradeChange}
          onSemesterChange={onSemesterChange}
        />
        <h1>
          {t.dashboard.greeting} <span>{t.dashboard.greetingAccent}</span>
        </h1>
        <p>{t.dashboard.progress}</p>
      </div>
    </section>
  );
}
