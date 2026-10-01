"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  LayoutDashboard,
  Shuffle,
} from "lucide-react";
import { useState } from "react";

import { useLayoutState } from "./layout-context";
import styles from "./NotFoundTextOnly.module.scss";

export default function NotFoundExperience() {
  const { language } = useLayoutState();
  const router = useRouter();
  const arabic = language === "ar";
  const [destinationIndex, setDestinationIndex] = useState(0);
  const copy = arabic
    ? {
        eyebrow: "404 / الصفحة غير موجودة",
        heading: "يبدو أنك سلكت طريقًا خاطئًا.",
        description:
          "لم نتمكن من العثور على هذه الصفحة. لا بأس، هناك الكثير لاستكشافه.",
        dashboard: "العودة إلى لوحة التحكم",
        back: "الصفحة السابقة",
        destinations: "أماكن أخرى لاستكشافها",
        opportunities: "استكشف الفرص",
        subjects: "تصفح المواد",
        nextStop: "وجهتك التالية",
        shuffle: "اقترح مكانًا آخر",
      }
    : {
        eyebrow: "404 / PAGE NOT FOUND",
        heading: "Looks like you took a wrong turn.",
        description:
          "We couldn’t find that page. No worries, there’s plenty more to explore.",
        dashboard: "Go to dashboard",
        back: "Go back",
        destinations: "Other places to explore",
        opportunities: "Explore opportunities",
        subjects: "Browse subjects",
        nextStop: "YOUR NEXT STOP",
        shuffle: "Surprise me",
      };
  const destinations = [
    { href: "/dashboard", en: "Dashboard", ar: "لوحة التحكم" },
    { href: "/opportunities", en: "Opportunities", ar: "الفرص" },
    { href: "/subjects", en: "Subjects", ar: "المواد" },
    { href: "/skills", en: "Skills", ar: "المهارات" },
  ];
  const suggestedDestination = destinations[destinationIndex];

  const goBack = () => {
    if (
      window.history.length > 1 &&
      document.referrer.startsWith(window.location.origin)
    ) {
      router.back();
      return;
    }
    router.push("/dashboard");
  };

  return (
    <section
      className={styles.page}
      dir={arabic ? "rtl" : "ltr"}
      aria-labelledby="not-found-title"
    >
      <div className={styles.stage}>
        <div className={styles.message}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" />
            {copy.eyebrow}
          </p>
          <p className={styles.errorNumber} aria-hidden="true">
            4<span>0</span>4
          </p>
          <h1 id="not-found-title">{copy.heading}</h1>
          <p className={styles.description}>{copy.description}</p>

          <div className={styles.actions}>
            <Link className={styles.homeButton} href="/dashboard">
              <LayoutDashboard size={18} aria-hidden="true" />
              {copy.dashboard}
            </Link>
            <button
              className={styles.backButton}
              type="button"
              onClick={goBack}
            >
              {arabic ? (
                <ArrowRight size={17} aria-hidden="true" />
              ) : (
                <ArrowLeft size={17} aria-hidden="true" />
              )}
              {copy.back}
            </button>
          </div>

          <nav className={styles.destinations} aria-label={copy.destinations}>
            <p>{copy.destinations}</p>
            <div>
              <Link href="/opportunities">
                {copy.opportunities}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/subjects">
                {copy.subjects}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <div className={styles.suggestion}>
              <div aria-live="polite">
                <span>{copy.nextStop}</span>
                <Link href={suggestedDestination.href}>
                  {arabic ? suggestedDestination.ar : suggestedDestination.en}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
              <button
                className={styles.shuffleButton}
                type="button"
                aria-label={copy.shuffle}
                title={copy.shuffle}
                onClick={() =>
                  setDestinationIndex(
                    (current) => (current + 1) % destinations.length,
                  )
                }
              >
                <Shuffle size={16} aria-hidden="true" />
                <span>{copy.shuffle}</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
}
