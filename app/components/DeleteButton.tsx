"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({
  studentName,
  date,
  onDelete,
}: {
  studentName: string;
  date: string;
  onDelete: () => Promise<void>;
}) {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const formattedDate = new Date(date).toLocaleDateString();
    if (confirm(`Delete score for ${studentName} on ${formattedDate}?`)) {
      await onDelete();
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
      title="Delete score"
    >
      ×
    </button>
  );
}
