export type Belt =
  | "white"
  | "yellow"
  | "orange"
  | "green"
  | "blue"
  | "purple"
  | "red"
  | "brown"
  | "black";

export type Student = {
  name: string;
  score?: number;
  belt?: Belt;
};

export const students: Student[] = [
  { name: "Azlan" },
  { name: "Cade" },
  { name: "Caleb" },
  { name: "Clara" },
  { name: "Dallas" },
  { name: "Daniel" },
  { name: "Darian" },
  { name: "Ewan" },
  { name: "Fin" },
  { name: "Gabriel" },
  { name: "Henry" },
  { name: "Hudson" },
  { name: "Jaxson" },
  { name: "Joey" },
  { name: "Matteo" },
  { name: "Miss Gore" },
  { name: "Rowan" },
  { name: "Trustin" },
];

export function calculateBelt(score: number): Belt {
  if (score < 0) return "white";
  if (score <= 3) return "white";
  if (score <= 6) return "yellow";
  if (score <= 9) return "orange";
  if (score <= 13) return "green";
  if (score <= 17) return "blue";
  if (score <= 21) return "purple";
  if (score <= 25) return "red";
  if (score <= 29) return "brown";
  return "black";
}
