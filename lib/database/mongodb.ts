import { MongoClient, Db, Collection } from "mongodb";
import { User, Teacher, Student, Admin } from "@/lib/types";

// MongoDB connection
let client: MongoClient;
let db: Db;

export const connectToDatabase = async (): Promise<Db> => {
  if (db) {
    return db;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(process.env.MONGODB_DB_NAME || "smk_database");

    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

// Database collections
export const getCollections = async () => {
  const database = await connectToDatabase();

  return {
    users: database.collection<User>("users"),
    teachers: database.collection<Teacher>("teachers"),
    students: database.collection<Student>("students"),
    admins: database.collection<Admin>("admins"),
    courses: database.collection("courses"),
    majors: database.collection("majors"),
    schedules: database.collection("schedules"),
    grades: database.collection("grades"),
    announcements: database.collection("announcements"),
    gallery: database.collection("gallery"),
    activities: database.collection("activities"),
    staff: database.collection("staff"),
    internships: database.collection("internships"),
    news: database.collection("news"),
    profile: database.collection("profile"),
  };
};

// Database utility functions
export const dbUtils = {
  // Create indexes for better performance
  createIndexes: async () => {
    const collections = await getCollections();

    // Users indexes
    await collections.users.createIndex({ email: 1 }, { unique: true });
    await collections.users.createIndex({ role: 1 });

    // Teachers indexes
    await collections.teachers.createIndex({ teacherId: 1 }, { unique: true });
    await collections.teachers.createIndex({ email: 1 }, { unique: true });

    // Students indexes
    await collections.students.createIndex({ studentId: 1 }, { unique: true });
    await collections.students.createIndex({ email: 1 }, { unique: true });
    await collections.students.createIndex({ class: 1 });
    await collections.students.createIndex({ major: 1 });

    // Courses indexes
    await collections.courses.createIndex({ code: 1 }, { unique: true });
    await collections.courses.createIndex({ majorId: 1 });
    await collections.courses.createIndex({ teacherId: 1 });

    // Schedules indexes
    await collections.schedules.createIndex({ classId: 1 });
    await collections.schedules.createIndex({ teacherId: 1 });
    await collections.schedules.createIndex({ day: 1 });

    // Grades indexes
    await collections.grades.createIndex({ studentId: 1 });
    await collections.grades.createIndex({ subjectId: 1 });
    await collections.grades.createIndex({ teacherId: 1 });
    await collections.grades.createIndex({ semester: 1, year: 1 });

    // Announcements indexes
    await collections.announcements.createIndex({ category: 1 });
    await collections.announcements.createIndex({ isPublished: 1 });
    await collections.announcements.createIndex({ publishedAt: -1 });

    // Gallery indexes
    await collections.gallery.createIndex({ category: 1 });
    await collections.gallery.createIndex({ isPublished: 1 });

    // Activities indexes
    await collections.activities.createIndex({ category: 1 });
    await collections.activities.createIndex({ isActive: 1 });

    // Staff indexes
    await collections.staff.createIndex({ position: 1 });
    await collections.staff.createIndex({ department: 1 });

    // Internships indexes
    await collections.internships.createIndex({ isActive: 1 });
    await collections.internships.createIndex({ companyName: 1 });
  },

  // Seed initial data
  seedInitialData: async () => {
    const collections = await getCollections();

    // Check if data already exists
    const userCount = await collections.users.countDocuments();
    if (userCount > 0) {
      console.log("Database already has data, skipping seed");
      return;
    }

    // Create default admin user
    const defaultAdmin = {
      _id: new Date().toISOString(),
      email: "admin@smk.edu",
      name: "Administrator",
      role: "admin" as const,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: [
        "manage_users",
        "manage_content",
        "manage_academic",
        "view_reports",
        "system_settings",
      ],
    };

    await collections.users.insertOne(defaultAdmin);
    await collections.admins.insertOne({
      ...defaultAdmin,
      permissions: defaultAdmin.permissions,
    });

    console.log("Initial data seeded successfully");
  },

  // Database health check
  healthCheck: async () => {
    try {
      const database = await connectToDatabase();
      await database.admin().ping();
      return { status: "healthy", timestamp: new Date() };
    } catch (error) {
      return {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};

// Close database connection
export const closeDatabaseConnection = async () => {
  if (client) {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
};

// Error handling utilities
export const handleDatabaseError = (error: any) => {
  console.error("Database error:", error);

  if (error.code === 11000) {
    // Duplicate key error
    const field = Object.keys(error.keyPattern)[0];
    return {
      message: `${field} sudah digunakan`,
      field,
      code: "DUPLICATE_KEY",
    };
  }

  if (error.name === "ValidationError") {
    // Validation error
    const errors = Object.values(error.errors).map((err: any) => err.message);
    return {
      message: errors.join(", "),
      code: "VALIDATION_ERROR",
    };
  }

  return {
    message: "Terjadi kesalahan pada database",
    code: "DATABASE_ERROR",
  };
};

// Pagination utilities
export const paginate = (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return { skip, limit };
};

// Sort utilities
export const createSortObject = (
  sortBy: string,
  sortOrder: "asc" | "desc" = "desc"
) => {
  const order = sortOrder === "asc" ? 1 : -1;
  return { [sortBy]: order };
};

// Filter utilities
export const createFilterObject = (filters: Record<string, any>) => {
  const filter: Record<string, any> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "string") {
        filter[key] = { $regex: value, $options: "i" };
      } else if (Array.isArray(value)) {
        filter[key] = { $in: value };
      } else {
        filter[key] = value;
      }
    }
  });

  return filter;
};
