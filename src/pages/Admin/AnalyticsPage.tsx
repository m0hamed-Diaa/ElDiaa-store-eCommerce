import StatCard from "@/components/admin/StatCard";


export default function AnalyticsPage() {
    return (
        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                Analytics
            </h1>

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard title="Revenue" value="500K EGP" />
                <StatCard title="Orders" value="1400" />
                <StatCard title="Users" value="3500" />
                <StatCard title="Conversion" value="3.4%" />
            </div>

            <div className="h-96 rounded-xl border flex items-center justify-center">
                Revenue Chart
            </div>

        </div>
    );
}