export default function TasksLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-6 w-32 bg-gray-700 rounded animate-pulse" />
        <div className="h-10 w-32 bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="h-9 w-full sm:max-w-xs bg-gray-700 rounded animate-pulse" />
        <div className="h-9 w-full sm:max-w-[120px] bg-gray-700 rounded animate-pulse" />
        <div className="h-9 w-full sm:max-w-[120px] bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {[1, 2, 3].map((col) => (
          <div key={col} className="space-y-4">
            <div className="h-6 bg-gray-700 rounded w-32 animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3].map((card) => (
                <div
                  key={card}
                  className="h-32 bg-gray-800 rounded-xl border border-gray-700 animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
