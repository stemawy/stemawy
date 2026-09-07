"use client";

import { Bell, Menu, Search, UserRound } from "lucide-react";
import { useEffect, useRef } from "react";

import { useLayoutState } from "./layout-context";
import styles from "./Header.module.scss";

export default function Header() {
  const searchInput = useRef<HTMLInputElement>(null);
  const { collapsed, mobileOpen, setMobileOpen } = useLayoutState();

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

  return (
    <header className={`${styles.header} ${collapsed ? styles.collapsed : ""}`}>
      <button
        className={styles.mobileMenuButton}
        type="button"
        aria-label="Open navigation"
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
          placeholder="Search Stemawy... (Ctrl+K)"
          aria-label="Search Stemawy"
        />
        <kbd className={styles.shortcut} aria-label="Control K shortcut">
          CTRL K
        </kbd>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.iconButton}
          type="button"
          aria-label="Notifications"
        >
          <Bell size={21} strokeWidth={1.8} />
          <span className={styles.notificationDot} aria-hidden="true" />
        </button>

        <span className={styles.divider} aria-hidden="true" />

        <button
          className={styles.profile}
          type="button"
          aria-label="Open student profile"
        >
          <span className={styles.profileCopy}>
            <strong>Student</strong>
            <small>Local Profile</small>
          </span>
          <span className={styles.avatar} aria-hidden="true">
            <UserRound size={20} strokeWidth={1.8} />
          </span>
        </button>
      </div>
    </header>
  );
}
