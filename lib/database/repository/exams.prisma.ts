import { prisma } from "@/lib/database/prisma";
import {
  ExamSchedulesRepository,
  FindExamSchedulesParams,
  CreateExamScheduleParams,
  UpdateExamScheduleParams,
} from "./exams";

export const examSchedulesPrismaRepository: ExamSchedulesRepository = {
  async findMany(params: FindExamSchedulesParams) {
    const {
      page = 1,
      limit = 10,
      search,
      classId,
      subjectId,
      type,
      teacherId,
      startDate,
      endDate,
    } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        {
          subject: {
            name: { contains: search },
          },
        },
        {
          class: {
            name: { contains: search },
          },
        },
      ];
    }

    if (classId && classId !== "all") {
      where.classId = classId;
    }

    if (subjectId && subjectId !== "all") {
      where.subjectId = subjectId;
    }

    if (type && type !== "all") {
      where.type = type;
    }

    // Filter by date range if provided
    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    } else if (startDate) {
      where.date = {
        gte: startDate,
      };
    } else if (endDate) {
      where.date = {
        lte: endDate,
      };
    }

    // If filtering by teacher, find subjects taught by this teacher
    if (teacherId) {
      const subjectsTaught = await prisma.subject.findMany({
        where: { teacherId },
        select: { id: true },
      });
      const subjectIds = subjectsTaught.map((s) => s.id);

      // Add to existing subject filter or create new one
      if (where.subjectId) {
        // If subjectId is already set, ensure it's one of the teacher's subjects
        if (!subjectIds.includes(where.subjectId)) {
          return { data: [], total: 0 };
        }
      } else {
        where.subjectId = { in: subjectIds };
      }
    }

    const [data, total] = await Promise.all([
      prisma.examSchedule.findMany({
        where,
        include: {
          subject: true,
          class: true,
        },
        orderBy: { date: "asc" },
        skip,
        take: limit,
      }),
      prisma.examSchedule.count({ where }),
    ]);

    return { data, total };
  },

  findById(id: string) {
    return prisma.examSchedule.findUnique({
      where: { id },
      include: {
        subject: true,
        class: true,
      },
    });
  },

  create(data: CreateExamScheduleParams) {
    return prisma.examSchedule.create({
      data,
      include: {
        subject: true,
        class: true,
      },
    });
  },

  update(id: string, data: UpdateExamScheduleParams) {
    return prisma.examSchedule.update({
      where: { id },
      data,
      include: {
        subject: true,
        class: true,
      },
    });
  },

  async remove(id: string) {
    await prisma.examSchedule.delete({ where: { id } });
  },
};
