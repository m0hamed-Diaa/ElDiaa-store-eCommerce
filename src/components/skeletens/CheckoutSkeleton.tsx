import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutSkeleton() {
    return (
        <div className="container mx-auto min-h-screen py-10 px-5">
            {/* Title */}
            <Skeleton className="h-9 w-52 mb-8" />

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Side */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Address */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>

                    {/* Payment */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-36" />
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-5 w-32" />
                            </div>

                            <div className="flex items-center gap-3">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-5 w-36" />
                            </div>

                            <div className="flex items-center gap-3">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-5 w-28" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side */}
                <div>
                    <Card className="sticky top-4">
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>

                        <CardContent>
                            {/* Product */}
                            <div className="flex gap-3 mb-4">
                                <Skeleton className="w-20 h-20 rounded-lg" />

                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            </div>

                            {/* Product */}
                            <div className="flex gap-3 mb-4">
                                <Skeleton className="w-20 h-20 rounded-lg" />

                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-36" />
                                    <Skeleton className="h-4 w-14" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            </div>

                            <div className="space-y-4 mt-6">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-16" />
                                </div>

                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-14" />
                                </div>

                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-14" />
                                    <Skeleton className="h-4 w-12" />
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            </div>

                            <div className="mt-5 flex gap-2">
                                <Skeleton className="h-10 flex-1" />
                                <Skeleton className="h-10 w-24" />
                            </div>

                            <Skeleton className="h-12 w-full mt-6" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}