import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProductsSkeleton() {
    return (
        <div className="space-y-6 p-3">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-6 w-60" />
                </div>

                <Skeleton className="h-10  md:w-40 rounded-md" />
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
                <div className="grid grid-cols-12 gap-4 border-b p-4">
                    {Array.from({ length: 12 }).map((_, index) => (
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
                        className="grid grid-cols-12 gap-4 items-center border-b p-4"
                    >
                        <Skeleton className="h-5 w-10" />

                        <Skeleton className="h-5 w-28" />

                        <Skeleton className="h-16 w-16 rounded-xl" />

                        <Skeleton className="h-5 w-full" />

                        <Skeleton className="h-5 w-16" />

                        <Skeleton className="h-5 w-24" />

                        <Skeleton className="h-8 w-24 rounded-full" />

                        <Skeleton className="h-8 w-14 rounded-full" />

                        <Skeleton className="h-8 w-16 rounded-full" />

                        <Skeleton className="h-5 w-10" />

                        <Skeleton className="h-8 w-28 rounded-full" />

                        <Skeleton className="h-9 w-9 rounded-md justify-self-end" />
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