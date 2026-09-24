"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Compass,
  Grid2X2,
  Settings,
  X,
} from "lucide-react";

import { useLayoutState } from "./layout-context";
import styles from "./Sidebar.module.scss";
import { getTranslations } from "@/lib/i18n";

const navigation = [
  { key: "dashboard", href: "/dashboard", icon: Grid2X2 },
  { key: "subjects", href: "/subjects", icon: BookOpen },
  { key: "skills", href: "/skills", icon: BrainCircuit },
  { key: "opportunities", href: "/opportunities", icon: Compass },
  { key: "saved", href: "/saved", icon: Bookmark },
];

export default function Sidebar({ activePath }: { activePath?: string }) {
  const pathname = usePathname();
  const { collapsed, mobileOpen, setMobileOpen, toggleCollapsed, language } =
    useLayoutState();
  const t = getTranslations(language);

  const active = (href: string) =>
    activePath === href ||
    (!activePath && (pathname === href || pathname.startsWith(`${href}/`)));

  return (
    <>
      {mobileOpen && (
        <button
          className={styles.scrim}
          type="button"
          aria-label={t.common.closeNavigation}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""} ${mobileOpen ? styles.mobileOpen : ""}`}
        aria-label="Primary navigation"
      >
        <div className={styles.brandRow}>
          <Link className={styles.brand} href="/" aria-label="Stemawy home">
            <span className={styles.brandMark} aria-hidden="true">
              <Image
                className={styles.brandImage}
                src="/stemawy-logo.png"
                alt=""
                width={94}
                height={94}
              />
            </span>
            <span className={styles.brandName}>Stemawy 2.0</span>
          </Link>
          <button
            className={styles.mobileClose}
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.navigation}>
          <div className={styles.navGroup}>
            {navigation.map(({ key, href, icon: Icon }) => {
              const label = t.nav[key as keyof typeof t.nav];
              return (
                <Link
                  className={`${styles.navItem} ${active(href) ? styles.active : ""}`}
                  href={href}
                  key={href}
                  aria-current={active(href) ? "page" : undefined}
                  title={collapsed ? label : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon
                    className={styles.navIcon}
                    size={21}
                    strokeWidth={1.8}
                  />
                  <span className={styles.navLabel}>{label}</span>
                </Link>
              );
            })}
          </div>

          <div className={styles.settingsGroup}>
            <Link
              className={`${styles.navItem} ${active("/settings") ? styles.active : ""}`}
              href="/settings"
              aria-current={active("/settings") ? "page" : undefined}
              title={collapsed ? t.nav.settings : undefined}
              onClick={() => setMobileOpen(false)}
            >
              <Settings
                className={styles.navIcon}
                size={21}
                strokeWidth={1.8}
              />
              <span className={styles.navLabel}>{t.nav.settings}</span>
            </Link>
          </div>
        </nav>

        <button
          className={styles.collapseButton}
          type="button"
          aria-label={
            collapsed ? t.common.expandNavigation : t.common.collapseNavigation
          }
          aria-expanded={!collapsed}
          onClick={toggleCollapsed}
          title={
            collapsed ? t.common.expandNavigation : t.common.collapseNavigation
          }
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </aside>
    </>
  );
}
