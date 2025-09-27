import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type GradeRow = {
  subject: string;
  assignments: number;
  midterm: number;
  final: number;
  total: number;
  grade: string;
};

const mockGrades: GradeRow[] = [
  {
    subject: "Matematika",
    assignments: 85,
    midterm: 80,
    final: 90,
    total: 85,
    grade: "A",
  },
  {
    subject: "Bahasa Indonesia",
    assignments: 78,
    midterm: 82,
    final: 80,
    total: 80,
    grade: "B",
  },
  {
    subject: "Produktif RPL",
    assignments: 88,
    midterm: 86,
    final: 92,
    total: 89,
    grade: "A",
  },
];

export default function StudentGradesPage() {
  return (
    <div className="rounded-xl border border-primary-900 bg-white p-5">
      <h1 className="text-xl font-semibold mb-3">Nilai Saya</h1>
      <Table>
        <TableHeader>
          <TableRow className="bg-primary-950/90 hover:bg-primary-950/90">
            <TableHead className="text-white">Mata Pelajaran</TableHead>
            <TableHead className="text-white">Tugas</TableHead>
            <TableHead className="text-white">UTS</TableHead>
            <TableHead className="text-white">UAS</TableHead>
            <TableHead className="text-white">Total</TableHead>
            <TableHead className="text-white">Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockGrades.map((g) => (
            <TableRow key={g.subject}>
              <TableCell>{g.subject}</TableCell>
              <TableCell>{g.assignments}</TableCell>
              <TableCell>{g.midterm}</TableCell>
              <TableCell>{g.final}</TableCell>
              <TableCell>{g.total}</TableCell>
              <TableCell>{g.grade}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
