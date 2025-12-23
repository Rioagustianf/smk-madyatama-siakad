"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Search, Filter, Calendar } from "lucide-react";
import { useBills, useCreateBill, usePayBill } from "@/lib/hooks/use-finance";
import { useStudents } from "@/lib/hooks/use-api";
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials";

export default function AdminBillsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data: billsData, isLoading: billsLoading } = useBills({
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const { data: studentsData } = useStudents({ limit: 1000 });
  const students = (studentsData as any)?.data || [];

  const createMutation = useCreateBill();

  // Form State
  // Payment State
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [payData, setPayData] = useState({
    amount: "",
    method: "CASH",
    notes: "",
  });

  const payMutation = usePayBill();

  const handleOpenPay = (bill: any) => {
    setSelectedBill(bill);
    // Default to remaining amount
    const paid = bill.payments.reduce(
      (sum: number, p: any) => sum + Number(p.amount),
      0
    );
    const remaining = Number(bill.amount) - paid;
    setPayData({
      amount: remaining.toString(),
      method: "CASH",
      notes: "",
    });
    setIsPayOpen(true);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBill) return;

    payMutation.mutate(
      {
        billId: selectedBill.id,
        ...payData,
      },
      {
        onSuccess: () => {
          setIsPayOpen(false);
          setSelectedBill(null);
        },
      }
    );
  };

  const [formData, setFormData] = useState({
    studentId: "",
    title: "",
    amount: "",
    type: "SPP",
    dueDate: "",
    description: "",
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setFormData({
          studentId: "",
          title: "",
          amount: "",
          type: "SPP",
          dueDate: "",
          description: "",
        });
      },
    });
  };

  const filteredBills = billsData?.data?.filter(
    (bill: any) =>
      bill.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Tagihan</h1>
          <p className="text-muted-foreground">
            Kelola tagihan SPP dan pembayaran siswa
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-950 text-white">
              <Plus className="mr-2 h-4 w-4" /> Buat Tagihan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Buat Tagihan Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Siswa</Label>
                <Select
                  value={formData.studentId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, studentId: val })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Siswa" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {students.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.class})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Judul Tagihan</Label>
                  <Input
                    placeholder="Contoh: SPP Januari 2024"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipe</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(val) =>
                      setFormData({ ...formData, type: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SPP">SPP</SelectItem>
                      <SelectItem value="BUILDING">Uang Gedung</SelectItem>
                      <SelectItem value="EXAM">Uang Ujian</SelectItem>
                      <SelectItem value="OTHER">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Jumlah (Rp)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jatuh Tempo</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Keterangan (Opsional)</Label>
                <Textarea
                  placeholder="Catatan tambahan..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-primary-950 text-white"
                >
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Simpan Tagihan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Catat Pembayaran</DialogTitle>
            <DialogDescription>
              {selectedBill?.title} - {selectedBill?.student.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePay} className="space-y-4">
            <div className="space-y-2">
              <Label>Jumlah Bayar (Rp)</Label>
              <Input
                type="number"
                value={payData.amount}
                onChange={(e) =>
                  setPayData({ ...payData, amount: e.target.value })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Sisa tagihan: Rp{" "}
                {(
                  Number(selectedBill?.amount || 0) -
                  (selectedBill?.payments?.reduce(
                    (s: number, p: any) => s + Number(p.amount),
                    0
                  ) || 0)
                ).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Metode Pembayaran</Label>
              <Select
                value={payData.method}
                onValueChange={(v) => setPayData({ ...payData, method: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Tunai (Cash)</SelectItem>
                  <SelectItem value="TRANSFER">Transfer Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Catatan</Label>
              <Textarea
                value={payData.notes}
                onChange={(e) =>
                  setPayData({ ...payData, notes: e.target.value })
                }
                placeholder="Keterangan pembayaran..."
              />
            </div>
            <div className="flex justify-end gap-2 text-white">
              <Button
                type="button"
                variant="outline"
                className="text-black"
                onClick={() => setIsPayOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={payMutation.isPending}
                className="bg-primary-950"
              >
                {payMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simpan Pembayaran
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari tagihan..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  <SelectItem value="PENDING">Belum Lunas</SelectItem>
                  <SelectItem value="PAID">Lunas</SelectItem>
                  <SelectItem value="OVERDUE">Jatuh Tempo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Siswa</TableHead>
                <TableHead>Tagihan</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredBills?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Tidak ada data tagihan ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredBills?.map((bill: any) => (
                  <TableRow key={bill.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <AvatarWithInitials
                          name={bill.student.name}
                          className="h-8 w-8"
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {bill.student.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {bill.student.class} - {bill.student.nisn}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{bill.title}</p>
                        <p className="text-xs text-muted-foreground uppercase">
                          {bill.type}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      Rp {parseFloat(bill.amount).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(bill.dueDate), "dd MMM yyyy", {
                          locale: idLocale,
                        })}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(bill.status)}</TableCell>
                    <TableCell className="text-right">
                      {bill.status !== "PAID" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleOpenPay(bill)}
                        >
                          Bayar
                        </Button>
                      )}
                    </TableCell>
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
