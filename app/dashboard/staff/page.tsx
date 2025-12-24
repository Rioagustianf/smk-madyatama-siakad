"use client";

import React from "react";
import { Typography } from "@/components/atoms/Typography/Typography";
import { useBills } from "@/lib/hooks/use-finance";
import { Wallet, FileText, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StaffDashboardPage() {
  const { data: billsResp } = useBills({ page: 1, limit: 100 } as any);

  const bills = (billsResp as any)?.data || [];
  const totalBills = bills.length;
  const paidBills = bills.filter((b: any) => b.status === "PAID").length;
  const unpaidBills = bills.filter((b: any) => b.status === "UNPAID").length;
  const pendingPayments = bills.filter((b: any) =>
    b.payments?.some((p: any) => p.status === "PENDING")
  ).length;

  const stats = [
    {
      title: "Total Tagihan",
      value: totalBills,
      icon: FileText,
      desc: "Semua tagihan",
      color: "bg-blue-500",
    },
    {
      title: "Belum Dibayar",
      value: unpaidBills,
      icon: Clock,
      desc: "Menunggu pembayaran",
      color: "bg-orange-500",
    },
    {
      title: "Sudah Lunas",
      value: paidBills,
      icon: CheckCircle,
      desc: "Pembayaran selesai",
      color: "bg-green-500",
    },
    {
      title: "Perlu Konfirmasi",
      value: pendingPayments,
      icon: Wallet,
      desc: "Menunggu verifikasi",
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div>
        <Typography variant="h4" className="mb-2">
          Dashboard Keuangan
        </Typography>
        <Typography variant="body2" color="muted">
          Kelola tagihan dan pembayaran siswa
        </Typography>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon
                className={`h-4 w-4 text-white ${stat.color} p-1 rounded`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            href: "/dashboard/staff/finance/bills",
            title: "Kelola Tagihan",
            desc: "Buat dan kelola tagihan siswa",
          },
          {
            href: "/dashboard/staff/finance/payments",
            title: "Konfirmasi Pembayaran",
            desc: "Verifikasi bukti pembayaran",
          },
        ].map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="rounded-xl border border-primary-700 p-5 bg-white hover:border-primary-300 transition-colors"
          >
            <Typography variant="subtitle2" className="mb-1">
              {l.title}
            </Typography>
            <Typography variant="body2" color="muted">
              {l.desc}
            </Typography>
          </a>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bills.slice(0, 5).map((bill: any) => (
              <div
                key={bill.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <Typography variant="subtitle2">{bill.title}</Typography>
                  <Typography variant="caption" color="muted">
                    {bill.student?.name || "Unknown Student"}
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography variant="subtitle2">
                    Rp {new Intl.NumberFormat("id-ID").format(bill.amount)}
                  </Typography>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      bill.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {bill.status}
                  </span>
                </div>
              </div>
            ))}
            {bills.length === 0 && (
              <Typography
                variant="body2"
                color="muted"
                className="text-center py-4"
              >
                Belum ada tagihan
              </Typography>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
