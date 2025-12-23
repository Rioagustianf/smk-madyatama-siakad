"use client";

import { useBills } from "@/lib/hooks/use-finance";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StudentFinancePage() {
  const { data: billsData, isLoading } = useBills({});
  const bills = billsData?.data || [];

  const getStatusBadge = (status: string) => {
    const styles: any = {
      PAID: "bg-green-100 text-green-700 hover:bg-green-100",
      PENDING: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      OVERDUE: "bg-red-100 text-red-700 hover:bg-red-100",
      CANCELLED: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    };
    return <Badge className={styles[status] || ""}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Keuangan Saya</h1>
        <p className="text-muted-foreground">
          Informasi tagihan dan riwayat pembayaran
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Tagihan</CardTitle>
          <CardDescription>
            Berikut adalah daftar tagihan yang perlu Anda bayar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : bills.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Belum ada tagihan untuk Anda.
                  </TableCell>
                </TableRow>
              ) : (
                bills.map((bill: any) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">
                      {bill.title}
                      {bill.description && (
                        <p className="text-xs text-muted-foreground font-normal">
                          {bill.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="uppercase text-xs">
                      {bill.type}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(bill.dueDate), "dd MMM yyyy", {
                          locale: idLocale,
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      Rp {parseFloat(bill.amount).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>{getStatusBadge(bill.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
