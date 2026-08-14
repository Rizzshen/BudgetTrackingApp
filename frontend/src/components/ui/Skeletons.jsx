const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-border/70 ${className}`} />
);

export const DashboardSkeleton = () => (
  <div>
    <div className="mb-8 flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48 rounded-lg" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>
      <Skeleton className="h-10 w-44 rounded-xl" />
    </div>
    <div className="mb-6 grid gap-6 sm:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-card border border-border bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-9 w-32 rounded-lg" />
        </div>
      ))}
    </div>
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="rounded-card border border-border bg-white p-6 shadow-card lg:col-span-3">
        <Skeleton className="h-5 w-32 rounded" />
        <Skeleton className="mt-4 h-56 w-full rounded-xl" />
      </div>
      <div className="rounded-card border border-border bg-white p-6 shadow-card lg:col-span-2">
        <Skeleton className="h-5 w-40 rounded" />
        <Skeleton className="mx-auto mt-4 h-40 w-40 rounded-full" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      </div>
    </div>
  </div>
);

export const ExpensesSkeleton = () => (
  <div>
    <div className="mb-6 flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-9 w-40 rounded-lg" />
        <Skeleton className="h-4 w-56 rounded" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
    </div>
    <div className="mb-6 flex gap-3">
      <Skeleton className="h-10 w-44 rounded-xl" />
      <Skeleton className="h-10 w-36 rounded-xl" />
      <Skeleton className="h-10 w-40 rounded-xl" />
      <Skeleton className="h-10 w-40 rounded-xl" />
    </div>
    <div className="rounded-card border border-border bg-white shadow-card">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-border px-6 py-4 last:border-b-0">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3 rounded" />
            <Skeleton className="h-3 w-1/4 rounded" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      ))}
    </div>
  </div>
);

export const InsightsSkeleton = () => (
  <div>
    <div className="mb-6 flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-9 w-40 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded" />
      </div>
      <Skeleton className="h-10 w-28 rounded-xl" />
    </div>
    <div className="rounded-card border border-border bg-white p-6 shadow-card">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-6 w-40 rounded" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
      </div>
    </div>
    <Skeleton className="mb-4 mt-8 h-6 w-32 rounded" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-card border border-border bg-white p-5 shadow-card">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-32 rounded" />
          </div>
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
            <Skeleton className="h-4 w-3/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);