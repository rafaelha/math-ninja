import { getAllScores, getAllDates, deleteScore } from "../lib/redis";
import { students } from "../types";
import DeleteButton from "../components/DeleteButton";
import Link from "next/link";

export const revalidate = 0; // Disable cache for this page

// Helper function to format dates consistently
function formatDate(dateStr: string) {
  // Create date in UTC
  const date = new Date(dateStr + "T00:00:00Z");
  return date.toLocaleDateString();
}

export default async function ScoresPage() {
  const allScores = await getAllScores();
  const allDates = (await getAllDates()).sort((a, b) => b.localeCompare(a)); // Sort dates in descending order

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-block mb-6 text-blue-600 hover:text-blue-800"
        >
          ← Back to Main Page
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          🥋 Student Scores History
        </h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  {allDates.map((date) => (
                    <th
                      key={date}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {formatDate(date)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => {
                  const studentScores = allScores[student.name] || [];
                  const scoresByDate = Object.fromEntries(
                    studentScores.map((entry) => [entry.date, entry])
                  );

                  return (
                    <tr key={student.name}>
                      <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                      </td>
                      {allDates.map((date) => {
                        const entry = scoresByDate[date];
                        return (
                          <td
                            key={date}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {entry ? (
                              <div className="flex flex-col items-center relative">
                                <DeleteButton
                                  studentName={student.name}
                                  date={date}
                                  onDelete={async () => {
                                    "use server";
                                    await deleteScore(student.name, date);
                                  }}
                                />
                                <span className="font-medium">
                                  {entry.score}
                                </span>
                                <span
                                  className={`mt-1 px-2 text-xs rounded-full bg-${entry.belt} belt-indicator`}
                                >
                                  {entry.belt}
                                </span>
                              </div>
                            ) : (
                              "—"
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
