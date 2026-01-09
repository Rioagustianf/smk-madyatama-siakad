"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Copy, Send, Trash2, Unplug } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

interface Device {
  name: string;
  device: string;
  token: string;
  status: string; // "connect" or other
  quota: string;
  package: string;
  expired: string;
  autoread: string;
  "ai-data": string;
  "ai-quota": string;
}

export default function WhatsappSettingsPage() {
  const [deviceName, setDeviceName] = useState("");
  const [deviceNumber, setDeviceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [linkedDevice, setLinkedDevice] = useState<any>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteDeviceToken, setDeleteDeviceToken] = useState<string | null>(
    null
  );
  const [deleteDeviceName, setDeleteDeviceName] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await fetch("/api/settings/whatsapp");
      const data = await res.json();
      console.log("Devices Response:", data);
      if (data.success) {
        setDevices(data.devices || []);
        setLinkedDevice(data.localDevice);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddDevice = async () => {
    if (!deviceName || deviceName.trim() === "") {
      toast.error("Masukkan nama device");
      return;
    }

    if (!deviceNumber || deviceNumber.trim() === "") {
      toast.error("Masukkan nomor device");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_device",
          deviceName,
          deviceNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Device baru berhasil ditambahkan!");
        setShowAddDialog(false);
        setDeviceName("");
        setDeviceNumber("");
        fetchDevices();
        // Auto show QR
        setTimeout(() => handleGetQr(data.deviceToken), 500);
      } else {
        toast.error(data.message || "Gagal menambahkan device");
      }
    } catch (e) {
      toast.error("Error menambahkan device");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkDevice = async (deviceToken: string, deviceName: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "link_device",
          deviceToken,
          deviceName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Device berhasil di-link!");
        fetchDevices();
      } else {
        toast.error(data.message || "Gagal link device");
      }
    } catch (e) {
      toast.error("Error linking device");
    } finally {
      setLoading(false);
    }
  };

  const handleGetQr = async (token: string) => {
    setLoading(true);
    setQrCode(null);
    try {
      const res = await fetch("/api/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_qr", token }),
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setQrCode(data.data.url);
        toast.success("Scan QR Code dengan WhatsApp Anda");
      } else {
        toast.error(data.message || "Gagal mendapatkan QR Code");
      }
    } catch (e) {
      toast.error("Error fetching QR");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (token: string) => {
    if (!confirm("Disconnect device ini?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect", token }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Device berhasil di-disconnect");
        fetchDevices();
      }
    } catch (e) {
      toast.error("Error disconnecting");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (token: string, name: string) => {
    setDeleteDeviceToken(token);
    setDeleteDeviceName(name);
    setOtp("");
    setOtpRequested(false);
    setShowDeleteDialog(true);
  };

  const handleRequestDeleteOtp = async () => {
    if (!deleteDeviceToken) return;
    setLoading(true);
    try {
      const res = await fetch("/api/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_device",
          token: deleteDeviceToken,
        }),
      });
      const data = await res.json();
      if (data.success && data.otpRequested) {
        setOtpRequested(true);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Gagal request OTP");
      }
    } catch (e) {
      toast.error("Error requesting OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDevice = async () => {
    if (!deleteDeviceToken || !otp) {
      toast.error("Masukkan kode OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_device",
          token: deleteDeviceToken,
          otp,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Device berhasil dihapus");
        setShowDeleteDialog(false);
        setDeleteDeviceToken(null);
        setOtp("");
        setOtpRequested(false);
        fetchDevices();
      } else {
        toast.error(data.message || "Gagal menghapus device");
      }
    } catch (e) {
      toast.error("Error deleting device");
    } finally {
      setLoading(false);
    }
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success("Token copied!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp Configuration</h1>
          <p className="text-sm text-muted-foreground">
            Manage your WhatsApp devices for notifications
          </p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Device
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
              <DialogDescription>
                Create a new WhatsApp device for this school.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="deviceName">Device Name</Label>
                <Input
                  id="deviceName"
                  placeholder="e.g., SMK Madyatama"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceNumber">Device Number</Label>
                <Input
                  id="deviceNumber"
                  placeholder="e.g., 08123456789"
                  value={deviceNumber}
                  onChange={(e) => setDeviceNumber(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Nomor unik untuk device ini (min 8, max 15 digit)
                </p>
              </div>
              <Button
                onClick={handleAddDevice}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Create Device
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Devices</CardTitle>
          <CardDescription>
            Devices connected to your Fonnte account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No devices found. Click &quot;Add New Device&quot; to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Quota</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device, index) => (
                  <TableRow key={device.token}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>{device.device || "-"}</TableCell>
                    <TableCell>{device.quota || 0}</TableCell>
                    <TableCell>
                      {device.status === "connect" ? (
                        <Badge className="bg-green-500">Connected</Badge>
                      ) : (
                        <Badge variant="secondary">Not Connected</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToken(device.token)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Token
                        </Button>

                        {device.status !== "connect" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleGetQr(device.token)}
                          >
                            <Send className="w-3 h-3 mr-1" />
                            Get QR
                          </Button>
                        )}

                        {device.status === "connect" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDisconnect(device.token)}
                          >
                            <Unplug className="w-3 h-3 mr-1" />
                            Disconnect
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            openDeleteDialog(device.token, device.name)
                          }
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>

                        {linkedDevice?.token !== device.token && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              handleLinkDevice(device.token, device.name)
                            }
                          >
                            Use This
                          </Button>
                        )}

                        {linkedDevice?.token === device.token && (
                          <Badge variant="default">Active</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      {qrCode && (
        <Dialog open={!!qrCode} onOpenChange={() => setQrCode(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
              <DialogDescription>
                Open WhatsApp → Linked Devices → Link a Device
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image
                src={`data:image/png;base64,${qrCode}`}
                alt="QR Code"
                className="w-64 h-64 border rounded-lg"
                width={256}
                height={256}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Device Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Device</DialogTitle>
            <DialogDescription>
              {otpRequested
                ? "Masukkan kode OTP yang dikirim ke WhatsApp Anda"
                : `Apakah Anda yakin ingin menghapus device "${deleteDeviceName}"? OTP akan dikirim ke nomor WhatsApp yang terdaftar.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {otpRequested ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">Kode OTP</Label>
                  <Input
                    id="otp"
                    placeholder="Masukkan kode OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleDeleteDevice}
                  disabled={loading || !otp}
                  variant="destructive"
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Konfirmasi Hapus
                </Button>
              </>
            ) : (
              <Button
                onClick={handleRequestDeleteOtp}
                disabled={loading}
                variant="destructive"
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Kirim OTP untuk Hapus
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
