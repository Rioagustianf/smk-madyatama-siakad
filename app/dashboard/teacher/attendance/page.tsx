"use client";

import { useState } from "react";
import {
  useTeacherSchedule,
  useClassAttendance,
  useVerifyAttendance,
} from "@/lib/hooks/use-attendance";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials";
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
  Clock,
  MapPin,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TeacherAttendancePage() {
  const { data: scheduleData, isLoading: scheduleLoading } =
    useTeacherSchedule();
  const { mutate: verifyPresence, isPending: isVerifying } =
    useVerifyAttendance();

  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch students when schedule selected
  const { data: attendanceList, isLoading: listLoading } = useClassAttendance(
    selectedSchedule?.class,
    selectedSchedule?.subjectId
  );

  const handleVerify = (
    studentData: any,
    status: string,
    isVerified = true
  ) => {
    // Prepare payload for upsert
    const payload = {
      attendanceId: studentData.attendance?.id,
      studentId: studentData.studentId,
      subjectId: selectedSchedule.subjectId,
      status: status,
      isVerified: isVerified,
    };
    verifyPresence(payload);
  };

  const renderStatusBadge = (attendance: any) => {
    if (!attendance)
      return (
        <Badge
          variant="outline"
          className="bg-slate-100 text-slate-500 border-slate-200"
        >
          Belum Absen
        </Badge>
      );

    const colors: any = {
      PRESENT:
        "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
      LATE: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
      SICK: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
      PERMISSION:
        "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100",
      ALPHA: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
    };

    return (
      <Badge
        className={`${
          colors[attendance.status] || ""
        } flex items-center gap-1 w-fit`}
      >
        {attendance.status}
        {attendance.isVerified && <CheckCircle className="w-3 h-3 ml-1" />}
      </Badge>
    );
  };

  const filteredStudents = attendanceList?.data?.filter(
    (student: any) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nisn.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Verifikasi Absensi
          </h1>
          <p className="text-muted-foreground">
            Kelola dan verifikasi kehadiran siswa di kelas Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT: SCHEDULE LIST */}
        <div className="md:col-span-4 lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium uppercase text-muted-foreground">
                Jadwal Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-2">
              {scheduleLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="animate-spin text-muted-foreground" />
                </div>
              ) : scheduleData?.data?.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                  Tidak ada jadwal mengajar hari ini
                </div>
              ) : (
                scheduleData?.data?.map((sched: any) => (
                  <div
                    key={sched.id}
                    onClick={() => setSelectedSchedule(sched)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedSchedule?.id === sched.id
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                        : "hover:bg-muted hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-primary-900">
                      {sched.subject}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="secondary" className="font-mono">
                        {sched.class}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2 py-1 rounded">
                        <Clock className="w-3 h-3" /> {sched.time}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: STUDENT LIST */}
        <div className="md:col-span-8 lg:col-span-9">
          <Card className="h-full border-none shadow-none md:border md:shadow-sm">
            <CardHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {selectedSchedule ? selectedSchedule.class : "Daftar Siswa"}
                </CardTitle>
                <CardDescription>
                  {selectedSchedule
                    ? selectedSchedule.subject
                    : "Pilih jadwal untuk melihat data"}
                </CardDescription>
              </div>
              {selectedSchedule && (
                <div className="w-1/3">
                  <Input
                    placeholder="Cari siswa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9"
                  />
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {!selectedSchedule ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-slate-50/50">
                  <div className="bg-slate-100 p-4 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="font-medium">Pilih jadwal di sebelah kiri</p>
                  <p className="text-sm">
                    untuk melihat dan memverifikasi absensi siswa.
                  </p>
                </div>
              ) : listLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="w-[300px]">Siswa</TableHead>
                      <TableHead>Status Saat Ini</TableHead>
                      <TableHead>Waktu & Lokasi</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          Tidak ada siswa ditemukan.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents?.map((item: any) => (
                        <TableRow
                          key={item.studentId}
                          className="hover:bg-slate-50/50"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <AvatarWithInitials
                                name={item.name}
                                className="h-9 w-9"
                              />
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {item.nisn}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {renderStatusBadge(item.attendance)}
                          </TableCell>
                          <TableCell>
                            {item.attendance?.timeIn ? (
                              <div className="space-y-1">
                                <div className="text-xs font-medium">
                                  {new Date(
                                    item.attendance.timeIn
                                  ).toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                  WIB
                                </div>
                                {item.attendance.photoUrl && (
                                  <a
                                    href={item.attendance.photoUrl}
                                    target="_blank"
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    <MapPin className="w-3 h-3" /> Lihat
                                    Lokasi/Foto
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                -
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Verification Button for Unverified Presence */}
                              {item.attendance &&
                                !item.attendance.isVerified && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                    onClick={() =>
                                      handleVerify(
                                        item,
                                        item.attendance.status,
                                        true
                                      )
                                    }
                                    title="Verifikasi Kehadiran"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />{" "}
                                    Verifikasi
                                  </Button>
                                )}

                              {/* Status Dropdown */}
                              <Select
                                value={item.attendance?.status || ""}
                                onValueChange={(val) =>
                                  handleVerify(item, val, true)
                                }
                              >
                                <SelectTrigger className="w-[110px] h-8 bg-white">
                                  <SelectValue placeholder="Set Status" />
                                </SelectTrigger>
                                <SelectContent align="end">
                                  <SelectItem value="PRESENT">Hadir</SelectItem>
                                  <SelectItem value="LATE">Telat</SelectItem>
                                  <SelectItem value="SICK">Sakit</SelectItem>
                                  <SelectItem value="PERMISSION">
                                    Izin
                                  </SelectItem>
                                  <SelectItem value="ALPHA">Alpha</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
