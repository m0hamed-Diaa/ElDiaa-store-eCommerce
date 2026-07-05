import { Skeleton } from "@/components/ui/skeleton";

const AdminHeroSlidesSkeleton = () => {
    return (
        <div className="space-y-6 p-3">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Skeleton className="h-9 w-56" />
                <Skeleton className="h-10 w-40 rounded-md" />
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-xl border p-4 space-y-3"
                    >
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-14" />
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 md:flex-row">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 w-40 rounded-md" />
                <Skeleton className="h-10 w-32 rounded-md" />
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-9 gap-4 border-b p-4">
                    {Array.from({ length: 9 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-5 w-full"
                        />
                    ))}
                </div>

                {/* Rows */}
                {Array.from({ length: 8 }).map((_, row) => (
                    <div
                        key={row}
                        className="grid grid-cols-9 gap-4 items-center border-b p-4"
                    >
                        <Skeleton className="h-5 w-10" />

                        <Skeleton className="h-5 w-32" />

                        <Skeleton className="h-5 w-40" />

                        <Skeleton className="h-16 w-16 rounded-xl" />

                        <Skeleton className="h-5 w-24" />

                        <Skeleton className="h-5 w-20" />

                        <Skeleton className="h-5 w-36" />

                        <Skeleton className="h-8 w-24 rounded-full" />

                        <Skeleton className="h-9 w-9 rounded-md justify-self-center" />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className="h-10 w-10 rounded-md"
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminHeroSlidesSkeleton;