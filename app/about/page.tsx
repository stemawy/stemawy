"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Lightbulb,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { useLayoutState } from "@/components/layout/layout-context";
import type { Language } from "@/lib/i18n";
import styles from "./about.module.scss";

type AboutCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  whyTitle: string;
  whyBody: string;
  audienceTitle: string;
  audienceBody: string;
  grades: { label: string; note?: string }[];
  offeringsLabel: string;
  offeringsTitle: string;
  offerings: { title: string; body: string; href: string }[];
  approachLabel: string;
  approachTitle: string;
  approach: { title: string; body: string }[];
  faqLabel: string;
  faqTitle: string;
  faqs: { question: string; answer: string }[];
  contactTitle: string;
  contactBody: string;
  contactEmails: string[];
  contactAction: string;
};

const copy = {
  en: {
    eyebrow: "About us",
    title: "About Stemawy",
    intro:
      "Stemawy makes finding high-school STEM resources easier. It brings curriculum materials and learning resources together in one place, completely free to use.",
    whyTitle: "Why Stemawy was created",
    whyBody:
      "Useful STEM learning resources can be scattered across subjects, units, notes, and links. Stemawy was made to make that search simpler, keep resources close to what students are studying, and make them available to high-school students for free.",
    audienceTitle: "Who it’s for",
    audienceBody:
      "Stemawy currently focuses on Grade 10 and Grade 11 students. Grade 12 is planned for the future. Students can start with a subject or unit, find related resources, and explore opportunities beyond class.",
    grades: [
      { label: "Grade 10" },
      { label: "Grade 11" },
      { label: "Grade 12", note: "Planned" },
    ],
    offeringsLabel: "On Stemawy",
    offeringsTitle: "What you’ll find here",
    offerings: [
      {
        title: "STEM subjects and curriculum",
        body: "Browse subjects and units by grade and semester.",
        href: "/subjects",
      },
      {
        title: "Free STEM resources",
        body: "Find materials connected to the topics you’re studying, free to access.",
        href: "/subjects",
      },
      {
        title: "Skills",
        body: "Explore practical skills to support learning and future plans.",
        href: "/skills",
      },
      {
        title: "Opportunities",
        body: "Discover academic programs and opportunities beyond class.",
        href: "/opportunities",
      },
    ],
    approachLabel: "Our approach",
    approachTitle: "A more useful study experience",
    approach: [
      {
        title: "Clear starting points",
        body: "Find your grade, semester, subject, and current unit without losing the thread.",
      },
      {
        title: "Learning in context",
        body: "Keep relevant materials close to the lessons and topics they support.",
      },
      {
        title: "Room to explore",
        body: "Look beyond today’s lesson with skills and academic opportunities.",
      },
    ],
    faqLabel: "FAQ",
    faqTitle: "Common questions",
    faqs: [
      {
        question: "Which students is Stemawy for?",
        answer:
          "Stemawy currently focuses on Grade 10 and Grade 11. Grade 12 is planned for a future release.",
      },
      {
        question: "Can I suggest a learning resource?",
        answer:
          "Yes. Use Suggest a Resource in the app to share a useful resource with the Stemawy team for review.",
      },
      {
        question: "How can I share feedback or ask a question?",
        answer:
          "Visit Help & Feedback to send the team a message, report an issue, or share an idea for improving Stemawy.",
      },
    ],
    contactTitle: "Have a question or an idea?",
    contactBody:
      "We welcome feedback, corrections, and suggestions from students and educators. Let us know what would make Stemawy more useful to you.",
    contactEmails: ["yassoalaa822@gmail.com", "youssefbhaa2010@gmail.com"],
    contactAction: "Contact Stemawy",
  },
  ar: {
    eyebrow: "من نحن",
    title: "عن ستماوي",
    intro:
      "يسهّل ستماوي العثور على مصادر STEM لطلاب المرحلة الثانوية، ويجمع مواد المنهج ومصادر التعلم في مكان واحد ومجاناً بالكامل.",
    whyTitle: "لماذا أُنشئ ستماوي؟",
    whyBody:
      "قد تكون مصادر تعلم STEM موزعة بين المواد والوحدات والملاحظات والروابط. أُنشئ ستماوي لتسهيل البحث عنها، وربطها بما يدرسه الطالب، وإتاحتها لطلاب المرحلة الثانوية مجاناً.",
    audienceTitle: "لمن صُمم؟",
    audienceBody:
      "يركز ستماوي حالياً على طلاب الصفين العاشر والحادي عشر، والصف الثاني عشر ضمن الخطط المستقبلية. ابدأ بمادة أو وحدة، واعثر على مصادر مرتبطة بها، واستكشف الفرص خارج الفصل.",
    grades: [
      { label: "الصف العاشر" },
      { label: "الصف الحادي عشر" },
      { label: "الصف الثاني عشر", note: "ضمن الخطط" },
    ],
    offeringsLabel: "في ستماوي",
    offeringsTitle: "ماذا ستجد هنا؟",
    offerings: [
      {
        title: "المواد والمناهج",
        body: "تصفح المواد والوحدات حسب الصف والفصل الدراسي.",
        href: "/subjects",
      },
      {
        title: "مصادر STEM مجانية",
        body: "اعثر مجاناً على مواد مرتبطة بالموضوعات التي تدرسها.",
        href: "/subjects",
      },
      {
        title: "المهارات",
        body: "استكشف مهارات عملية تدعم تعلمك وخططك المستقبلية.",
        href: "/skills",
      },
      {
        title: "الفرص",
        body: "اكتشف البرامج والفرص الدراسية خارج الفصل.",
        href: "/opportunities",
      },
    ],
    approachLabel: "نهجنا",
    approachTitle: "تجربة دراسية أكثر فائدة",
    approach: [
      {
        title: "بدايات واضحة",
        body: "اعثر على صفك وفصلك ومادتك ووحدتك الحالية بسهولة.",
      },
      {
        title: "التعلم في سياقه",
        body: "احتفظ بالمصادر المرتبطة بالدروس والموضوعات بالقرب منك.",
      },
      {
        title: "مساحة للاستكشاف",
        body: "تجاوز درس اليوم لاستكشاف المهارات والفرص الدراسية.",
      },
    ],
    faqLabel: "أسئلة شائعة",
    faqTitle: "إجابات سريعة",
    faqs: [
      {
        question: "لأي طلاب صُمم ستماوي؟",
        answer:
          "يركز ستماوي حالياً على الصفين العاشر والحادي عشر، والصف الثاني عشر ضمن الخطط المستقبلية.",
      },
      {
        question: "هل يمكنني اقتراح مصدر تعليمي؟",
        answer:
          "نعم. استخدم رابط اقتراح مصدر في التطبيق لمشاركة مصدر مفيد مع فريق ستماوي لمراجعته.",
      },
      {
        question: "كيف أرسل ملاحظة أو أطرح سؤالاً؟",
        answer:
          "انتقل إلى المساعدة والملاحظات لإرسال رسالة أو الإبلاغ عن مشكلة أو مشاركة فكرة لتحسين ستماوي.",
      },
    ],
    contactTitle: "لديك سؤال أو فكرة؟",
    contactBody:
      "نرحب بملاحظات الطلاب والمعلمين وتصويباتهم واقتراحاتهم. أخبرنا بما يجعل ستماوي أكثر فائدة لك.",
    contactEmails: ["yassoalaa822@gmail.com", "youssefbhaa2010@gmail.com"],
    contactAction: "تواصل مع ستماوي",
  },
} satisfies Record<Language, AboutCopy>;

