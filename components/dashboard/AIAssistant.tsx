import { Bot, Send } from "lucide-react";

import styles from "@/app/dashboard/dashborad.module.scss";

export default function AIAssistant() {
  return (
    <section className={styles.ai}>
      <div className={styles.aiTitle}>
        <span>
          <Bot size={18} />
        </span>
        <h2>Ask Stemawy AI</h2>
      </div>
      <p>Stuck on a problem? Let&apos;s figure it out together.</p>
      <div className={styles.aiInput}>
        <input
          placeholder="Explain photosynthesis..."
          aria-label="Ask Stemawy AI"
        />
        <button type="button" aria-label="Send question">
          <Send size={18} />
        </button>
      </div>
    </section>
  );
}
