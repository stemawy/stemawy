export type RecentLearning = {
  id: string;
  subject: string;
  topic: string;
  icon: string;
  tone: "blue" | "green" | "violet";
};

export const recentLearning: RecentLearning[] = [
  {
    id: "maths-trigonometry",
    subject: "Maths",
    topic: "Advanced Trigonometry",
    icon: "calculator",
    tone: "blue",
  },
  {
    id: "physics-kinematics",
    subject: "Physics",
    topic: "Kinematics in 2D",
    icon: "gauge",
    tone: "green",
  },
  {
    id: "chemistry-atoms",
    subject: "Chemistry",
    topic: "Atomic Structure",
    icon: "flask",
    tone: "violet",
  },
];
