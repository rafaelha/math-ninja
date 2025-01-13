import { Redis } from "@upstash/redis";
import { students } from "../types";

const getRedisConfig = () => {
  return {
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  };
};

export const redis = new Redis(getRedisConfig());

export type ScoreEntry = {
  date: string;
  score: number;
  belt: string;
};

type AllScoresData = {
  dates: string[];
  scores: Record<string, ScoreEntry[]>;
};

const SCORES_KEY = "all_scores_data";

// Initialize empty data structure
const getEmptyData = (): AllScoresData => ({
  dates: [],
  scores: Object.fromEntries(students.map((s) => [s.name, []])),
});

export async function saveScore(
  studentName: string,
  score: number,
  belt: string
) {
  // Get today's date in UTC
  const today = new Date().toISOString().split("T")[0];
  const allData =
    (await redis.get<AllScoresData>(SCORES_KEY)) || getEmptyData();

  // Update dates if needed
  if (!allData.dates.includes(today)) {
    allData.dates = [...allData.dates, today].sort();
  }

  // Update student scores
  if (!allData.scores[studentName]) {
    allData.scores[studentName] = [];
  }

  allData.scores[studentName] = [
    ...allData.scores[studentName].filter((entry) => entry.date !== today),
    { date: today, score, belt },
  ];

  // Single Redis operation to save everything
  await redis.set(SCORES_KEY, allData);
}

export async function getStudentScores(
  studentName: string
): Promise<ScoreEntry[]> {
  const allData =
    (await redis.get<AllScoresData>(SCORES_KEY)) || getEmptyData();
  return allData.scores[studentName] || [];
}

export async function getAllScores(): Promise<Record<string, ScoreEntry[]>> {
  const allData =
    (await redis.get<AllScoresData>(SCORES_KEY)) || getEmptyData();
  return allData.scores;
}

export async function getAllDates(): Promise<string[]> {
  const allData =
    (await redis.get<AllScoresData>(SCORES_KEY)) || getEmptyData();
  return allData.dates;
}

export async function deleteScore(studentName: string, date: string) {
  const allData =
    (await redis.get<AllScoresData>(SCORES_KEY)) || getEmptyData();

  // Remove score from student's array
  if (allData.scores[studentName]) {
    allData.scores[studentName] = allData.scores[studentName].filter(
      (entry) => entry.date !== date
    );
  }

  // Check if this date is still used by any student
  const dateStillInUse = Object.values(allData.scores).some((scores) =>
    scores.some((entry) => entry.date === date)
  );

  // If date is no longer used, remove it from dates array
  if (!dateStillInUse) {
    allData.dates = allData.dates.filter((d) => d !== date);
  }

  // Single Redis operation to save everything
  await redis.set(SCORES_KEY, allData);
}
