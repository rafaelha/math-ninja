import { students } from "./types";
import StudentCard from "./components/StudentCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🥋 Ninja Belt Calculator 🥷
          </h1>
          <p className="text-gray-600">
            Enter your test score to discover your belt level!
          </p>
          <a
            href="/scores"
            className="inline-block mt-4 text-blue-500 hover:text-blue-600 underline"
          >
            View All Scores
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentCard key={student.name} student={student} />
          ))}
        </div>
      </div>
    </div>
  );
}
