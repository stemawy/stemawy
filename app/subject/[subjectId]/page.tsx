"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

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

export default function SubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = use(params);
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
  const [selectedId, setSelectedId] = useState(contentItems[0]?.id ?? "");

  if (!subject) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h1>Subject not found</h1>
          <Link href="/subjects">Back to Subjects</Link>
        </div>
      </div>
    );
  }

  const selectedItem =
    contentItems.find((item) => item.id === selectedId) ?? contentItems[0];

  return (
    <div className={styles.page}>
      <SubjectHeader subject={subject} />
      <div className={styles.layout}>
        <SubjectNavigation
          items={contentItems}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <SubjectContent
          item={selectedItem}
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
