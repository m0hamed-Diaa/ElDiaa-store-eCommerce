import StatCard from "@/components/admin/StatCard";

const orders = [
    {
        id: "#1001",
        customer: "Mohamed",
        total: 2500,
        status: "Pending",
    },
    {
        id: "#1002",
        customer: "Ahmed",
        total: 5000,
        status: "Delivered",
    },
];
const OrdersPage = () => {
    return (
        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                Orders
            </h1>

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard title="Orders" value="450" />
                <StatCard title="Pending" value="12" />
                <StatCard title="Delivered" value="390" />
                <StatCard title="Revenue" value="250K" />
            </div>

            <div className="rounded-xl border p-4">

                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="flex justify-between border-b py-4"
                    >
                        <span>{order.id}</span>
                        <span>{order.customer}</span>
                        <span>{order.total} EGP</span>
                        <span>{order.status}</span>
                    </div>
                ))}

            </div>

        </div>
    )
}

export default OrdersPage
