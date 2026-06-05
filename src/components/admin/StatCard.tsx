interface Props {
    title: string;
    value: string;
    change?: string;
}

export default function StatCard({
    title,
    value,
    change,
}: Props) {
    return (
        <div className="rounded-xl border bg-card p-5 flex items-center justify-between">
            <div>
                <p className="text-muted-foreground">
                    {title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                    {value}
                </h2>
            </div>
            {change && (
                <div className="rounded-full w-fit  bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {change}
                </div>
            )}
        </div>
    );
}