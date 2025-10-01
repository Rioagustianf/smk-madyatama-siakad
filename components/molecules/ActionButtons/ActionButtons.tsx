"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, GraduationCap, BookOpen } from "lucide-react";
import { DeleteConfirmation } from "../DeleteConfirmation/DeleteConfirmation";
import { MajorForm } from "../MajorForm/MajorForm";
import { SubjectForm } from "../SubjectForm/SubjectForm";
import { GalleryForm, GalleryFormData } from "../GalleryForm/GalleryForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { debugLog } from "@/lib/utils/debug";

interface MajorFormData {
  name: string;
  code: string;
  description: string;
  image: string;
  facilities: string[];
  careerProspects: string[];
}

interface SubjectFormData {
  name: string;
  code: string;
  description?: string;
  teacherId?: string;
}

interface Teacher {
  _id: string;
  name: string;
  education?: string;
}

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  itemName: string;
  formData: MajorFormData | SubjectFormData | GalleryFormData;
  onInputChange: (field: string, value: string | string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onCancel: () => void;
  isEditDialogOpen: boolean;
  onEditDialogChange: (open: boolean) => void;
  formType?: "major" | "subject" | "gallery";
  teachers?: Teacher[];
}

export function ActionButtons({
  onEdit,
  onDelete,
  itemName,
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  onCancel,
  isEditDialogOpen,
  onEditDialogChange,
  formType = "major",
  teachers = [],
}: ActionButtonsProps) {
  const isSubject = formType === "subject";
  const isMajor = formType === "major";
  const isGallery = formType === "gallery";

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogChange}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
              await debugLog("Edit button clicked", { itemName });
              onEdit();
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isSubject ? (
                <BookOpen className="h-5 w-5" />
              ) : (
                <GraduationCap className="h-5 w-5" />
              )}
              {isSubject
                ? "Edit Mata Pelajaran"
                : isGallery
                ? "Edit Galeri"
                : "Edit Program Keahlian"}
            </DialogTitle>
            <DialogDescription>
              {isSubject
                ? "Perbarui informasi mata pelajaran"
                : isGallery
                ? "Perbarui informasi galeri"
                : "Perbarui informasi program keahlian"}
            </DialogDescription>
          </DialogHeader>
          {isSubject ? (
            <SubjectForm
              formData={formData as SubjectFormData}
              onInputChange={onInputChange}
              onSubmit={onSubmit}
              isLoading={isLoading}
              submitText="Perbarui"
              onCancel={onCancel}
              teachers={teachers}
            />
          ) : isGallery ? (
            <GalleryForm
              formData={formData as GalleryFormData}
              onInputChange={onInputChange}
              onSubmit={onSubmit}
              isLoading={isLoading}
              submitText="Perbarui"
              onCancel={onCancel}
            />
          ) : (
            <MajorForm
              formData={formData as MajorFormData}
              onInputChange={onInputChange}
              onSubmit={onSubmit}
              isLoading={isLoading}
              submitText="Perbarui"
              onCancel={onCancel}
            />
          )}
        </DialogContent>
      </Dialog>
      <DeleteConfirmation
        onConfirm={onDelete}
        itemName={itemName}
        trigger={
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        }
      />
    </div>
  );
}
