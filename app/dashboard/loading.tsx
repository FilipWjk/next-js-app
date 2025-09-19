export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-40 bg-gray-700 rounded animate-pulse" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-800 rounded-xl border border-gray-700 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
