import StatCard from "@/components/admin/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import DropdownMenuActions from "@/components/shared/DropdownMenuActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import UserProfileIcon from "@/components/UserProfileIcon";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function AdminDashboard() {
  const { t } = useTranslation("adminDashboard");

  const stats = [
    {
      title: t("totalRevenue"),
      value: '$48,290',
      change: '+12.5%',
    },
    {
      title: t("totalOrders"),
      value: '1,245',
      change: '+8.2%',
    },
    {
      title: t("totalUsers"),
      value: '8,421',
      change: '+18.1%',
    },
    {
      title: t("totalProducts"),
      value: '326',
      change: '+4.3%',
    },
  ];

  const recentOrders = [
    {
      orderId: '#1024',
      customer: 'Mohamed Diaa',
      total: '$249',
      method: 'Credit Card',
      status: 'completed',
      action: null,
    },
    {
      orderId: '#1025',
      customer: 'Ahmed Ali',
      total: '$119',
      method: 'PayPal',
      status: 'pending',
      action: null,
    },
    {
      orderId: '#1026',
      customer: 'Sara Hassan',
      total: '$530',
      method: 'kash',
      status: 'shipped',
      action: null,
    },
    {
      orderId: '#1027',
      customer: 'Omar Khaled',
      total: '$75',
      method: 'Bank Transfer',
      status: 'cancelled',
      action: null,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30 w-full">
      <div className="flex">
        {/* CONTENT */}
        <main className="flex-1">
          {/* HEADER */}
          <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-6 mb-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {t("dashboard")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("dashboardTitle")}
                </p>
              </div>
              <UserProfileIcon />
            </div>
          </header>

          <div className="space-y-8 p-6">
            {/* STATS */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <StatCard key={item.title} title={item.title} value={item.value} change={item.change} />
              ))}
            </section>

            {/* CHARTS */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-3xl border bg-background p-6 shadow-sm xl:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {t("revenueAnalytics")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("revenueOverview")}
                    </p>
                  </div>

                  <Button variant="outline" size="sm">
                    {t("export")}
                  </Button>
                </div>

                <div className="flex h-80 items-end gap-4 rounded-2xl bg-muted/40 p-6">
                  {[40, 70, 55, 90, 65, 120, 80, 95, 130, 110].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-2xl bg-primary/80 transition hover:bg-primary"
                        style={{ height: `${height * 2}px` }}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="rounded-3xl border bg-background p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-bold">
                    {t("salesOverview")}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {t("salesContent")}
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      label: "completedOrders",
                      value: '78%',
                    },
                    {
                      label: "pendingOrders",
                      value: '14%',
                    },
                    {
                      label: "cancelled",
                      value: '8%',
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>{t(item.label)}</span>
                        <span className="font-semibold">
                          {item.value}
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: item.value }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* TABLE */}
            <section className="rounded-3xl border bg-background shadow-sm">
              <div className="flex items-center justify-between border-b p-6">
                <div>
                  <h3 className="text-xl font-bold">
                    {t("recentOrders")}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {t("recentContent")}
                  </p>
                </div>

                <Button variant="outline" size="sm">
                  <Link to="/admin/orders">{t("viewAll")}</Link>
                </Button>
              </div>

              <DataTable translationKey="adminDashboard"
                tableHeader={<>
                  <TableHead>{t("orderId")}</TableHead>
                  <TableHead>{t("customer")}</TableHead>
                  <TableHead>{t("total")}</TableHead>
                  <TableHead>{t("method")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("action")}</TableHead>
                </>}
                tableBody={<>
                  {recentOrders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell> {order.customer}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>{order.method}</TableCell>
                      <TableCell>
                        {order.status === 'completed' ? <Badge variant="default">{t(order.status)}</Badge> : <Badge variant="destructive">{t(order.status)}</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenuActions id={order.orderId} />
                      </TableCell>
                    </TableRow>
                  ))}
                </>}
              />

            </section>
          </div>
        </main>
      </div >
    </div >
  );
}
