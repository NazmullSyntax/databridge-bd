import { z } from "zod";

export const createRequestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  objective: z.string().min(10, "Objective must be at least 10 characters"),
  dataCategory: z.string().min(1, "Category is required"),
  requiredFields: z.string().min(1, "Required fields is required"),
  targetLocation: z.string().min(1, "Location is required"),
  targetAudience: z.string().optional(),
  targetVolume: z.number().int().positive().optional(),
  methodPref: z.string().optional(),
  dataFormat: z.string().optional(),
  deadline: z.string().optional(),
  budgetMin: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  additionalNotes: z.string().optional(),
});
