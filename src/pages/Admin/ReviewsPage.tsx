import StatCard from "@/components/admin/StatCard";


export default function ReviewsPage() {
    return (
        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                Reviews
            </h1>

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard title="Reviews" value="2400" />
                <StatCard title="Average" value="4.8" />
                <StatCard title="Pending" value="15" />
                <StatCard title="Published" value="2385" />
            </div>

        </div>
    );
}