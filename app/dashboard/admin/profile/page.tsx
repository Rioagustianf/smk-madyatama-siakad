"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/molecules/ImageUpload/ImageUpload";
import { Plus, Trash2 } from "lucide-react";
import { useProfile, useUpdateProfile } from "@/lib/hooks/use-profile";

export default function AdminProfilePage() {
  const { data } = useProfile();
  const updateMutation = useUpdateProfile();
  const [form, setForm] = React.useState({
    history: "",
    historyImage: "",
    vision: "",
    mission: "",
    facilities: [] as { name: string; description: string; image: string }[],
    organization: [] as { role: string; name: string; image?: string }[],
    address: {
      street: "",
      kelurahan: "",
      kecamatan: "",
      city: "",
      province: "",
    },
    contact: {
      phone: "",
      email: "",
      instagram: "",
      facebook: "",
      youtube: "",
    },
  });

  const update = (path: string, value: any) => {
    setForm((prev) => {
      const next: any = { ...prev };
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const addFacility = () =>
    setForm((p) => ({
      ...p,
      facilities: [...p.facilities, { name: "", description: "", image: "" }],
    }));

  const removeFacility = (idx: number) =>
    setForm((p) => ({
      ...p,
      facilities: p.facilities.filter((_, i) => i !== idx),
    }));

  React.useEffect(() => {
    const p = (data as any)?.data;
    if (p) {
      setForm((prev) => ({
        ...prev,
        history: p.history || "",
        historyImage: p.historyImage || "",
        vision: p.vision || "",
        mission: p.mission || "",
        facilities: p.facilities || [],
        organization: p.organization || [],
        address: p.address || prev.address,
        contact: p.contact || prev.contact,
      }));
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Profil Sekolah
          </h1>
          <p className="text-muted-foreground">
            Sesuaikan dengan konten halaman publik Profil Sekolah
          </p>
        </div>

        {/* Sejarah, Visi, Misi */}
        <Card className="border border-primary-900">
          <CardHeader>
            <CardTitle>Sejarah, Visi, Misi</CardTitle>
            <CardDescription>Konten utama halaman profil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Sejarah singkat sekolah"
                rows={6}
                value={form.history}
                onChange={(e) => update("history", e.target.value)}
                className="border border-primary-600"
              />
              <ImageUpload
                label="Gambar untuk section Sejarah"
                value={form.historyImage}
                onChange={(v) => update("historyImage", v)}
                maxSizeMB={5}
              />
              <Input
                placeholder="Visi"
                value={form.vision}
                onChange={(e) => update("vision", e.target.value)}
                className="border border-primary-600"
              />
              <Textarea
                placeholder="Misi (pisahkan dengan baris baru)"
                rows={5}
                value={form.mission}
                onChange={(e) => update("mission", e.target.value)}
                className="border border-primary-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Fasilitas */}
        <Card className="border border-primary-900">
          <CardHeader>
            <CardTitle>Fasilitas Unggulan</CardTitle>
            <CardDescription>Nama, deskripsi, dan gambar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {form.facilities.map((f, idx) => (
                <div
                  key={idx}
                  className="grid md:grid-cols-3 gap-3 items-start border rounded-md p-3"
                >
                  <Input
                    placeholder="Nama Fasilitas"
                    value={f.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((p) => {
                        const facilities = [...p.facilities];
                        facilities[idx] = { ...facilities[idx], name: val };
                        return { ...p, facilities } as any;
                      });
                    }}
                    className="border border-primary-600"
                  />
                  <Textarea
                    placeholder="Deskripsi singkat"
                    rows={3}
                    value={f.description}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((p) => {
                        const facilities = [...p.facilities];
                        facilities[idx] = {
                          ...facilities[idx],
                          description: val,
                        };
                        return { ...p, facilities } as any;
                      });
                    }}
                    className="border border-primary-600"
                  />
                  <div>
                    <ImageUpload
                      label="Gambar"
                      value={f.image}
                      onChange={(v) => {
                        setForm((p) => {
                          const facilities = [...p.facilities];
                          facilities[idx] = { ...facilities[idx], image: v };
                          return { ...p, facilities } as any;
                        });
                      }}
                      maxSizeMB={5}
                    />
                  </div>
                  <div className="md:col-span-3 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => removeFacility(idx)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addFacility}>
                <Plus className="h-4 w-4 mr-1" /> Tambah Fasilitas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Struktur Organisasi */}
        <Card className="border border-primary-900">
          <CardHeader>
            <CardTitle>Struktur Organisasi</CardTitle>
            <CardDescription>
              Kelola daftar jabatan dan nama pejabat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {form.organization.map((o, idx) => (
                <div
                  key={idx}
                  className="grid md:grid-cols-3 gap-3 items-start border rounded-md p-3"
                >
                  <Input
                    placeholder="Jabatan (mis. Kepala Sekolah)"
                    value={o.role}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((p) => {
                        const organization = [...p.organization];
                        organization[idx] = { ...organization[idx], role: val };
                        return { ...p, organization } as any;
                      });
                    }}
                    className="border border-primary-600"
                  />
                  <Input
                    placeholder="Nama"
                    value={o.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((p) => {
                        const organization = [...p.organization];
                        organization[idx] = { ...organization[idx], name: val };
                        return { ...p, organization } as any;
                      });
                    }}
                    className="border border-primary-600"
                  />
              <div>
                    <ImageUpload
                      label="Foto (opsional)"
                      value={o.image || ""}
                      onChange={(v) => {
                        setForm((p) => {
                          const organization = [...p.organization];
                          organization[idx] = {
                            ...organization[idx],
                            image: v,
                          };
                          return { ...p, organization } as any;
                        });
                      }}
                      maxSizeMB={5}
                    />
                  </div>
                  <div className="md:col-span-3 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          organization: p.organization.filter(
                            (_, i) => i !== idx
                          ),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    organization: [
                      ...p.organization,
                      { role: "", name: "", image: "" },
                    ],
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Tambah Jabatan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alamat & Kontak */}
        <Card className="border border-primary-900">
          <CardHeader>
            <CardTitle>Alamat & Kontak</CardTitle>
            <CardDescription>
              Informasi lokasi dan kontak sekolah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                placeholder="Jalan"
                value={form.address.street}
                onChange={(e) => update("address.street", e.target.value)}
                className="border border-primary-600"
              />
              <Input
                placeholder="Kelurahan"
                value={form.address.kelurahan}
                onChange={(e) => update("address.kelurahan", e.target.value)}
                className="border border-primary-600"
              />
              <Input
                placeholder="Kecamatan"
                value={form.address.kecamatan}
                onChange={(e) => update("address.kecamatan", e.target.value)}
                className="border border-primary-600"
              />
              <Input
                placeholder="Kota/Kabupaten"
                value={form.address.city}
                onChange={(e) => update("address.city", e.target.value)}
                className="border border-primary-600"
              />
              <Input
                placeholder="Provinsi"
                value={form.address.province}
                onChange={(e) => update("address.province", e.target.value)}
                className="border border-primary-600"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-3 mt-4">
              <Input
                placeholder="Telepon"
                value={form.contact.phone}
                onChange={(e) => update("contact.phone", e.target.value)}
                className="border border-primary-600"
              />
              <Input
                placeholder="Email"
                value={form.contact.email}
                onChange={(e) => update("contact.email", e.target.value)}
                className="border border-primary-600"
              />
              <Input
                placeholder="Instagram URL"
                value={form.contact.instagram}
                onChange={(e) => update("contact.instagram", e.target.value)}
                className="border border-primary-600"
              />
              <Input
                placeholder="Facebook URL"
                value={form.contact.facebook}
                onChange={(e) => update("contact.facebook", e.target.value)}
                className="border border-primary-600"
              />
              <Input
                placeholder="YouTube URL"
                value={form.contact.youtube}
                onChange={(e) => update("contact.youtube", e.target.value)}
                className="border border-primary-600"
              />
              </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            className="bg-primary-950 text-white"
            onClick={() => updateMutation.mutate(form)}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