const offeringIcons = [BookOpen, Lightbulb, Sparkles, BriefcaseBusiness];
const approachIcons = [BookOpen, GraduationCap, Sparkles];

export default function AboutPage() {
  const { language } = useLayoutState();
  const content = copy[language];

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(
      "[data-about-reveal]",
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      sections.forEach((section) => (section.dataset.visible = "true"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [language]);

  return (
    <div className={styles.page} dir={language === "ar" ? "rtl" : "ltr"}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p className={styles.intro}>{content.intro}</p>
        </header>

        <section className={styles.story} data-about-reveal>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionIcon}>
              <Lightbulb size={20} aria-hidden="true" />
            </span>
            <h2>{content.whyTitle}</h2>
          </div>
          <p>{content.whyBody}</p>
        </section>

        <section className={styles.audience} data-about-reveal>
          <div className={styles.audienceCopy}>
            <p className={styles.eyebrow}>{content.eyebrow}</p>
            <h2>{content.audienceTitle}</h2>
            <p>{content.audienceBody}</p>
          </div>
          <div className={styles.gradeList} aria-label={content.audienceTitle}>
            {content.grades.map((grade) => (
              <div className={styles.gradeItem} key={grade.label}>
                <GraduationCap size={19} aria-hidden="true" />
                <span>{grade.label}</span>
                {grade.note && <small>{grade.note}</small>}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} data-about-reveal>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>{content.offeringsLabel}</p>
            <h2>{content.offeringsTitle}</h2>
          </div>
          <div className={styles.offeringList}>
            {content.offerings.map((offering, index) => {
              const Icon = offeringIcons[index];
              return (
                <Link
                  className={styles.offering}
                  href={offering.href}
                  key={offering.title}
                >
                  <span className={styles.offeringIcon}>
                    <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className={styles.offeringText}>
                    <strong>{offering.title}</strong>
                    <span>{offering.body}</span>
                  </span>
                  <ArrowUpRight
                    className={styles.offeringArrow}
                    size={19}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        <section className={styles.section} data-about-reveal>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>{content.approachLabel}</p>
            <h2>{content.approachTitle}</h2>
          </div>
          <div className={styles.approachList}>
            {content.approach.map((item, index) => {
              const Icon = approachIcons[index];
              return (
                <article className={styles.approachItem} key={item.title}>
                  <span className={styles.approachIcon}>
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.section} data-about-reveal>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>{content.faqLabel}</p>
            <h2>{content.faqTitle}</h2>
          </div>
          <div className={styles.faqList}>
            {content.faqs.map((item) => (
              <details className={styles.faqItem} key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.contact} data-about-reveal>
          <span className={styles.contactIcon}>
            <MessageCircle size={21} aria-hidden="true" />
          </span>
          <div className={styles.contactCopy}>
            <h2>{content.contactTitle}</h2>
            <p>{content.contactBody}</p>
            <div className={styles.contactEmails}>
              {content.contactEmails.map((email) => (
                <a
                  className={styles.contactEmail}
                  href={`mailto:${email}`}
                  key={email}
                >
                  <Mail size={16} aria-hidden="true" />
                  {email}
                </a>
              ))}
            </div>
          </div>
          <Link className={styles.contactLink} href="/help">
            {content.contactAction}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </div>
  );
}
