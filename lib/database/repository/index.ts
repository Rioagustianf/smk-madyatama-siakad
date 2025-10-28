import { majorsPrismaRepository } from "./majors.prisma";
import type { MajorsRepository } from "./majors";
import { studentsPrismaRepository } from "./students.prisma";
import type { StudentsRepository } from "./students";
import { teachersPrismaRepository } from "./teachers.prisma";
import type { TeachersRepository } from "./teachers";
import { subjectsPrismaRepository } from "./subjects.prisma";
import type { SubjectsRepository } from "./subjects";
import { classesPrismaRepository } from "./classes.prisma";
import type { ClassesRepository } from "./classes";
import { schedulesPrismaRepository } from "./schedules.prisma";
import type { SchedulesRepository } from "./schedules";
import { gradesPrismaRepository } from "./grades.prisma";
import type { GradesRepository } from "./grades";
import { announcementsPrismaRepository } from "./announcements.prisma";
import type { AnnouncementsRepository } from "./announcements";
import { galleryPrismaRepository } from "./gallery.prisma";
import type { GalleryRepository } from "./gallery";
import { activitiesPrismaRepository } from "./activities.prisma";
import type { ActivitiesRepository } from "./activities";
import { staffPrismaRepository } from "./staff.prisma";
import type { StaffRepository } from "./staff";
import { adminsPrismaRepository } from "./admins.prisma";
import type { AdminsRepository } from "./admins";
import { profilePrismaRepository } from "./profile.prisma";
import type { ProfileRepository } from "./profile";
import { internshipPartnersPrismaRepository, internshipSchedulesPrismaRepository } from "./internships.prisma";
import type { InternshipPartnersRepository, InternshipSchedulesRepository } from "./internships";

export function getMajorsRepository(): MajorsRepository {
  return majorsPrismaRepository;
}

export function getStudentsRepository(): StudentsRepository {
  return studentsPrismaRepository;
}

export function getTeachersRepository(): TeachersRepository {
  return teachersPrismaRepository;
}
export function getSubjectsRepository(): SubjectsRepository {
  return subjectsPrismaRepository;
}
export function getClassesRepository(): ClassesRepository {
  return classesPrismaRepository;
}
export function getSchedulesRepository(): SchedulesRepository {
  return schedulesPrismaRepository;
}
export function getGradesRepository(): GradesRepository {
  return gradesPrismaRepository;
}
export function getAnnouncementsRepository(): AnnouncementsRepository {
  return announcementsPrismaRepository;
}
export function getGalleryRepository(): GalleryRepository {
  return galleryPrismaRepository;
}
export function getActivitiesRepository(): ActivitiesRepository {
  return activitiesPrismaRepository;
}
export function getStaffRepository(): StaffRepository {
  return staffPrismaRepository;
}
export function getAdminsRepository(): AdminsRepository {
  return adminsPrismaRepository;
}
export function getProfileRepository(): ProfileRepository {
  return profilePrismaRepository;
}
export function getInternshipPartnersRepository(): InternshipPartnersRepository {
  return internshipPartnersPrismaRepository;
}
export function getInternshipSchedulesRepository(): InternshipSchedulesRepository {
  return internshipSchedulesPrismaRepository;
}


