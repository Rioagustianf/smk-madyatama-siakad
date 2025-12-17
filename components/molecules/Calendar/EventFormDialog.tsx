import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export function EventFormDialog({
  open,
  onOpenChange,
  mode,
  title,
  description,
  type,
  startDate,
  endDate,
  onTitleChange,
  onDescriptionChange,
  onTypeChange,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
  onDelete,
  isLoading,
}: EventFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Tambah Event Baru" : "Edit Event"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>Judul</Label>
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Deskripsi</Label>
            <Textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
          </div>
          <div>
            <Label>Tipe</Label>
            <Select value={type} onValueChange={onTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EVENT">Event</SelectItem>
                <SelectItem value="HOLIDAY">Libur</SelectItem>
                <SelectItem value="ADMISSION">Penerimaan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tanggal Mulai</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Tanggal Selesai</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                required
              />
            </div>
          </div>
          <div
            className={
              mode === "edit"
                ? "flex justify-between"
                : "flex justify-end gap-2"
            }
          >
            {mode === "edit" && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </Button>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {mode === "add" ? "Simpan" : "Simpan Perubahan"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
