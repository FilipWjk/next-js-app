export default function RootLoading() {
  return (
    <div className="p-6">
      <div className="h-6 w-48 bg-gray-700 rounded animate-pulse mb-4" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-800 rounded-xl border border-gray-700 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
