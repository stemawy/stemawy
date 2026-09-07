"use client";

import type { ReactNode } from "react";

import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useLayoutState } from "./layout-context";
import styles from "./AppShell.module.scss";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const { collapsed } = useLayoutState();

  return (
    <div className={`${styles.shell} ${collapsed ? styles.collapsed : ""}`}>
      <Sidebar />
      <Header />
      <main className={`layout-main ${styles.main}`}>
        {children}
        <Footer />
      </main>
    </div>
  );
}
