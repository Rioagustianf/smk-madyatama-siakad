/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingTop: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 25,
    borderBottomWidth: 3,
    borderBottomColor: "#000",
    borderStyle: "solid",
    paddingBottom: 10,
    textAlign: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },
  infoContainer: {
    marginBottom: 20,
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: 130,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
  },
  infoSeparator: {
    width: 15,
    textAlign: "center",
  },
  infoValue: {
    flex: 1,
    textTransform: "uppercase",
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
  },

  // Table Container: Top & Left Borders Only
  table: {
    width: "100%",
    borderStyle: "solid",
    borderColor: "#000",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },

  // Rows
  tableRow: {
    flexDirection: "row",
    width: "100%",
  },

  // General Cell: Right & Bottom Borders Only
  cell: {
    borderStyle: "solid",
    borderColor: "#000",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    padding: 4,
    fontSize: 9,
    justifyContent: "center",
  },

  // Header Specific
  headerCell: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    alignItems: "center",
  },

  // Widths
  widthNo: { width: "6%", textAlign: "center" },
  widthMapel: { width: "46%" },
  widthNilai: { width: "12%", textAlign: "center" },
  widthAkhir: { width: "12%", textAlign: "center" },
  widthPredikat: { width: "12%", textAlign: "center" },

  centeredText: {
    textAlign: "center",
    width: "100%",
  },

  footer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    width: "30%",
    alignItems: "center",
    textAlign: "center",
  },
  signatureSpace: {
    height: 70,
  },
  signatureName: {
    width: "100%",
    paddingBottom: 2,
    fontFamily: "Helvetica-Bold",
    fontWeight: "bold",
    textAlign: "center",
  },
  signatureLabel: {
    fontSize: 9,
    marginTop: 2,
  },
});

interface GradeItem {
  subject: string;
  subjectName?: string;
  assignments?: number;
  midterm?: number;
  final?: number;
  total?: number;
  grade?: string;
}

interface StudentReportDocumentProps {
  studentName: string;
  nisn: string;
  className: string;
  semester: string | number;
  grades: GradeItem[];
  parentName?: string;
  homeroomTeacher?: string;
  homeroomTeacherNip?: string;
  headmaster?: string;
  headmasterNip?: string;
}

