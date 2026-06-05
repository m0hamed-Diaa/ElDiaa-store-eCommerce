import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                Settings
            </h1>

            <div className="rounded-xl border p-6 space-y-4">

                <Input placeholder="Store Name" />

                <Input placeholder="Support Email" />

                <Input placeholder="Shipping Cost" />

            </div>
        </div>
    );
}