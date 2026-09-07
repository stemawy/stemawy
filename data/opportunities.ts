export type Opportunity = {
  id: string;
  title: string;
  date: string;
  image: string;
  urgent?: boolean;
};

export const opportunities: Opportunity[] = [
  {
    id: "math-olympiad",
    title: "National Math Olympiad",
    date: "Closes in 3 days",
    image: "/opportunity-math.svg",
    urgent: true,
  },
  {
    id: "stem-summer-camp",
    title: "STEM Summer Camp",
    date: "Aug 15 - Aug 25",
    image: "/opportunity-stem.svg",
  },
];
