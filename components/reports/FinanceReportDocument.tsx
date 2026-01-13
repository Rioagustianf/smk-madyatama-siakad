/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
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
  periodText: {
    fontSize: 11,
    marginTop: 5,
    fontFamily: "Helvetica-Bold",
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: 150,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
  },
  infoValue: {
    flex: 1,
  },

  // Table Container
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

  tableRow: {
    flexDirection: "row",
    width: "100%",
  },

  cell: {
    borderStyle: "solid",
    borderColor: "#000",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    padding: 4,
    fontSize: 8,
    justifyContent: "center",
  },

  headerCell: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    alignItems: "center",
  },

  // Column widths
  widthNo: { width: "5%", textAlign: "center" },
  widthName: { width: "20%" },
  widthClass: { width: "10%", textAlign: "center" },
  widthTitle: { width: "20%" },
  widthAmount: { width: "15%", textAlign: "right" },
  widthStatus: { width: "12%", textAlign: "center" },
  widthDate: { width: "18%", textAlign: "center" },

  centeredText: {
    textAlign: "center",
    width: "100%",
  },

  rightText: {
    textAlign: "right",
    width: "100%",
  },

  summary: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#000",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  summaryValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },

  footer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  signatureBlock: {
    width: "40%",
    alignItems: "center",
    textAlign: "center",
  },
  signatureSpace: {
    height: 60,
  },
  signatureName: {
    width: "100%",
    paddingBottom: 2,
    fontFamily: "Helvetica-Bold",
    fontWeight: "bold",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#000",
  },
  signatureLabel: {
    fontSize: 9,
    marginTop: 2,
  },
});

interface BillItem {
  id: string;
  title: string;
  amount: number;
  status: string;
  dueDate: string;
  student: {
    name: string;
    class: string;
    nisn?: string;
  };
  payments?: Array<{
    id: string;
    amount: number;
    paidAt: string;
    method: string;
  }>;
}

interface FinanceReportDocumentProps {
  month: number;
  year: number;
  bills: BillItem[];
  staffName?: string;
}

export const FinanceReportDocument: React.FC<FinanceReportDocumentProps> = ({
  month,
  year,
  bills,
  staffName = "Staff Keuangan",
}) => {
  // Filter bills yang sudah dibayar di bulan tersebut
  const paidBills = bills.filter((bill) => {
    if (bill.status !== "PAID") return false;
    // Cek apakah ada payment di bulan ini
    const hasPaymentInMonth = bill.payments?.some((payment) => {
      const paymentDate = new Date(payment.paidAt);
      return (
        paymentDate.getMonth() === month && paymentDate.getFullYear() === year
      );
    });
    return hasPaymentInMonth;
  });

  // Hitung total pendapatan
  const totalIncome = paidBills.reduce((sum, bill) => {
    const paymentsInMonth =
      bill.payments?.filter((payment) => {
        const paymentDate = new Date(payment.paidAt);
        return (
          paymentDate.getMonth() === month && paymentDate.getFullYear() === year
        );
      }) || [];
    return (
      sum + paymentsInMonth.reduce((pSum, p) => pSum + Number(p.amount), 0)
    );
  }, 0);

  const monthName = format(new Date(year, month, 1), "MMMM yyyy", {
    locale: id,
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Laporan Keuangan</Text>
          <Text style={styles.headerSubtitle}>SMK MADYATAMA PALEMBANG</Text>
          <Text style={styles.periodText}>Periode: {monthName}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tanggal Cetak</Text>
            <Text style={styles.infoValue}>
              : {format(new Date(), "dd MMMM yyyy", { locale: id })}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Transaksi</Text>
            <Text style={styles.infoValue}>: {paidBills.length} transaksi</Text>
          </View>
        </View>

        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <View style={[styles.cell, styles.headerCell, styles.widthNo]}>
              <Text>No</Text>
            </View>
            <View style={[styles.cell, styles.headerCell, styles.widthName]}>
              <Text>Nama Siswa</Text>
            </View>
            <View style={[styles.cell, styles.headerCell, styles.widthClass]}>
              <Text>Kelas</Text>
            </View>
            <View style={[styles.cell, styles.headerCell, styles.widthTitle]}>
              <Text>Tagihan</Text>
            </View>
            <View style={[styles.cell, styles.headerCell, styles.widthAmount]}>
              <Text>Jumlah</Text>
            </View>
            <View style={[styles.cell, styles.headerCell, styles.widthStatus]}>
              <Text>Status</Text>
            </View>
            <View style={[styles.cell, styles.headerCell, styles.widthDate]}>
              <Text>Tanggal Bayar</Text>
            </View>
          </View>

          {/* Data Rows */}
          {paidBills.length === 0 ? (
            <View style={styles.tableRow}>
              <View
                style={[styles.cell, { width: "100%", borderRightWidth: 1 }]}
              >
                <Text style={styles.centeredText}>
                  Tidak ada transaksi di bulan ini
                </Text>
              </View>
            </View>
          ) : (
            paidBills.map((bill, index) => {
              const payment = bill.payments?.find((p) => {
                const paymentDate = new Date(p.paidAt);
                return (
                  paymentDate.getMonth() === month &&
                  paymentDate.getFullYear() === year
                );
              });
              return (
                <View style={styles.tableRow} key={bill.id}>
                  <View style={[styles.cell, styles.widthNo]}>
                    <Text style={styles.centeredText}>{index + 1}</Text>
                  </View>
                  <View style={[styles.cell, styles.widthName]}>
                    <Text>{bill.student.name}</Text>
                  </View>
                  <View style={[styles.cell, styles.widthClass]}>
                    <Text style={styles.centeredText}>
                      {bill.student.class}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.widthTitle]}>
                    <Text>{bill.title}</Text>
                  </View>
                  <View style={[styles.cell, styles.widthAmount]}>
                    <Text style={styles.rightText}>
                      Rp{" "}
                      {Number(payment?.amount || bill.amount).toLocaleString(
                        "id-ID"
                      )}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.widthStatus]}>
                    <Text style={styles.centeredText}>Lunas</Text>
                  </View>
                  <View style={[styles.cell, styles.widthDate]}>
                    <Text style={styles.centeredText}>
                      {payment?.paidAt
                        ? format(new Date(payment.paidAt), "dd/MM/yyyy", {
                            locale: id,
                          })
                        : "-"}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Total Pendapatan Bulan {monthName}:
            </Text>
            <Text style={styles.summaryValue}>
              Rp {totalIncome.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>

        {/* Signature */}
        <View style={styles.footer}>
          <View style={styles.signatureBlock}>
            <Text>
              Palembang, {format(new Date(), "d MMMM yyyy", { locale: id })}
            </Text>
            <Text>Staff Keuangan,</Text>
            <View style={styles.signatureSpace} />
            <Text style={styles.signatureName}>{staffName}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
