"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/contexts/toast-context";
import { MapPin, Clock, Loader2 } from "lucide-react";

export default function AttendanceSettingsPage() {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("");

  // Fetch settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["attendance-settings"],
    queryFn: async () => {
      const res = await api.get("/api/attendance/settings");
      return res;
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put("/api/attendance/settings", data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-settings"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Pengaturan berhasil diperbarui",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal",
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    },
  });

  // Load settings into form
  useEffect(() => {
    if (settingsData?.data) {
      setLatitude(settingsData.data.latitude?.toString() || "");
      setLongitude(settingsData.data.longitude?.toString() || "");
      setRadius(settingsData.data.radius?.toString() || "");
    }
  }, [settingsData]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      addToast({
        type: "error",
        title: "Error",
        description: "Geolocation tidak didukung browser",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        addToast({
          type: "success",
          title: "Berhasil",
          description: "Lokasi berhasil diambil",
        });
      },
      (error) => {
        addToast({
          type: "error",
          title: "Error",
          description: "Gagal mengambil lokasi",
        });
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      latitude,
      longitude,
      radius,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan Absensi</h1>
        <p className="text-muted-foreground">
          Konfigurasi lokasi sekolah dan radius kehadiran
        </p>
      </div>

      {/* Current Settings Display */}
      {settingsData?.data && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Pengaturan Saat Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Latitude</p>
                <p className="font-mono font-semibold">
                  {settingsData.data.latitude}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Longitude</p>
                <p className="font-mono font-semibold">
                  {settingsData.data.longitude}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Radius</p>
                <p className="font-semibold">
                  {settingsData.data.radius} meter
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lokasi Sekolah</CardTitle>
          <CardDescription>
            Tentukan titik koordinat sekolah untuk validasi radius absensi siswa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="-6.175110"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="106.865036"
                  required
                />
              </div>
            </div>

            <Button
              type="button"
              className="bg-primary-950 text-white"
              onClick={handleGetCurrentLocation}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Gunakan Lokasi Saat Ini
            </Button>

            <div className="space-y-2">
              <Label htmlFor="radius">Radius (meter)</Label>
              <Input
                id="radius"
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="100"
                required
              />
              <p className="text-xs text-muted-foreground">
                Jarak maksimal siswa dari titik sekolah untuk dapat melakukan
                absensi
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                className="bg-primary-950 text-white"
                type="submit"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Pengaturan"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {latitude && longitude && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Lokasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`}
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
