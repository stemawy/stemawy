"use client";

import { Bell, BellRing, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useLayoutState } from "./layout-context";
import styles from "./Header.module.scss";
import { getTranslations } from "@/lib/i18n";

export default function Header() {
  const searchInput = useRef<HTMLInputElement>(null);
  const notificationArea = useRef<HTMLDivElement>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { collapsed, mobileOpen, setMobileOpen, language } = useLayoutState();
  const t = getTranslations(language);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (!notificationOpen) return;

    const handleDismiss = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !notificationArea.current?.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNotificationOpen(false);
    };

    document.addEventListener("mousedown", handleDismiss);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleDismiss);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [notificationOpen]);

  return (
    <header className={`${styles.header} ${collapsed ? styles.collapsed : ""}`}>
      <button
        className={styles.mobileMenuButton}
        type="button"
        aria-label={t.common.openNavigation}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={21} strokeWidth={2} />
      </button>
      <div className={styles.searchShell}>
        <Search
          className={styles.searchIcon}
          size={21}
          strokeWidth={2}
          aria-hidden="true"
        />
        <input
          ref={searchInput}
          className={styles.searchInput}
          type="search"
          placeholder={t.common.searchPlaceholder}
          aria-label={t.common.searchStemawy}
        />
        <kbd className={styles.shortcut} aria-label={t.common.controlK}>
          CTRL K
        </kbd>
      </div>

      <div className={styles.actions}>
        <div ref={notificationArea} className={styles.notificationArea}>
          <button
            className={`${styles.iconButton} ${notificationOpen ? styles.iconButtonActive : ""}`}
            type="button"
            aria-label={t.common.notifications}
            aria-expanded={notificationOpen}
            aria-controls="notifications-panel"
            onClick={() => setNotificationOpen((open) => !open)}
          >
            <Bell size={21} strokeWidth={1.8} />
          </button>
          {notificationOpen && (
            <div
              id="notifications-panel"
              className={styles.notificationPanel}
              role="dialog"
              aria-label={t.common.notifications}
            >
              <div className={styles.notificationPanelHeader}>
                <strong>{t.common.notifications}</strong>
                <button
                  className={styles.notificationClose}
                  type="button"
                  aria-label={t.common.closeNotifications}
                  onClick={() => setNotificationOpen(false)}
                >
                  <X size={17} aria-hidden="true" />
                </button>
              </div>
              <div className={styles.notificationEmpty} aria-live="polite">
                <span
                  className={styles.notificationEmptyIcon}
                  aria-hidden="true"
                >
                  <BellRing size={28} />
                </span>
                <p>{t.common.notificationsEmpty}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
