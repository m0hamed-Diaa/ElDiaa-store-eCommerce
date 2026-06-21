import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface IProps {
    showButtonDetails?: boolean;
}

export default function ProductCardSkeleton({ showButtonDetails = true }: IProps) {
    return (
        <Card>
            <CardContent className="space-y-4">
                {/* Product */}
                <Skeleton className="w-full h-56 rounded-lg" />
                <div className="flex-1 space-y-2">
                    {/* title */}
                    <Skeleton className="h-5 w-25" />
                    {/* rating */}
                    <Skeleton className="h-4 w-35" />
                    {/* description */}
                    <Skeleton className="h-8 w-full" />
                </div>

                <div className="flex gap-2">
                    <Skeleton className="h-4 w-full flex-1" />
                    <Skeleton className="h-4 w-full flex-1" />
                    <Skeleton className="h-4 w-full flex-1" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-12 w-full flex-1" />
                    {showButtonDetails && (<Skeleton className="h-12 w-full flex-1" />)}
                </div>

                {/* <Skeleton className="h-12 w-full mt-6" /> */}
            </CardContent>
        </Card>
    );
}