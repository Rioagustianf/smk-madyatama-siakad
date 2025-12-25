import { NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

// Test API untuk mengirim notifikasi WhatsApp ke nomor tertentu
// Client bisa test apakah notifikasi terkirim dengan benar
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, phoneNumber } = body;

    // Validasi input
    if (!type) {
      return NextResponse.json(
        {
          success: false,
          pesan:
            "Parameter 'type' wajib diisi. Gunakan: holiday, school_entry, atau absence",
        },
        { status: 400 }
      );
    }

    if (!phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          pesan: "Parameter 'phoneNumber' wajib diisi. Contoh: 081234567890",
        },
        { status: 400 }
      );
    }

    // Validasi format nomor telepon
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json(
        {
          success: false,
          pesan:
            "Format nomor telepon tidak valid. Gunakan format: 081234567890",
        },
        { status: 400 }
      );
    }

    let message = "";
    let namaNotifikasi = "";

    switch (type) {
      case "holiday":
        namaNotifikasi = "Notifikasi Hari Libur";
        message = `*Informasi Hari Libur*\n\nBesok Hari Kemerdekaan RI. Sekolah libur. Sampai jumpa lagi!\n\n_Ini adalah pesan test dari sistem notifikasi otomatis._`;
        break;

      case "school_entry":
        namaNotifikasi = "Notifikasi Masuk Sekolah";
        message = `*Informasi Masuk Sekolah*\n\nBesok masuk sekolah seperti biasa setelah libur Hari Kemerdekaan RI. Jangan lupa persiapkan diri!\n\n_Ini adalah pesan test dari sistem notifikasi otomatis._`;
        break;

      case "absence":
        namaNotifikasi = "Peringatan Ketidakhadiran";
        message = `*⚠️ Peringatan Ketidakhadiran*\n\nAnda telah tidak masuk sekolah (ALPHA) selama 3 hari berturut-turut:\n- 22/12/2025\n- 23/12/2025\n- 24/12/2025\n\nHarap segera konfirmasi kehadiran atau hubungi pihak sekolah.\n\n_Ini adalah pesan test dari sistem notifikasi otomatis._`;
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            pesan: `Tipe '${type}' tidak valid. Gunakan: holiday, school_entry, atau absence`,
          },
          { status: 400 }
        );
    }

    console.log(`[TEST] Mengirim ${namaNotifikasi} ke ${phoneNumber}...`);

    // Kirim WhatsApp
    const sent = await sendWhatsAppMessage(phoneNumber, message);

    if (sent) {
      console.log(
        `[TEST] ✓ ${namaNotifikasi} berhasil dikirim ke ${phoneNumber}`
      );
      return NextResponse.json({
        success: true,
        pesan: `${namaNotifikasi} berhasil dikirim!`,
        data: {
          tipe: type,
          namaNotifikasi,
          nomorTujuan: phoneNumber,
          pesanTerkirim: message,
          waktu: new Date().toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
          }),
        },
      });
    } else {
      console.error(
        `[TEST] ✗ Gagal mengirim ${namaNotifikasi} ke ${phoneNumber}`
      );
      return NextResponse.json(
        {
          success: false,
          pesan:
            "Gagal mengirim WhatsApp. Periksa konfigurasi WhatsApp di pengaturan.",
          data: {
            tipe: type,
            namaNotifikasi,
            nomorTujuan: phoneNumber,
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[TEST] Error:", error);
    return NextResponse.json(
      {
        success: false,
        pesan: "Terjadi kesalahan saat mengirim notifikasi test",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint untuk menampilkan dokumentasi
export async function GET() {
  return NextResponse.json({
    success: true,
    judul: "API Test Notifikasi WhatsApp",
    deskripsi:
      "Endpoint untuk mengirim notifikasi test ke nomor WhatsApp tertentu",
    penggunaan: {
      method: "POST",
      endpoint: "/api/notifications/test",
      body: {
        type: "holiday | school_entry | absence",
        phoneNumber: "081234567890",
      },
    },
    contoh: [
      {
        nama: "Test Notifikasi Hari Libur",
        deskripsi: "Mengirim notifikasi informasi hari libur",
        request: {
          type: "holiday",
          phoneNumber: "081234567890",
        },
      },
      {
        nama: "Test Notifikasi Masuk Sekolah",
        deskripsi: "Mengirim notifikasi masuk sekolah setelah libur",
        request: {
          type: "school_entry",
          phoneNumber: "081234567890",
        },
      },
      {
        nama: "Test Peringatan Ketidakhadiran",
        deskripsi: "Mengirim peringatan alfa 3 hari berturut-turut",
        request: {
          type: "absence",
          phoneNumber: "081234567890",
        },
      },
    ],
    catatan: [
      "Pastikan WhatsApp sudah dikonfigurasi di menu Pengaturan",
      "Gunakan nomor WhatsApp yang aktif untuk testing",
      "Format nomor: 081234567890 (tanpa +62 atau spasi)",
      "Pesan yang dikirim adalah contoh, bukan data real dari database",
    ],
  });
}
