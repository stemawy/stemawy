import type { Metadata } from "next";

import NotFoundExperience from "@/components/layout/NotFoundExperience";

export const metadata: Metadata = {
  title: "Page Not Found | Stemawy",
  description: "This page is off the map. Find your way back to Stemawy.",
};

export default function NotFoundPage() {
  return <NotFoundExperience />;
}
