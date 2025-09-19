export default function TaskDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-9 w-32 bg-gray-700 rounded animate-pulse" />
        <div className="h-7 w-40 bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="h-48 bg-gray-800 rounded-xl border border-gray-700 animate-pulse" />
    </div>
  );
}
