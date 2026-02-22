export function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="skeleton h-4 w-20 mb-3" />
      <div className="skeleton h-8 w-24" />
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="skeleton h-5 w-40 mb-4" />
      <div className="skeleton h-64 w-full" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <SkeletonChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="skeleton h-5 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="skeleton h-4 w-full" key={i} />
            ))}
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="skeleton h-5 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="skeleton h-4 w-full" key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
