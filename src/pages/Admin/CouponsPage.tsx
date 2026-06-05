const coupons = [
    {
        code: "SUMMER20",
        discount: 20,
    },
    {
        code: "WELCOME10",
        discount: 10,
    },
];

export default function CouponsPage() {
    return (
        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                Coupons
            </h1>

            <div className="rounded-xl border p-4">

                {coupons.map((coupon) => (
                    <div
                        key={coupon.code}
                        className="flex justify-between border-b py-3"
                    >
                        <span>{coupon.code}</span>
                        <span>{coupon.discount}%</span>
                    </div>
                ))}

            </div>

        </div>
    );
}