import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsSkeleton() {
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">

                {/* Header */}
                <div className="mb-10 space-y-3">
                    <Skeleton className="h-10 w-52" />
                    <Skeleton className="h-5 w-96 max-w-full" />
                </div>

                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

                    {/* Sidebar */}
                    <Card>
                        <CardContent className="p-4">

                            <div className="mb-6 flex flex-col items-center">
                                <Skeleton className="h-20 w-20 rounded-full" />
                                <Skeleton className="h-5 w-32 mt-4" />
                                <Skeleton className="h-4 w-20 mt-2" />
                            </div>

                            <div className="space-y-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className="h-10 w-full"
                                    />
                                ))}
                            </div>

                            <Skeleton className="h-10 w-full mt-4" />
                        </CardContent>
                    </Card>

                    {/* Content */}
                    <div className="space-y-6">

                        {/* Profile */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-44" />
                                <Skeleton className="h-4 w-72" />
                            </CardHeader>

                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </CardContent>
                        </Card>

                        {/* Appearance */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-60" />
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                        </Card>

                        {/* Orders */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-60" />
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                        </Card>

                        {/* Security */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-60" />
                            </CardHeader>

                            <CardContent>
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}