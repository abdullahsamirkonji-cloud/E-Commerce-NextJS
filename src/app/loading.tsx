export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Title skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-4 w-72 rounded-lg bg-gray-100 animate-pulse" />
      </div>

      {/* Grid skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm space-y-3"
          >
            <div className="h-48 w-full rounded-xl bg-gray-200 animate-pulse" />
            <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
            <div className="flex items-center justify-between pt-2">
              <div className="h-5 w-20 rounded bg-gray-200 animate-pulse" />
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
