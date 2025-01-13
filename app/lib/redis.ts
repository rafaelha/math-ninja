import { Redis } from "@upstash/redis";
import { students } from "../types";

const getRedisConfig = () => {
  return {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  };
};

export const redis = new Redis(getRedisConfig());

export type ScoreEntry = {
  date: string;
  score: number;
  belt: string;
};

export async function saveScore(
  studentName: string,
  score: number,
  belt: string
) {
  const today = new Date().toISOString().split("T")[0];
  const existingData = (await redis.get<ScoreEntry[]>(studentName)) || [];

  // Remove entry for today if it exists
  const filteredData = existingData.filter((entry) => entry.date !== today);

  // Add new entry
  const newData = [...filteredData, { date: today, score, belt }];

  await redis.set(studentName, newData);
}

export async function getStudentScores(
  studentName: string
): Promise<ScoreEntry[]> {
  return (await redis.get<ScoreEntry[]>(studentName)) || [];
}

export async function getAllScores(): Promise<Record<string, ScoreEntry[]>> {
  const scores: Record<string, ScoreEntry[]> = {};
  for (const student of students) {
    scores[student.name] = await getStudentScores(student.name);
  }
  return scores;
}
