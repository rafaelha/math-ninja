"use client";

export default function DeleteButton({
  studentName,
  date,
  onDelete,
}: {
  studentName: string;
  date: string;
  onDelete: () => Promise<void>;
}) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const formattedDate = new Date(date).toLocaleDateString();
    if (confirm(`Delete score for ${studentName} on ${formattedDate}?`)) {
      await onDelete();
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="absolute top-1/2 right-0 -translate-y-1/2 -mr-2 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors"
      title="Delete score"
    >
      ×
    </button>
  );
}
