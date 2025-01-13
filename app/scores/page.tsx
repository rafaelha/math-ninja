import { getAllScores } from "../lib/redis";
import { students } from "../types";

export const revalidate = 0; // Disable cache for this page

export default async function ScoresPage() {
  const allScores = await getAllScores();

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          🥋 Student Scores History
        </h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Latest Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Belt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    History
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => {
                  const studentScores = allScores[student.name] || [];
                  const latestScore = studentScores[studentScores.length - 1];

                  return (
                    <tr key={student.name}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {latestScore?.score ?? "No score yet"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {latestScore && (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${latestScore.belt} text-white`}
                          >
                            {latestScore.belt}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {studentScores.map((entry) => (
                            <div key={entry.date} className="mb-1">
                              {entry.date}: {entry.score} ({entry.belt} belt)
                            </div>
                          ))}
                        </div>
                      </td>
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
