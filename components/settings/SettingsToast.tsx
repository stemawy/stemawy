import { CheckCircle2 } from "lucide-react";
import styles from "@/app/settings/settings.module.scss";

export default function SettingsToast({ message }: { message: string | null }) {
  return (
    <div
      className={`${styles.toast} ${message ? styles.toastVisible : ""}`}
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 size={18} />
      {message}
    </div>
  );
}
