import Link from "next/link";

import styles from "./Footer.module.scss";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Help & Feedback", href: "/help" },
  { label: "Suggest a Resource", href: "/suggest-resource" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        &copy; 2025 Stemawy 2.0. Built for High-Performance Academic
        Empowerment.
      </p>
      <nav className={styles.links} aria-label="Footer navigation">
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
