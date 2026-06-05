import { Card, CardContent } from "@/components/ui/card";

export default function ProductCardSkeleton() {
    return (
        <>
            <Card className="group relative overflow-hidden rounded-2xl border bg-card">
                <CardContent className="p-5 space-y-4">

                    {/* ===== IMAGE AREA ===== */}
                    <div className="relative h-56 overflow-hidden rounded-xl bg-muted/40">

                        {/* Shimmer Overlay */}
                        <div className="absolute inset-0 shimmer" />

                    </div>
                    {/* ===== TITLE ===== */}
                    <div className="h-5 w-2/3 rounded-md bg-muted relative overflow-hidden">
                        <div className="absolute inset-0 shimmer" />
                    </div>

                    {/* ===== RATING ===== */}
                    <div className="h-4 w-1/2 rounded-md bg-muted relative overflow-hidden">
                        <div className="absolute inset-0 shimmer" />
                    </div>

                    {/* ===== DESCRIPTION ===== */}
                    <div className="space-y-2">
                        <div className="h-4 w-full rounded-md bg-muted relative overflow-hidden">
                            <div className="absolute inset-0 shimmer" />
                        </div>
                        <div className="h-4 w-5/6 rounded-md bg-muted relative overflow-hidden">
                            <div className="absolute inset-0 shimmer" />
                        </div>
                    </div>

                    {/* ===== PRICE ===== */}
                    <div className="flex gap-3">
                        <div className="h-6 w-20 rounded-md bg-muted relative overflow-hidden">
                            <div className="absolute inset-0 shimmer" />
                        </div>

                        <div className="h-6 w-16 rounded-md bg-muted relative overflow-hidden">
                            <div className="absolute inset-0 shimmer" />
                        </div>
                    </div>

                    {/* ===== BUTTONS ===== */}
                    <div className="flex gap-2 pt-2">
                        <div className="h-10 flex-1 rounded-xl bg-muted relative overflow-hidden">
                            <div className="absolute inset-0 shimmer" />
                        </div>

                        <div className="h-10 flex-1 rounded-xl bg-muted relative overflow-hidden">
                            <div className="absolute inset-0 shimmer" />
                        </div>
                    </div>

                </CardContent>
            </Card>
        </>
    );
}