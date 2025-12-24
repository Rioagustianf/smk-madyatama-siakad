"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { useTodaySchedule, useCheckIn } from "@/lib/hooks/use-attendance";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Camera, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/lib/contexts/toast-context";
import { ImageUpload } from "@/components/molecules/ImageUpload/ImageUpload";
import { fileUpload } from "@/lib/supabase-client";
import Image from "next/image";

export default function StudentAttendancePage() {
  const { data: scheduleData, isLoading } = useTodaySchedule();
  const { mutate: doCheckIn, isPending } = useCheckIn();
  const { addToast } = useToast();

  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("present");

  // Location State
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locError, setLocError] = useState<string | null>(null);

  // Webcam State
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [uploadingSelfie, setUploadingSelfie] = useState(false);

  // Permission State
  const [reason, setReason] = useState("");
  const [letterUrl, setLetterUrl] = useState("");

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocError("Geolocation tidak didukung browser ini");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocError(null);
      },
      (error) => {
        setLocError(
          "Gagal mengambil lokasi. Pastikan GPS aktif dan izin diberikan."
        );
      }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  const handleOpenAbsen = (subject: any) => {
    setSelectedSubject(subject);
    setImgSrc(null);
    setReason("");
    setLetterUrl("");
    setIsDialogOpen(true);
    // Refresh location
    getLocation();
  };

  const uploadSelfieToSupabase = async (base64Image: string) => {
    try {
      const res = await fetch(base64Image);
      const blob = await res.blob();
      const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });

      const result = await fileUpload.uploadImage(
        file,
        "madyatama",
        "attendance"
      );
      return result.url;
    } catch (e) {
      console.error(e);
      throw new Error("Gagal upload foto selfie");
    }
  };

  // Helper function to check if current time is within schedule time (with 15 min buffer before)
  const isWithinScheduleTime = (scheduleTime: string) => {
    if (!scheduleTime) return true;

    const timeMatch = scheduleTime.match(
      /(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/
    );
    if (!timeMatch) return true;

    const [_, startHour, startMin, endHour, endMin] = timeMatch;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = parseInt(startHour) * 60 + parseInt(startMin);
    const endMinutes = parseInt(endHour) * 60 + parseInt(endMin);

    // Allow check-in from 15 minutes before until end of class
    const allowedStart = startMinutes - 15;
    const allowedEnd = endMinutes;

    return currentMinutes >= allowedStart && currentMinutes <= allowedEnd;
  };

  const handleSubmit = async () => {
    if (!selectedSubject?.subjectId) {
      addToast({
        type: "error",
        title: "Error",
        description: "Data Mapel Invalid",
      });
      return;
    }

    // Prepare Payload
    const payload: any = {
      subjectId: selectedSubject.subjectId,
      scheduleTime: selectedSubject.time, // Pass schedule time for validation
    };

    if (activeTab === "present") {
      if (!location) {
        addToast({
          type: "error",
          title: "Lokasi Wajib",
          description: "Tunggu lokasi terdeteksi",
        });
        return;
      }
      if (!imgSrc) {
        addToast({
          type: "error",
          title: "Foto Wajib",
          description: "Ambil foto selfie dulu",
        });
        return;
      }

      try {
        setUploadingSelfie(true);
        const url = await uploadSelfieToSupabase(imgSrc);

        payload.status = "PRESENT";
        payload.latitude = location.latitude;
        payload.longitude = location.longitude;
        payload.photoUrl = url;
      } catch (e) {
        addToast({
          type: "error",
          title: "Upload Gagal",
          description: "Gagal upload selfie",
        });
        setUploadingSelfie(false);
        return;
      } finally {
        setUploadingSelfie(false);
      }
    } else {
      // Permission / Sick
      if (!reason) {
        addToast({
          type: "error",
          title: "Alasan Wajib",
          description: "Isi alasan izin/sakit",
        });
        return;
      }
      payload.status = activeTab === "sick" ? "SICK" : "PERMISSION";
      payload.notes = reason;
      payload.photoUrl = letterUrl || null;
    }

    doCheckIn(payload, {
      onSuccess: () => {
        setIsDialogOpen(false);
      },
    });
  };

  // Render Functions
  const renderStatusBadge = (attendance: any) => {
    if (!attendance) return <Badge variant="destructive">Belum Absen</Badge>;

    const colors: any = {
      PRESENT: "bg-green-100 text-green-800",
      LATE: "bg-yellow-100 text-yellow-800",
      SICK: "bg-blue-100 text-blue-800",
      PERMISSION: "bg-purple-100 text-purple-800",
      ALPHA: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={colors[attendance.status] || ""}>
        {attendance.status} {attendance.isVerified ? "✓" : "(Pending)"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Absensi Pelajaran</h1>
        <p className="text-muted-foreground">
          {scheduleData?.day
            ? `Jadwal Hari ${scheduleData.day}`
            : "Memuat jadwal..."}
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2" />
            <p className="text-muted-foreground">Memuat jadwal...</p>
          </CardContent>
        </Card>
      ) : !scheduleData?.success ? (
        <Card>
          <CardContent className="py-8 text-center text-red-500">
            <p>Gagal memuat jadwal. Silakan refresh halaman.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Error: {scheduleData?.message || "Unknown error"}
            </p>
          </CardContent>
        </Card>
      ) : scheduleData?.data?.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Tidak ada jadwal pelajaran untuk hari {scheduleData.day}.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scheduleData?.data?.map((item: any, idx: number) => (
            <Card
              key={idx}
              className={
                item.attendance
                  ? "border border-primary-600 bg-primary-700"
                  : "border border-primary-600"
              }
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.subject}</CardTitle>
                  {renderStatusBadge(item.attendance)}
                </div>
                <p className="text-sm text-muted-foreground">{item.time} WIB</p>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <UserIcon className="w-4 h-4" />
                    <span>{item.teacherName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{item.time}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {!item.subjectId ? (
                  <div className="w-full space-y-2">
                    <p className="text-xs text-orange-600 text-center">
                      ⚠️ Mata pelajaran belum terdaftar di sistem. Hubungi
                      admin.
                    </p>
                    <Button className="w-full" variant="outline" disabled>
                      Tidak Dapat Absen
                    </Button>
                  </div>
                ) : item.attendance ? (
                  <Button className="w-full" disabled>
                    Sudah Absen
                  </Button>
                ) : !isWithinScheduleTime(item.time) ? (
                  <div className="w-full space-y-2">
                    <p className="text-xs text-amber-600 text-center">
                      ⏰ Belum/Sudah lewat waktu absensi ({item.time})
                    </p>
                    <Button className="w-full" variant="outline" disabled>
                      Tidak Dapat Absen
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-primary-950 text-white"
                    onClick={() => handleOpenAbsen(item)}
                  >
                    Lakukan Absensi
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Absen Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Absensi: {selectedSubject?.subject}</DialogTitle>
            <DialogDescription>
              Pilih metode absensi di bawah ini.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="present">Hadir (Selfie)</TabsTrigger>
              <TabsTrigger value="permission">Izin / Sakit</TabsTrigger>
            </TabsList>

            {/* TAB HADIR */}
            <TabsContent value="present" className="space-y-4">
              <div className="border border-primary-600 rounded-lg p-2 bg-muted/20 text-center">
                <div className="flex items-center justify-center gap-2 text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {location
                      ? `${location.latitude.toFixed(
                          6
                        )}, ${location.longitude.toFixed(6)}`
                      : "Mencari lokasi..."}
                  </span>
                </div>
                {locError && <p className="text-xs text-red-500">{locError}</p>}
              </div>

              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt="Selfie"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    mirrored
                  />
                )}
              </div>

              <div className="flex justify-center">
                {imgSrc ? (
                  <Button variant="outline" onClick={() => setImgSrc(null)}>
                    Foto Ulang
                  </Button>
                ) : (
                  <Button
                    onClick={capture}
                    disabled={!location}
                    className="bg-primary-950 text-white"
                  >
                    <Camera className="mr-2 h-4 w-4" /> Ambil Foto
                  </Button>
                )}
              </div>
            </TabsContent>

            {/* TAB IDIN */}
            <TabsContent value="permission" className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={activeTab === "sick" ? "default" : "outline"}
                  onClick={() => setActiveTab("sick")}
                  size="sm"
                  className="flex-1"
                >
                  Sakit
                </Button>
                <Button
                  variant={activeTab === "permission" ? "default" : "outline"}
                  onClick={() => setActiveTab("permission")}
                  size="sm"
                  className="flex-1"
                >
                  Izin
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Isi Alasan</Label>
                <Textarea
                  placeholder="Contoh: Sakit demam sejak semalam..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Surat (Opsional)</Label>
                <ImageUpload
                  value={letterUrl}
                  onChange={setLetterUrl}
                  label="Foto Surat"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="border border-primary-600 "
              onClick={() => setIsDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="bg-primary-950 text-white"
              onClick={handleSubmit}
              disabled={
                isPending ||
                uploadingSelfie ||
                (!location && activeTab === "present")
              }
            >
              {isPending || uploadingSelfie ? "Mengirim..." : "Kirim Absensi"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
