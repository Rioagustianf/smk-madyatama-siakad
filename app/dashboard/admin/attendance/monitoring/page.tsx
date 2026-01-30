"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Users,
  ClipboardCheck,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function AttendanceMonitoringPage() {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [classFilter, setClassFilter] = useState("");

  const { data: monitoringData, isLoading } = useQuery({
    queryKey: ["attendance-monitoring", selectedDate, classFilter],
    queryFn: async () => {
      const res = await api.get("/api/attendance/monitoring", {
        params: { date: selectedDate, class: classFilter || undefined },
      });
      return res;
    },
  });

  const renderStatusBadge = (status: string, isVerified: boolean) => {
    const colors: any = {
      PRESENT: "bg-green-100 text-green-800 border-green-200",
      LATE: "bg-yellow-100 text-yellow-800 border-yellow-200",
      SICK: "bg-blue-100 text-blue-800 border-blue-200",
      PERMISSION: "bg-purple-100 text-purple-800 border-purple-200",
      ALPHA: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <div className="flex items-center gap-2">
        <Badge className={colors[status] || ""}>{status}</Badge>
        {isVerified ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <XCircle className="w-4 h-4 text-gray-400" />
        )}
      </div>
    );
  };

  const summary = monitoringData?.summary || {
    total: 0,
    present: 0,
    sick: 0,
    permission: 0,
    alpha: 0,
    verified: 0,
    pending: 0,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Monitoring Absensi</h1>
        <p className="text-muted-foreground">Rekap kehadiran siswa per hari</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Absensi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hadir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary.present}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Terverifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {summary.verified}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {summary.pending}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Kelas (Opsional)</Label>
              <Input
                placeholder="Contoh: X TKJ 1"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Absensi</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin h-8 w-8" />
            </div>
          ) : monitoringData?.data?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada data absensi untuk tanggal ini
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NISN</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Keterangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monitoringData?.data?.map((record: any) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono text-sm">
                      {record.student?.nisn || "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {record.student?.name || "Data siswa tidak tersedia"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {record.student?.class || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.subject?.name || "-"}</TableCell>
                    <TableCell>
                      {renderStatusBadge(record.status, record.isVerified)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {record.timeIn
                        ? format(new Date(record.timeIn), "HH:mm", {
                            locale: localeId,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {record.notes || "-"}
                      {record.photoUrl && (
                        <a
                          href={record.photoUrl}
                          target="_blank"
                          className="text-blue-500 hover:underline ml-2"
                        >
                          Lihat Foto
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