export const StudentReportDocument: React.FC<StudentReportDocumentProps> = ({
  studentName,
  nisn,
  className,
  semester,
  grades,
  parentName,
  homeroomTeacher,
  homeroomTeacherNip,
  headmaster,
  headmasterNip,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Laporan Hasil Belajar Peserta Didik
          </Text>
          <Text style={styles.headerSubtitle}>SMK MADYATAMA PALEMBANG</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama Peserta Didik</Text>
            <Text style={styles.infoSeparator}>:</Text>
            <Text style={styles.infoValue}>{studentName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NISN/NIS</Text>
            <Text style={styles.infoSeparator}>:</Text>
            <Text style={styles.infoValue}>{nisn}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kelas/Program Keahlian</Text>
            <Text style={styles.infoSeparator}>:</Text>
            <Text style={styles.infoValue}>
              {className} / Teknik Komputer dan Jaringan
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Semester</Text>
            <Text style={styles.infoSeparator}>:</Text>
            <Text style={styles.infoValue}>{semester}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, { height: 40 }]}>
            <View style={[styles.cell, styles.headerCell, styles.widthNo]}>
              <Text>No.</Text>
            </View>
            <View style={[styles.cell, styles.headerCell, styles.widthMapel]}>
              <Text>Mata Pelajaran</Text>
            </View>
            <View
              style={[
                {
                  width: "24%",
                  flexDirection: "column",
                  borderRightWidth: 1,
                  borderRightColor: "#000",
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderTopWidth: 0,
                  borderLeftWidth: 0,
                  borderStyle: "solid",
                },
              ]}
            >
              <View
                style={[
                  styles.headerCell,
                  {
                    flex: 1,
                    width: "100%",
                    borderRightWidth: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: "#000",
                    borderBottomStyle: "solid",
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                  },
                ]}
              >
                <Text>Nilai</Text>
              </View>

              <View style={{ flex: 1, flexDirection: "row", width: "100%" }}>
                <View
                  style={[
                    styles.headerCell,
                    {
                      flex: 1,
                      borderRightWidth: 1,
                      borderRightColor: "#000",
                      borderBottomWidth: 0,
                      borderTopWidth: 0,
                      borderLeftWidth: 0,
                      borderStyle: "solid",
                    },
                  ]}
                >
                  <Text>P</Text>
                </View>
                <View
                  style={[
                    styles.headerCell,
                    {
                      flex: 1,
                      borderRightWidth: 0,
                      borderBottomWidth: 0,
                      borderTopWidth: 0,
                      borderLeftWidth: 0,
                    },
                  ]}
                >
                  <Text>K</Text>
                </View>
              </View>
            </View>

            <View style={[styles.cell, styles.headerCell, styles.widthAkhir]}>
              <Text>Nilai Akhir</Text>
            </View>

            <View
              style={[styles.cell, styles.headerCell, styles.widthPredikat]}
            >
              <Text>Predikat</Text>
            </View>
          </View>

          {grades.length === 0 ? (
            <View style={styles.tableRow}>
              <View
                style={[styles.cell, { width: "100%", borderRightWidth: 1 }]}
              >
                <Text style={styles.centeredText}>Belum ada data nilai</Text>
              </View>
            </View>
          ) : (
            grades.map((grade, index) => {
              const pengetahuan =
                grade.midterm != null && grade.final != null
                  ? Math.round(
                      (Number(grade.midterm) + Number(grade.final)) / 2
                    )
                  : "-";

              const keterampilan =
                grade.assignments != null ? Number(grade.assignments) : "-";

              const nilaiAkhir = grade.total
                ? Math.round(Number(grade.total))
                : "-";
              const predikat = grade.grade || "-";

              return (
                <View style={styles.tableRow} key={index}>
                  <View style={[styles.cell, styles.widthNo]}>
                    <Text style={styles.centeredText}>{index + 1}</Text>
                  </View>
                  <View
                    style={[
                      styles.cell,
                      styles.widthMapel,
                      { justifyContent: "flex-start", textAlign: "left" },
                    ]}
                  >
                    <Text style={{ paddingLeft: 2 }}>
                      {grade.subjectName || grade.subject}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.widthNilai]}>
                    <Text style={styles.centeredText}>{pengetahuan}</Text>
                  </View>
                  <View style={[styles.cell, styles.widthNilai]}>
                    <Text style={styles.centeredText}>{keterampilan}</Text>
                  </View>
                  <View style={[styles.cell, styles.widthAkhir]}>
                    <Text style={[styles.centeredText, { fontWeight: "bold" }]}>
                      {nilaiAkhir}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.widthPredikat]}>
                    <Text style={styles.centeredText}>{predikat}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <Text
          style={{
            fontSize: 8,
            fontStyle: "italic",
            marginBottom: 20,
            color: "#444",
          }}
        >
          Keterangan: P = Pengetahuan (Rata-rata UTS & UAS), K = Keterampilan
          (Tugas)
        </Text>

        {/* Baris Atas: Orang Tua (Kiri) dan Wali Kelas (Kanan) */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 30,
          }}
        >
          <View style={{ width: "45%", alignItems: "center" }}>
            {/* Placeholder untuk sejajar dengan tanggal */}
            <Text> </Text>
            <Text>Orang Tua/Wali,</Text>
            <View style={styles.signatureSpace} />
            <Text style={styles.signatureName}>{parentName || " "}</Text>
            {/* Placeholder untuk sejajar dengan NIP */}
            <Text style={styles.signatureLabel}> </Text>
          </View>
          <View style={{ width: "45%", alignItems: "center" }}>
            <Text>
              Palembang, {format(new Date(), "d MMMM yyyy", { locale: id })}
            </Text>
            <Text>Wali Kelas,</Text>
            <View style={styles.signatureSpace} />
            <Text style={styles.signatureName}>{homeroomTeacher || " "}</Text>
            <Text style={styles.signatureLabel}>
              NIP. {homeroomTeacherNip || "-"}
            </Text>
          </View>
        </View>

        {/* Baris Bawah: Kepala Sekolah (Tengah) */}
        <View style={{ alignItems: "center", marginTop: 30 }}>
          <Text>Mengetahui,</Text>
          <Text>Kepala Sekolah,</Text>
          <View style={styles.signatureSpace} />
          <Text style={styles.signatureName}>{headmaster || " "}</Text>
          <Text style={styles.signatureLabel}>NIP. {headmasterNip || "-"}</Text>
        </View>
      </Page>
    </Document>
  );
};
