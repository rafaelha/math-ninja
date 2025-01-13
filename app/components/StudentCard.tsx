"use client";

import { useState } from "react";
import { Student, calculateBelt } from "../types";
import { saveScore } from "../lib/redis";

export default function StudentCard({ student }: { student: Student }) {
  const [score, setScore] = useState<string>("");
  const [belt, setBelt] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const numberScore = parseInt(score);
    if (!isNaN(numberScore) && numberScore >= 0 && numberScore <= 30) {
      setIsLoading(true);
      const newBelt = calculateBelt(numberScore);
      try {
        await saveScore(student.name, numberScore, newBelt);
        setBelt(newBelt);
        setIsSubmitted(true);
      } catch (error) {
        console.error("Failed to save score:", error);
        alert("Failed to save score. Please try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
      <div className="absolute -top-3 -right-3">
        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
          <img src="/ninja-star.svg" alt="ninja star" className="w-5 h-5" />
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4 text-gray-800">{student.name}</h3>

      {!isSubmitted ? (
        <div className="space-y-3">
          <input
            type="number"
            min="0"
            max="30"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="Enter score (0-30)"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {isLoading ? "Saving..." : "Submit"}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className={`h-4 w-full rounded-full bg-${belt} mb-2`} />
          <p className="text-lg font-semibold capitalize">{belt} Belt!</p>
        </div>
      )}
    </div>
  );
}
