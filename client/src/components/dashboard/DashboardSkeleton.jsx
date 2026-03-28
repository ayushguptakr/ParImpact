import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";

/** Premium loading layout — mirrors dashboard card density without layout shift. */
export function UserDashboardSkeleton() {
  return (
    <div className="grid gap-6 md:gap-8 lg:grid-cols-[230px_1fr]">
      <aside className="hidden rounded-2xl border border-neutral-200/55 bg-surface-raised p-4 shadow-soft-light dark:border-white/5 dark:bg-[#121A16] dark:shadow-none lg:block">
        <Skeleton className="mb-4 h-8 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="mt-6 space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="mt-6 h-11 w-full rounded-2xl" />
      </aside>
      <section className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200/55 bg-surface-raised px-4 py-3 shadow-soft-light dark:border-white/5 dark:bg-[#121A16] dark:shadow-none">
          <Skeleton className="h-6 flex-1 max-w-xs" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
        <div className="grid gap-6 md:gap-8 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className={i === 6 ? "xl:col-span-2" : i === 5 ? "xl:col-span-1" : ""}>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-4 h-10 w-2/3" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-4/5" />
              <Skeleton className="mt-6 h-10 w-full rounded-2xl" />
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid gap-5 md:gap-6 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-5 md:p-6">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-4 h-12 w-32" />
            <Skeleton className="mt-4 h-2 w-full rounded-full" />
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-4 p-5 md:p-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-11 w-full rounded-2xl" />
        </Card>
        <Card className="p-5 md:p-6">
          <Skeleton className="h-8 w-56" />
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-20 w-full" />
            ))}
          </div>
        </Card>
      </div>
      <Card className="p-5 md:p-6">
        <Skeleton className="h-8 w-40" />
        <div className="mt-4 grid gap-2">
          {[1, 2, 3].map((k) => (
            <Skeleton key={k} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}
