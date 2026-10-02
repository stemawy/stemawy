"use client";

import { Bell, BellDot, BellRing, ExternalLink, Menu, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

import { useLayoutState } from "./layout-context";
import styles from "./Header.module.scss";
import { getTranslations } from "@/lib/i18n";
import {
  fetchDjangoAnnouncements,
  type DjangoAnnouncement,
} from "@/lib/django-api";
import GlobalSearch from "@/components/search/GlobalSearch";

const seenAnnouncementsStorageKey = "stemawy-seen-announcements";

function readSeenAnnouncementIds(): number[] {
  try {
    const stored = window.localStorage.getItem(seenAnnouncementsStorageKey);
    const ids: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(ids)
      ? ids.filter((id): id is number => Number.isInteger(id))
      : [];
  } catch {
    return [];
  }
}

function writeSeenAnnouncementIds(ids: number[]): boolean {
  try {
    window.localStorage.setItem(
      seenAnnouncementsStorageKey,
      JSON.stringify(ids),
    );
    return true;
  } catch {
    return false;
  }
}

export default function Header() {
  const notificationArea = useRef<HTMLDivElement>(null);
  const announcementModal = useRef<HTMLDivElement>(null);
  const announcementCloseButton = useRef<HTMLButtonElement>(null);
  const notificationOpenRef = useRef(false);
  const seenAnnouncementIdsRef = useRef<number[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<
    DjangoAnnouncement[] | null
  >(null);
  const [seenAnnouncementIds, setSeenAnnouncementIds] = useState<number[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<DjangoAnnouncement | null>(null);
  const { collapsed, mobileOpen, setMobileOpen, language } = useLayoutState();
  const t = getTranslations(language);

  useEffect(() => {
    let active = true;
    const refreshAnnouncements = () => {
      fetchDjangoAnnouncements().then((items) => {
        if (!active) return;

        const seenIds = [
          ...new Set([
            ...seenAnnouncementIdsRef.current,
            ...readSeenAnnouncementIds(),
          ]),
        ];
        setAnnouncements(items);
        if (notificationOpenRef.current) {
          seenIds.push(...items.map((item) => item.id));
          const updatedIds = [...new Set(seenIds)];
          writeSeenAnnouncementIds(updatedIds);
          seenAnnouncementIdsRef.current = updatedIds;
          setSeenAnnouncementIds(updatedIds);
        } else {
          seenAnnouncementIdsRef.current = seenIds;
          setSeenAnnouncementIds(seenIds);
        }
      });
    };

    refreshAnnouncements();
    const refreshInterval = window.setInterval(refreshAnnouncements, 60_000);

    return () => {
      active = false;
      window.clearInterval(refreshInterval);
    };
  }, []);

  const markAnnouncementsSeen = (items: DjangoAnnouncement[]) => {
    const updatedIds = [
      ...new Set([
        ...readSeenAnnouncementIds(),
        ...seenAnnouncementIds,
        ...items.map((item) => item.id),
      ]),
    ];
    writeSeenAnnouncementIds(updatedIds);
    seenAnnouncementIdsRef.current = updatedIds;
    setSeenAnnouncementIds(updatedIds);
  };

  const toggleNotifications = () => {
    const nextOpen = !notificationOpen;
    notificationOpenRef.current = nextOpen;
    setNotificationOpen(nextOpen);
    if (nextOpen && announcements) markAnnouncementsSeen(announcements);
  };

  useEffect(() => {
    if (!notificationOpen) return;

    const handleDismiss = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !notificationArea.current?.contains(event.target) &&
        !announcementModal.current?.contains(event.target)
      ) {
        notificationOpenRef.current = false;
        setNotificationOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        notificationOpenRef.current = false;
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDismiss);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleDismiss);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [notificationOpen]);

  useEffect(() => {
    if (!selectedAnnouncement) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    announcementCloseButton.current?.focus();
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedAnnouncement(null);
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [selectedAnnouncement]);

  const hasUnreadAnnouncements =
    announcements?.some(
      (announcement) => !seenAnnouncementIds.includes(announcement.id),
    ) ?? false;

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
        <GlobalSearch />
      </div>

      <div className={styles.actions}>
        <div ref={notificationArea} className={styles.notificationArea}>
          <button
            className={`${styles.iconButton} ${notificationOpen ? styles.iconButtonActive : ""}`}
            type="button"
            aria-label={
              hasUnreadAnnouncements
                ? t.common.notificationsWithNew
                : t.common.notifications
            }
            aria-expanded={notificationOpen}
            aria-controls="notifications-panel"
            onClick={toggleNotifications}
          >
            {hasUnreadAnnouncements ? (
              <BellDot size={21} strokeWidth={1.8} />
            ) : (
              <Bell size={21} strokeWidth={1.8} />
            )}
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
                  onClick={() => {
                    notificationOpenRef.current = false;
                    setNotificationOpen(false);
                  }}
                >
                  <X size={17} aria-hidden="true" />
                </button>
              </div>
              <div
                className={styles.notificationContent}
                aria-live="polite"
                aria-busy={announcements === null}
              >
                {announcements === null ? (
                  <p className={styles.notificationStatus}>
                    {t.common.notificationsLoading}
                  </p>
                ) : announcements.length ? (
                  <ul className={styles.notificationList}>
                    {announcements.map((announcement) => {
                      const title =
                        language === "ar"
                          ? announcement.arTitle
                          : announcement.title;
                      const message =
                        language === "ar"
                          ? announcement.arMessage
                          : announcement.message;
                      return (
                        <li key={announcement.id}>
                          <button
                            className={styles.notificationItem}
                            type="button"
                            onClick={() => {
                              setSelectedAnnouncement(announcement);
                            }}
                          >
                            <span className={styles.notificationItemTitle}>
                              {title}
                            </span>
                            <span className={styles.notificationItemMessage}>
                              {message}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className={styles.notificationEmpty}>
                    <span
                      className={styles.notificationEmptyIcon}
                      aria-hidden="true"
                    >
                      <BellRing size={28} />
                    </span>
                    <p>{t.common.notificationsEmpty}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedAnnouncement &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={styles.announcementModalBackdrop}
            ref={announcementModal}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              display: "grid",
              placeItems: "center",
            }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget)
                setSelectedAnnouncement(null);
            }}
          >
            <section
              className={styles.announcementModal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="announcement-modal-title"
            >
              <div className={styles.announcementModalHeader}>
                <h2 id="announcement-modal-title">
                  {language === "ar"
                    ? selectedAnnouncement.arTitle
                    : selectedAnnouncement.title}
                </h2>
                <button
                  className={styles.notificationClose}
                  type="button"
                  aria-label={t.common.closeAnnouncement}
                  ref={announcementCloseButton}
                  onClick={() => setSelectedAnnouncement(null)}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <p className={styles.announcementModalMessage}>
                {language === "ar"
                  ? selectedAnnouncement.arMessage
                  : selectedAnnouncement.message}
              </p>
              {selectedAnnouncement.href && (
                <a
                  className={styles.announcementModalLink}
                  href={selectedAnnouncement.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.common.openAnnouncementLink}
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              )}
            </section>
          </div>,
          document.body,
        )}
    </header>
  );
}
