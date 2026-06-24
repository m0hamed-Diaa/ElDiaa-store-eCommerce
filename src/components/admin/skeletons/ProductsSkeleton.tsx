import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


export default function ProfileSkeleton() {
    return (
        <Card className="w-full max-w-5xl mx-auto overflow-hidden rounded-2xl">
            <Skeleton className="h-40 w-full rounded-none" />

            <CardContent className="relative -top-14">

                <div className="flex flex-col md:flex-row items-center md:items-end justify-between">

                    <div className="space-y-3 mb-4">
                        <Skeleton className="h-40 w-40 rounded-full mx-auto md:mx-0" />

                        <Skeleton className="h-5 w-32 mx-auto md:mx-0" />

                        <Skeleton className="h-4 w-20 mx-auto md:mx-0" />
                    </div>

                    <Skeleton className="h-10 w-32 mb-4" />
                </div>


                <div className="md:flex gap-4 mt-5">

                    {[1, 2].map((item) => (
                        <Card
                            key={item}
                            className="w-full md:w-1/2 p-4 mb-4 md:mb-0"
                        >
                            <Skeleton className="h-5 w-32 mb-5" />

                            <div className="space-y-3">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-8 w-40" />
                                <Skeleton className="h-8 w-56" />
                                <Skeleton className="h-8 w-36" />
                            </div>

                            <Skeleton className="h-10 w-full md:w-40 mt-5" />
                        </Card>
                    ))}
                </div>

            </CardContent>
        </Card>
    );
}