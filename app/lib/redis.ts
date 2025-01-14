import { Redis } from "@upstash/redis";
import { students } from "../types";

const getRedisConfig = () => {
  return {
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_READ_ONLY_TOKEN,
  };
};

export const redis = new Redis(getRedisConfig());

export type ScoreEntry = {
  date: string;
  score: number;
  belt: string;
};

export async function saveDateToList(date: string) {
  const existingDates = (await redis.get<string[]>("dates")) || [];
  if (!existingDates.includes(date)) {
    const newDates = [...existingDates, date].sort();
    await redis.set("dates", newDates);
  }
}

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
  await saveDateToList(today);
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

export async function getAllDates(): Promise<string[]> {
  return (await redis.get<string[]>("dates")) || [];
}

export async function deleteScore(studentName: string, date: string) {
  const existingData = (await redis.get<ScoreEntry[]>(studentName)) || [];
  const newData = existingData.filter((entry) => entry.date !== date);

  // If this was the last entry for this date, remove the date from dates list
  if (existingData.length !== newData.length) {
    // Check if any other student has an entry for this date
    let dateStillInUse = false;
    for (const student of students) {
      if (student.name === studentName) continue;
      const studentData = await getStudentScores(student.name);
      if (studentData.some((entry) => entry.date === date)) {
        dateStillInUse = true;
        break;
      }
    }

    // If no other student has an entry for this date, remove it from dates list
    if (!dateStillInUse) {
      const existingDates = (await redis.get<string[]>("dates")) || [];
      const newDates = existingDates.filter((d) => d !== date);
      await redis.set("dates", newDates);
    }
  }

  await redis.set(studentName, newData);
}
