import Link from "next/link";

import styles from "./Footer.module.scss";
import { useLayoutState } from "./layout-context";
import { getTranslations } from "@/lib/i18n";

export default function Footer() {
  const { language } = useLayoutState();
  const t = getTranslations(language);
  const footerLinks = [
    { label: t.footer.about, href: "/about" },
    { label: t.footer.help, href: "/help" },
    { label: t.footer.suggest, href: "/suggest-resource" },
  ];

  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        &copy; 2025 Stemawy 2.0. {t.footer.builtFor}
      </p>
      <nav className={styles.links} aria-label={t.footer.navigation}>
        {footerLinks.map(({ label, href }, index) => (
          <span className={styles.linkGroup} key={href}>
            {index > 0 && (
              <span className={styles.separator} aria-hidden="true">
                •
              </span>
            )}
            <Link className={styles.link} href={href}>
              {label}
            </Link>
          </span>
        ))}
      </nav>
    </footer>
  );
}
