"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  SubjectContent,
  SubjectHeader,
  SubjectNavigation,
} from "@/components/subjects";
import { getResourcesForSubject } from "@/data/catalog";
import { resources as allResources } from "@/data/resources";
import { subjects } from "@/data/subjects";
import { fetchDjangoSubject, type DjangoSubject } from "@/lib/django-api";
import styles from "./SubjectPage.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getTranslations } from "@/lib/i18n";

export default function SubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = use(params);
  const { language } = useLayoutState();
  const t = getTranslations(language);
  const searchParams = useSearchParams();
  const fallbackSubject = subjects.find(
    (item) =>
      item.id === subjectId || item.id.startsWith(`${subjectId}-grade-`),
  );
  const [djangoSubject, setDjangoSubject] = useState<DjangoSubject>();

  useEffect(() => {
    fetchDjangoSubject(subjectId)
      .then(setDjangoSubject)
      .catch(() => setDjangoSubject(undefined));
  }, [subjectId]);

  const subject = djangoSubject ?? fallbackSubject;
  const contentItems = subject?.content ?? [];
  const requestedUnit = searchParams.get("unit");
  const [selectedId, setSelectedId] = useState(
    requestedUnit ?? contentItems[0]?.id ?? "",
  );

  if (!subject) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h1>{t.subjects.detail.subjectNotFound}</h1>
          <Link href="/subjects">{t.subjects.detail.backToSubjects}</Link>
        </div>
      </div>
    );
  }

  const selectedItem =
    contentItems.find((item) => item.id === selectedId) ?? contentItems[0];

  return (
    <div className={styles.page} dir={language === "ar" ? "rtl" : "ltr"}>
      <SubjectHeader subject={subject} />
      <div className={styles.layout}>
        <SubjectNavigation
          items={contentItems}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <SubjectContent
          item={selectedItem}
          subjectId={subjectId}
          resources={
            djangoSubject?.resources?.length
              ? djangoSubject.resources
              : getResourcesForSubject(subject.id).length > 0
                ? getResourcesForSubject(subject.id)
                : allResources
          }
        />
      </div>
    </div>
  );
}
