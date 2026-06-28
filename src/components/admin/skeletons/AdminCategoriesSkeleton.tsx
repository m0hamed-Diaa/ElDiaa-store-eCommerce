import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCategoriesSkeleton() {
    return (
        <div className="space-y-6 p-3">
            {/* Header */}
            <div className="flex gap-4 items-center justify-between">
                <Skeleton className="h-12 w-25" />
                <Skeleton className="h-12 w-30 rounded-md" />
            </div>

            {/* Filters */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <Skeleton className="h-30 w-full rounded-md" />
                <Skeleton className="h-30 w-full rounded-md" />
                <Skeleton className="h-30 w-full rounded-md" />
                <Skeleton className="h-30 w-full rounded-md" />
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 md:flex-row">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 w-40 rounded-md" />
                <Skeleton className="h-10 w-32 rounded-md" />
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-5 gap-4 border-b p-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-5 w-full rounded-md"
                        />
                    ))}
                </div>

                {/* Rows */}
                {Array.from({ length: 8 }).map((_, row) => (
                    <div
                        key={row}
                        className="grid grid-cols-5 gap-4 items-center border-b p-4"
                    >
                        <Skeleton className="h-5 w-10" />

                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />

                        <Skeleton className="h-5 w-full" />

                        <Skeleton className="h-8 w-10 mx-auto" />

                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
            </div>
        </div>
    );
}