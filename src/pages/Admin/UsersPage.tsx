import StatCard from "@/components/admin/StatCard";

const users = [
    {
        id: 1,
        name: "Mohamed",
        email: "mo@test.com",
        orders: 10,
    },
];

export default function UsersPage() {
    return (
        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                Users
            </h1>

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard title="Users" value="1500" />
                <StatCard title="Active" value="1200" />
                <StatCard title="Blocked" value="15" />
                <StatCard title="New" value="55" />
            </div>

            <div className="rounded-xl border p-4">

                {users.map((user) => (
                    <div
                        key={user.id}
                        className="flex justify-between py-4 border-b"
                    >
                        <span>{user.name}</span>
                        <span>{user.email}</span>
                        <span>{user.orders}</span>
                    </div>
                ))}

            </div>

        </div>
    );
}